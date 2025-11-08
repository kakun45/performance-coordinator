
import React, { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Linkedin } from 'lucide-react';

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
      
      {isAuthenticated && (
        <>
          <div className="border-t bg-background/95 backdrop-blur py-3 pb-20">
            <div className="container flex items-center justify-center gap-6">
              <a 
                href="https://medium.com/@xeniya-shoiko/when-marching-bands-and-apps-collide-my-grand-finale-of-an-idea-f705afd2438b" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>About</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/xeniya-shoiko/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
          <BottomNavigation />
        </>
      )}
    </div>
  );
};

export default Layout;
