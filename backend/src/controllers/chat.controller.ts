/**
 * Chat Controller — thin HTTP layer for the environmental chatbot.
 *
 * Delegates all logic to chat.service.ts.
 * Accepts { userQuery: string, regionId?: number } (also supports
 * legacy { query, regionId } for backwards compatibility).
 */

import { Request, Response } from 'express';
import { processChat, ChatInput } from '../services/chat.service';

export const handleChat = async (req: Request, res: Response) => {
  try {
    // Accept both `userQuery` (new spec) and `query` (legacy frontend)
    const userQuery: string | undefined = req.body.userQuery ?? req.body.query;
    const regionId: number | undefined = req.body.regionId
      ? Number(req.body.regionId)
      : undefined;

    if (!userQuery || typeof userQuery !== 'string') {
      res.status(400).json({
        error: 'userQuery (string) is required in the request body.',
      });
      return;
    }

    if (regionId !== undefined && isNaN(regionId)) {
      res.status(400).json({
        error: 'regionId must be a valid number.',
      });
      return;
    }

    const input: ChatInput = { userQuery, regionId };
    const result = await processChat(input);

    // Return both legacy format (for existing frontend) and structured JSON
    res.json({
      ...result.legacy,
      structured: result.structured,
      source: result.source,
      ...(result.fallbackReason && { fallbackReason: result.fallbackReason }),
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({
      error: 'Internal server error while processing chat.',
      details: '<p>Sorry, something went wrong. Please try again.</p>',
      sources: [],
      solutions: { government: [], community: [], individual: [] },
    });
  }
};
