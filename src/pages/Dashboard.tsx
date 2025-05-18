import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFeedbackStore } from '../store/feedbackStore';
import EventSelector from '../components/dashboard/EventSelector';
import SentimentSummary from '../components/dashboard/SentimentSummary';
import FeedbackChart from '../components/dashboard/FeedbackChart';
import FeedbackList from '../components/dashboard/FeedbackList';
import WordCloud from '../components/dashboard/WordCloud';
import { Download } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { feedback, events } = useFeedbackStore();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Filter feedback by selected event
  const filteredFeedback = selectedEventId 
    ? feedback.filter(f => f.eventId === selectedEventId) 
    : feedback;
  
  // Get selected event
  const selectedEvent = selectedEventId 
    ? events.find(e => e.id === selectedEventId) 
    : undefined;

  // Check if user is admin
  if (user?.role !== 'admin') {
    return <Navigate to="/feedback" replace />;
  }
  
  // Export feedback data as CSV
  const exportFeedbackData = () => {
    const dataToExport = filteredFeedback.map(f => {
      const event = events.find(e => e.id === f.eventId);
      return {
        'Event': event?.name || 'Unknown',
        'Rating': f.rating,
        'Comment': f.comment,
        'Sentiment Score': f.sentimentScore,
        'Date': new Date(f.createdAt).toLocaleDateString(),
        'Time': new Date(f.createdAt).toLocaleTimeString(),
        'Anonymous': f.isAnonymous ? 'Yes' : 'No'
      };
    });
    
    // Convert to CSV
    const headers = Object.keys(dataToExport[0]);
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => {
          // Escape quotes and wrap in quotes if contains commas
          const value = String(row[header as keyof typeof row]);
          const escaped = value.includes('"') ? value.replace(/"/g, '""') : value;
          return escaped.includes(',') ? `"${escaped}"` : escaped;
        }).join(',')
      )
    ];
    
    // Download file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback-data-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Analytics Dashboard</h1>
          <p className="text-neutral-600">
            Actionable insights from student feedback
          </p>
        </div>
        
        <button 
          onClick={exportFeedbackData}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>
      
      <EventSelector 
        events={events} 
        selectedEventId={selectedEventId} 
        onSelectEvent={setSelectedEventId} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SentimentSummary feedback={filteredFeedback} event={selectedEvent} />
        <FeedbackChart 
          feedback={filteredFeedback} 
          title={selectedEvent ? `${selectedEvent.name} - Sentiment Trends` : 'Overall Sentiment Trends'} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WordCloud feedback={filteredFeedback} />
        <FeedbackList feedback={filteredFeedback} events={events} />
      </div>
    </div>
  );
};

export default Dashboard;