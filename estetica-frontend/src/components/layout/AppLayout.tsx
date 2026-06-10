'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
