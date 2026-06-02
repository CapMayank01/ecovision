'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface ChatResponse {
  details: string;
  sources: Array<{ name: string; percentage: number }>;
  solutions: {
    government: string[];
    community: string[];
    individual: string[];
  };
  navigate?: string;
  /** When the backend returns Gemini structured data, it includes this */
  structured?: {
    answer: string;
    causes: Array<{ type: string; description: string }>;
    prediction: string;
    solutions: Array<{ level: string; action: string }>;
  };
  source?: 'llm' | 'rule-based';
}

interface Message {
  content: string | ChatResponse;
  type: 'user' | 'bot';
}

export function useChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (query: string) => {
    setMessages((prev) => [...prev, { content: query, type: 'user' }]);
    setIsTyping(true);

    const errorReply = (
      details: string,
      sources: ChatResponse['sources'] = [],
      solutions: ChatResponse['solutions'] = {
        government: [],
        community: [],
        individual: [],
      }
    ): void => {
      setMessages((prev) => [...prev, { content: { details, sources, solutions }, type: 'bot' }]);
    };

    try {
      const { data } = await api.post<ChatResponse>('/api/chat', { query });

      // If the backend returned Gemini structured data, enrich the legacy format
      if (data.structured && data.source === 'llm') {
        const llm = data.structured;

        // Build richer details from the LLM answer + prediction
        const richDetails = `
          <div>
            <p>${llm.answer}</p>
            ${llm.causes?.length ? `<h4 style="margin-top:12px; color: var(--primary-color);">Key Causes</h4><ul>${llm.causes.map(c => `<li><strong>[${c.type}]</strong> ${c.description}</li>`).join('')}</ul>` : ''}
            ${llm.prediction ? `<h4 style="margin-top:12px; color: var(--primary-color);">Future Prediction</h4><p>${llm.prediction}</p>` : ''}
          </div>
        `;

        // Build sources from causes
        const sources = llm.causes?.map(c => ({
          name: `${c.type.charAt(0).toUpperCase() + c.type.slice(1)} Factor`,
          percentage: Math.round(100 / (llm.causes.length || 1)),
        })) || [];

        // Build solutions grouped by level
        const solutions: ChatResponse['solutions'] = {
          government: [],
          community: [],
          individual: [],
        };
        for (const s of llm.solutions || []) {
          const level = s.level as keyof typeof solutions;
          if (solutions[level]) solutions[level].push(s.action);
        }

        setMessages((prev) => [...prev, {
          content: { details: richDetails, sources, solutions },
          type: 'bot',
        }]);
      } else {
        // Use legacy format as-is (rule-based responses)
        setMessages((prev) => [...prev, { content: data, type: 'bot' }]);
      }

      if (typeof data.navigate === 'string' && data.navigate.length > 0) {
        router.push(data.navigate);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          errorReply(
            '<p><strong>Cannot reach the API.</strong> Make sure both the frontend (port 3000) and backend (port 5000) are running with <code>npm run dev</code>.</p>'
          );
          return;
        }
        const raw = err.response.data;
        if (raw && typeof raw === 'object') {
          const d = raw as Partial<ChatResponse> & { error?: string };
          if (typeof d.details === 'string') {
            errorReply(
              d.details,
              Array.isArray(d.sources) ? d.sources : [],
              d.solutions
                ? {
                    government: Array.isArray(d.solutions.government) ? d.solutions.government : [],
                    community: Array.isArray(d.solutions.community) ? d.solutions.community : [],
                    individual: Array.isArray(d.solutions.individual) ? d.solutions.individual : [],
                  }
                : { government: [], community: [], individual: [] }
            );
            return;
          }
          if (typeof d.error === 'string') {
            errorReply(`<p>${d.error}</p>`);
            return;
          }
        }
      }
      errorReply(
        '<p>Sorry, something went wrong. Check the browser console and try again.</p>'
      );
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, sendMessage, setMessages };
}
