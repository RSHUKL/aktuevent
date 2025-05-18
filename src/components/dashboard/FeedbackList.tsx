import React from 'react';
import { format, parseISO } from 'date-fns';
import { Feedback, Event } from '../../store/feedbackStore';
import { User, UserRound } from 'lucide-react';

interface FeedbackListProps {
  feedback: Feedback[];
  events: Event[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedback, events }) => {
  // Sort feedback by date (newest first)
  const sortedFeedback = [...feedback].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Get event name by id
  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  };
  
  // Determine sentiment class
  const getSentimentClass = (score: number) => {
    if (score > 0.5) return 'bg-success-100 text-success-800';
    if (score > 0) return 'bg-success-50 text-success-700';
    if (score > -0.5) return 'bg-warning-50 text-warning-700';
    return 'bg-error-50 text-error-700';
  };
  
  // Get sentiment label
  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return 'Very Positive';
    if (score > 0) return 'Positive';
    if (score > -0.5) return 'Negative';
    return 'Very Negative';
  };
  
  if (!sortedFeedback.length) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Recent Feedback</h3>
        <div className="flex items-center justify-center h-40 bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">No feedback available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Recent Feedback</h3>
      
      <div className="divide-y divide-neutral-200">
        {sortedFeedback.map(item => (
          <div key={item.id} className="py-4 animate-fade-in">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2">
                  {item.isAnonymous ? (
                    <UserRound className="h-4 w-4 text-neutral-500" />
                  ) : (
                    <User className="h-4 w-4 text-primary-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-neutral-900">
                    {item.isAnonymous ? 'Anonymous User' : item.userName}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {format(parseISO(item.createdAt), 'MMM d, yyyy • h:mm a')}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg 
                      key={star}
                      className={`h-4 w-4 ${star <= item.rating ? 'text-warning-400 fill-warning-400' : 'text-neutral-300'}`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${getSentimentClass(item.sentimentScore)}`}>
                  {getSentimentLabel(item.sentimentScore)}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-neutral-700 mb-2">
              {item.comment || <span className="text-neutral-400 italic">No comment provided</span>}
            </div>
            
            <div className="text-xs text-neutral-500">
              Event: <span className="font-medium">{getEventName(item.eventId)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;