import { type ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="container mx-auto p-4">
      <Header activeTab={activeTab} onTabChange={onTabChange} />
      {children}
    </div>
  );
} 