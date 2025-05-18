import React, { useMemo } from 'react';
import { Feedback, Event } from '../../store/feedbackStore';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentSummaryProps {
  feedback: Feedback[];
  event?: Event;
}

const SentimentSummary: React.FC<SentimentSummaryProps> = ({ feedback, event }) => {
  const { 
    averageSentiment,
    averageRating,
    sentimentTrend,
    totalFeedback,
    sentimentDistribution
  } = useMemo(() => {
    if (!feedback.length) {
      return {
        averageSentiment: 0,
        averageRating: 0,
        sentimentTrend: 'neutral',
        totalFeedback: 0,
        sentimentDistribution: { positive: 0, neutral: 0, negative: 0 }
      };
    }

    // Calculate average sentiment score
    const avgSentiment = feedback.reduce((sum, item) => sum + item.sentimentScore, 0) / feedback.length;
    
    // Calculate average rating
    const avgRating = feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length;
    
    // Determine sentiment distribution
    const distribution = feedback.reduce((acc, item) => {
      if (item.sentimentScore > 0.3) acc.positive += 1;
      else if (item.sentimentScore < -0.3) acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });
    
    // Calculate percentages
    const totalCount = feedback.length;
    distribution.positive = Math.round((distribution.positive / totalCount) * 100);
    distribution.neutral = Math.round((distribution.neutral / totalCount) * 100);
    distribution.negative = Math.round((distribution.negative / totalCount) * 100);
    
    // Determine sentiment trend (if more than 2 feedback items)
    let trend = 'neutral';
    if (feedback.length > 2) {
      // Sort by created date
      const sortedFeedback = [...feedback].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      // Split into two halves and compare
      const midpoint = Math.floor(sortedFeedback.length / 2);
      const firstHalf = sortedFeedback.slice(0, midpoint);
      const secondHalf = sortedFeedback.slice(midpoint);
      
      const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.sentimentScore, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.sentimentScore, 0) / secondHalf.length;
      
      if (secondHalfAvg > firstHalfAvg + 0.1) trend = 'positive';
      else if (secondHalfAvg < firstHalfAvg - 0.1) trend = 'negative';
    }
    
    return {
      averageSentiment: avgSentiment,
      averageRating: avgRating,
      sentimentTrend: trend,
      totalFeedback: feedback.length,
      sentimentDistribution: distribution
    };
  }, [feedback]);
  
  // Convert sentiment score to percentage for display
  const sentimentPercentage = Math.round((averageSentiment + 1) * 50);
  
  // Determine color based on sentiment
  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-success-600';
    if (score < -0.3) return 'text-error-600';
    return 'text-warning-500';
  };
  
  const getTrendIcon = () => {
    if (sentimentTrend === 'positive') return <TrendingUp className="h-5 w-5 text-success-500" />;
    if (sentimentTrend === 'negative') return <TrendingDown className="h-5 w-5 text-error-500" />;
    return <Minus className="h-5 w-5 text-neutral-400" />;
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">
        {event ? `${event.name} - Sentiment Summary` : 'Overall Sentiment Summary'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="text-sm font-medium text-neutral-500 mb-1">Average Sentiment</div>
          <div className={`text-2xl font-bold ${getSentimentColor(averageSentiment)}`}>
            {averageSentiment > 0 ? '+' : ''}{averageSentiment.toFixed(2)}
          </div>
          <div className="flex items-center mt-1 text-sm">
            {getTrendIcon()}
            <span className="ml-1">
              {sentimentTrend === 'positive' ? 'Improving' : 
               sentimentTrend === 'negative' ? 'Declining' : 'Stable'}
            </span>
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="text-sm font-medium text-neutral-500 mb-1">Average Rating</div>
          <div className="text-2xl font-bold text-warning-500">{averageRating.toFixed(1)}/5.0</div>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'text-warning-400 fill-warning-400' : 'text-neutral-300'}`}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
        
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="text-sm font-medium text-neutral-500 mb-1">Total Feedback</div>
          <div className="text-2xl font-bold text-neutral-900">{totalFeedback}</div>
          <div className="text-sm text-neutral-500 mt-1">
            Submissions analyzed
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Sentiment Distribution</h4>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div 
            className="bg-success-500" 
            style={{ width: `${sentimentDistribution.positive}%` }}
          ></div>
          <div 
            className="bg-neutral-400" 
            style={{ width: `${sentimentDistribution.neutral}%` }}
          ></div>
          <div 
            className="bg-error-500" 
            style={{ width: `${sentimentDistribution.negative}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-neutral-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-success-500 rounded-full mr-1"></div>
            <span>Positive ({sentimentDistribution.positive}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-neutral-400 rounded-full mr-1"></div>
            <span>Neutral ({sentimentDistribution.neutral}%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-error-500 rounded-full mr-1"></div>
            <span>Negative ({sentimentDistribution.negative}%)</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Sentiment Meter</h4>
        <div className="relative h-8 bg-gradient-to-r from-error-500 via-warning-500 to-success-500 rounded-full">
          <div 
            className="absolute h-full w-1 bg-white border-2 border-neutral-800 rounded-full transform -translate-x-1/2"
            style={{ left: `${sentimentPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-neutral-600">
          <span>Very Negative</span>
          <span>Neutral</span>
          <span>Very Positive</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentSummary;