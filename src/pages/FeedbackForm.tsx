import React from 'react';
import FeedbackFormComponent from '../components/feedback/FeedbackForm';

const FeedbackFormPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Share Your Voice</h1>
          <p className="text-neutral-600">
            Your feedback helps improve campus events and activities for everyone.
          </p>
        </div>
        
        <FeedbackFormComponent />
      </div>
    </div>
  );
};

export default FeedbackFormPage;