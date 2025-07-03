import React from 'react';
import { Heart, Code, Globe, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              AI Website Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Comprehensive SEO and competitive analysis powered by artificial intelligence. 
              Get actionable insights to improve your website's performance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/KirthuM/webanalysis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-blue-500" />
                Website Analysis
              </li>
              <li className="flex items-center">
                <Code className="w-4 h-4 mr-2 text-green-500" />
                Technical SEO
              </li>
              <li className="flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                UX Evaluation
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-purple-500" />
                Performance Reports
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
              <p className="flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by 
                <a 
                  href="https://github.com/KirthuM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  KirthuM
                </a>
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              © {currentYear} AI Website Analysis. All rights reserved.
            </div>
          </div>
        </div>

        {/* Tech Stack Badge */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">React</span>
            <span className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">Node.js</span>
            <span className="bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded">OpenAI</span>
            <span className="bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
