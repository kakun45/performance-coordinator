
import React, { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {title && (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-14 flex items-center">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>
      )}
      
      <main className="flex-1 container pb-20">
        {children}
      </main>
      
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
};

export default Layout;
