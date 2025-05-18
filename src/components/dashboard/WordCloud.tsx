import React, { useEffect, useState } from 'react';
import { Feedback } from '../../store/feedbackStore';

interface WordCloudProps {
  feedback: Feedback[];
}

interface WordFrequency {
  text: string;
  value: number;
  sentiment: number;
}

const WordCloud: React.FC<WordCloudProps> = ({ feedback }) => {
  const [wordFrequencies, setWordFrequencies] = useState<WordFrequency[]>([]);
  
  useEffect(() => {
    if (!feedback.length) return;
    
    // Count word frequencies and collect associated sentiment
    const wordMap = new Map<string, { count: number, sentimentSum: number }>();
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by',
      'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours', 'you', 'your', 'yours',
      'he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'their', 'theirs',
      'it', 'its', 'this', 'that', 'these', 'those', 'is', 'was', 'are', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
      'should', 'can', 'could', 'of', 'with', 'in', 'out', 'about', 'during', 'before',
      'after', 'above', 'below', 'up', 'down', 'very'
    ]);

    feedback.forEach(item => {
      if (!item.comment) return;
      
      const words = item.comment
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);
      
      words.forEach(word => {
        if (word.length < 3 || stopWords.has(word)) return;
        
        if (wordMap.has(word)) {
          const current = wordMap.get(word)!;
          wordMap.set(word, {
            count: current.count + 1,
            sentimentSum: current.sentimentSum + item.sentimentScore
          });
        } else {
          wordMap.set(word, {
            count: 1,
            sentimentSum: item.sentimentScore
          });
        }
      });
    });
    
    // Convert to array and sort by frequency
    const sortedWords = Array.from(wordMap.entries())
      .map(([text, { count, sentimentSum }]) => ({
        text,
        value: count,
        sentiment: sentimentSum / count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 35); // Take top 35 words
    
    setWordFrequencies(sortedWords);
  }, [feedback]);
  
  // Get color based on sentiment
  const getWordColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-success-600';
    if (sentiment < -0.3) return 'text-error-600';
    return 'text-primary-600';
  };
  
  // Get font size based on frequency
  const getFontSize = (value: number) => {
    const maxValue = Math.max(...wordFrequencies.map(w => w.value));
    const minSize = 14;
    const maxSize = 40;
    return minSize + ((value / maxValue) * (maxSize - minSize));
  };
  
  if (!feedback.length) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">Word Cloud</h3>
        <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">No feedback data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Word Cloud</h3>
      
      {wordFrequencies.length ? (
        <div className="flex flex-wrap justify-center p-4 gap-2">
          {wordFrequencies.map((word, index) => (
            <div
              key={index}
              className={`${getWordColor(word.sentiment)}`}
              style={{
                fontSize: `${getFontSize(word.value)}px`,
                padding: '4px',
                fontWeight: word.value > (Math.max(...wordFrequencies.map(w => w.value)) / 2) ? 'bold' : 'normal',
                transform: `rotate(${Math.random() * 10 - 5}deg)`
              }}
            >
              {word.text}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">Processing word frequencies...</p>
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-1"></div>
            <span>Positive context</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-1"></div>
            <span>Neutral context</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-error-500 rounded-full mr-1"></div>
            <span>Negative context</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;