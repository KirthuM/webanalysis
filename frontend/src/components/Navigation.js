// src/components/Navigation.js
import React from 'react';
import { BarChart3, Users, AlertTriangle, FileText } from 'lucide-react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'competitors', label: 'Competitor Analysis', icon: Users },
    { id: 'issues', label: 'Technical Issues', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 mb-8">
      <div className="flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
