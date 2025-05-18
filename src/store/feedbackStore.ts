import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export interface Feedback {
  id: string;
  eventId: string;
  rating: number;
  comment: string;
  sentimentScore: number;
  createdAt: string;
  isAnonymous: boolean;
  userId?: number;
  userName?: string;
}

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
}

interface FeedbackState {
  feedback: Feedback[];
  events: Event[];
  isLoading: boolean;
  createFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'sentimentScore'>) => Promise<void>;
  getFeedbackByEvent: (eventId: string) => Feedback[];
  getEventById: (eventId: string) => Event | undefined;
}

// Generate sentiment score based on rating and comment
const generateSentimentScore = (rating: number, comment: string): number => {
  // Simple algorithm: base on rating (1-5 scale to -1 to 1 scale)
  let baseScore = (rating - 3) / 2;
  
  // Modify slightly based on comment content
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'love', 'enjoyed', 'helpful'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'hate', 'disliked', 'unhelpful', 'boring'];
  
  let commentImpact = 0;
  const lowerComment = comment.toLowerCase();
  
  positiveWords.forEach(word => {
    if (lowerComment.includes(word)) commentImpact += 0.1;
  });
  
  negativeWords.forEach(word => {
    if (lowerComment.includes(word)) commentImpact -= 0.1;
  });
  
  // Ensure the score stays within -1 to 1 range
  return Math.max(-1, Math.min(1, baseScore + commentImpact));
};

// Mock events
const MOCK_EVENTS: Event[] = [
  { id: 'event1', name: 'Fall Welcome Festival', category: 'Social', date: '2025-09-10' },
  { id: 'event2', name: 'Career Fair', category: 'Academic', date: '2025-10-15' },
  { id: 'event3', name: 'Hackathon 2025', category: 'Tech', date: '2025-11-01' },
  { id: 'event4', name: 'Alumni Networking Night', category: 'Networking', date: '2025-09-25' },
  { id: 'event5', name: 'Cultural Festival', category: 'Cultural', date: '2025-10-05' },
  { id: 'event6', name: 'Student Council Meeting', category: 'Governance', date: '2025-09-18' },
  { id: 'event7', name: 'Sports Tournament', category: 'Athletics', date: '2025-10-22' },
  { id: 'event8', name: 'Research Symposium', category: 'Academic', date: '2025-11-12' }
];

// Mock feedback data
const MOCK_FEEDBACK: Feedback[] = [
  {
    id: '1',
    eventId: 'event1',
    rating: 4,
    comment: 'Great event! Really enjoyed the activities.',
    sentimentScore: 0.65,
    createdAt: '2025-09-11T09:30:00Z',
    isAnonymous: false,
    userId: 2,
    userName: 'Student User'
  },
  {
    id: '2',
    eventId: 'event2',
    rating: 3,
    comment: 'It was okay. Could have been better organized.',
    sentimentScore: 0,
    createdAt: '2025-10-16T14:20:00Z',
    isAnonymous: true
  },
  {
    id: '3',
    eventId: 'event3',
    rating: 5,
    comment: 'Amazing experience! Learned so much and met great people.',
    sentimentScore: 0.9,
    createdAt: '2025-11-02T18:45:00Z',
    isAnonymous: false,
    userId: 2,
    userName: 'Student User'
  },
  {
    id: '4',
    eventId: 'event1',
    rating: 2,
    comment: 'Disappointing. The venue was too crowded and hot.',
    sentimentScore: -0.6,
    createdAt: '2025-09-11T11:15:00Z',
    isAnonymous: true
  },
  {
    id: '5',
    eventId: 'event4',
    rating: 4,
    comment: 'Very useful networking opportunity.',
    sentimentScore: 0.7,
    createdAt: '2025-09-26T20:10:00Z',
    isAnonymous: false,
    userId: 2,
    userName: 'Student User'
  }
];

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedback: MOCK_FEEDBACK,
      events: MOCK_EVENTS,
      isLoading: false,
      
      createFeedback: async (newFeedback) => {
        set({ isLoading: true });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sentimentScore = generateSentimentScore(newFeedback.rating, newFeedback.comment);
        
        const feedback = {
          ...newFeedback,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          sentimentScore
        };
        
        set(state => ({
          feedback: [...state.feedback, feedback],
          isLoading: false
        }));
      },
      
      getFeedbackByEvent: (eventId) => {
        return get().feedback.filter(f => f.eventId === eventId);
      },
      
      getEventById: (eventId) => {
        return get().events.find(e => e.id === eventId);
      }
    }),
    {
      name: 'feedback-storage',
    }
  )
);