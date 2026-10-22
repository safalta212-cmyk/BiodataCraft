import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbCrumb {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbCrumb[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-stone-500 overflow-x-auto py-1 ${className}`}>
      <ol className="flex items-center space-x-1.5 list-none p-0 m-0">
        <li className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-amber-800 transition-colors shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-amber-800 transition-colors shrink-0 truncate max-w-[150px] sm:max-w-none"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="font-semibold text-stone-900 shrink-0 truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
