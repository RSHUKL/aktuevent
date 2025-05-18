import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Feedback } from '../../store/feedbackStore';
import { format, parseISO } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FeedbackChartProps {
  feedback: Feedback[];
  title?: string;
}

const FeedbackChart: React.FC<FeedbackChartProps> = ({ feedback, title = 'Sentiment Trends Over Time' }) => {
  // Process feedback data
  const processChartData = () => {
    if (!feedback.length) return { labels: [], datasets: [] };
    
    // Sort by date
    const sortedFeedback = [...feedback].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // Get dates and sentiment scores
    const labels = sortedFeedback.map(item => 
      format(parseISO(item.createdAt), 'MMM d, yyyy')
    );
    
    const sentimentScores = sortedFeedback.map(item => item.sentimentScore);
    const ratings = sortedFeedback.map(item => item.rating / 5); // Normalize to 0-1 scale
    
    return {
      labels,
      datasets: [
        {
          label: 'Sentiment Score',
          data: sentimentScores,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Rating (Normalized)',
          data: ratings,
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          tension: 0.4,
          fill: false
        }
      ]
    };
  };
  
  const chartData = processChartData();
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'Rating (Normalized)') {
              return `Rating: ${(value * 5).toFixed(1)}/5`;
            }
            
            return `Sentiment: ${value.toFixed(2)} (${
              value > 0.3 ? 'Positive' : 
              value < -0.3 ? 'Negative' : 'Neutral'
            })`;
          }
        }
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          callback: function(value: any) {
            if (value === 1) return 'Very Positive';
            if (value === 0.5) return 'Positive';
            if (value === 0) return 'Neutral';
            if (value === -0.5) return 'Negative';
            if (value === -1) return 'Very Negative';
            return '';
          }
        }
      }
    }
  };
  
  if (!feedback.length) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 bg-neutral-50 rounded-lg">
          <p className="text-neutral-500">No feedback data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default FeedbackChart;