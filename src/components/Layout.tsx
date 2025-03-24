import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, List, BarChart, User, Clock, MapPin, Settings, DollarSign } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Rules', path: '/rules', icon: <List className="w-5 h-5" /> },
    { name: 'Rule Editor', path: '/rule-editor', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Logs', path: '/logs', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Transaction Preview', path: '/transaction-preview', icon: <Clock className="w-5 h-5" /> },
    { name: 'Rule Executions', path: '/rule-executions', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Category Mapping', path: '/category-mapping', icon: <Settings className="w-5 h-5" /> },
    { name: 'YNAB Settings', path: '/ynab-settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-app-background">
        <header className="bg-white/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-heading font-semibold text-app-blue">Transaction Rules</h1>
                </div>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium font-fredoka transition-all-300 ${
                        isActive
                          ? 'border-app-blue text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`
                    }
                    end={item.path === '/rules'}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <div className="pt-16 min-h-screen animate-fade-in">
          <main>
            <div className="page-container">
              {children}
            </div>
          </main>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-1px_2px_rgba(0,0,0,0.05)] sm:hidden">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex justify-around">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center p-3 text-xs font-medium font-fredoka transition-all-300 ${
                      isActive
                        ? 'text-app-blue'
                        : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                  end={item.path === '/rules'}
                >
                  {item.icon}
                  <span className="mt-1">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
