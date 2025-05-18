import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto py-8 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-accent-500" />
              <span className="text-xl font-bold text-neutral-900">Campus Pulse</span>
            </Link>
            <p className="mt-2 text-sm text-neutral-600">
              Helping improve campus events through valuable student feedback.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/feedback" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Analytics Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-600 text-sm">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="text-neutral-600 text-sm">
                Email: support@campuspulse.edu
              </li>
              <li className="text-neutral-600 text-sm">
                Phone: (555) 123-4567
              </li>
              <li className="text-neutral-600 text-sm">
                Location: Student Center, Room 301
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-neutral-600">
              &copy; {new Date().getFullYear()} Campus Pulse. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex items-center">
              <span className="text-sm text-neutral-600 flex items-center">
                Made with <Heart className="h-4 w-4 text-error-500 mx-1" /> for students
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;