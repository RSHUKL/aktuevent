import React, { useState } from 'react';
import { Star, Loader } from 'lucide-react';
import { useFeedbackStore, Event } from '../../store/feedbackStore';
import { useAuthStore } from '../../store/authStore';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const { events, createFeedback, isLoading } = useFeedbackStore();
  const { user } = useAuthStore();
  
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  
  // Group events by category
  const eventsByCategory = events.reduce((acc: Record<string, Event[]>, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {});
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!selectedEvent) {
      setFormError('Please select an event');
      return;
    }
    
    if (rating === 0) {
      setFormError('Please provide a rating');
      return;
    }
    
    // Create feedback object
    const feedbackData = {
      eventId: selectedEvent,
      rating,
      comment,
      isAnonymous,
      userId: isAnonymous ? undefined : user?.id,
      userName: isAnonymous ? undefined : user?.name,
    };
    
    try {
      await createFeedback(feedbackData);
      setIsSubmitted(true);
      
      // Reset form
      setSelectedEvent('');
      setRating(0);
      setComment('');
      setIsAnonymous(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setFormError('Error submitting feedback. Please try again.');
    }
  };
  
  const handleRating = (value: number) => {
    setRating(value);
  };
  
  if (isSubmitted) {
    return (
      <div className="card animate-fade-in max-w-xl mx-auto">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-success-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Thank You for Your Feedback!</h3>
          <p className="text-neutral-600 mb-6">Your feedback helps us improve campus events for everyone.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card animate-fade-in max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Share Your Experience</h3>
      
      {formError && (
        <div className="bg-error-50 border-l-4 border-error-500 p-4 mb-4 text-error-700">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="event" className="label">Select Event</label>
          <select
            id="event"
            className="select"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select an event --</option>
            {Object.entries(eventsByCategory).map(([category, events]) => (
              <optgroup key={category} label={category}>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.date})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="label">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className="focus:outline-none transition-all duration-200"
                onClick={() => handleRating(value)}
              >
                <Star 
                  className={`h-8 w-8 ${
                    value <= rating 
                      ? 'text-warning-400 fill-warning-400' 
                      : 'text-neutral-300'
                  }`} 
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="label">
            Comments <span className="text-neutral-500 text-xs">({comment.length}/500)</span>
          </label>
          <textarea
            id="comment"
            className="textarea h-32"
            placeholder="Share your thoughts about the event..."
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
          ></textarea>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="anonymous"
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-neutral-700">
              Submit anonymously
            </label>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Your identity will not be shared with event organizers.
          </p>
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;