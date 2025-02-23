import { type ReactNode } from "react";
import { Header } from "./Header";
import Script from "next/script";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="container mx-auto p-4">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HJZDZTJBCK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HJZDZTJBCK');
          `}
      </Script>

      <Header activeTab={activeTab} onTabChange={onTabChange} />
      {children}
    </div>
  );
}
