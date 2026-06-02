import '@/styles/globals.css';
import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ChatbotPanel from '@/components/chatbot/ChatbotPanel';

export const metadata: Metadata = {
  title: 'EcoVision - Environmental Prediction',
  description: 'Environmental prediction dashboard using rule-based calculations on pre-processed data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <main style={{ padding: '2rem', minHeight: 'calc(100vh - 60px)' }}>
              {children}
            </main>
          </div>
        </div>
        <ChatbotPanel />
      </body>
    </html>
  );
}
