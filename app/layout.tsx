import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fleet Management',
  description: 'AI-Powered Fleet Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        {/* LeadConnector Chat Widget */}
        <Script
          id="leadconnector-chat-widget"
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="67ff121f119caa7e6578236b"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
