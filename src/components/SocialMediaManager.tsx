import React, { useState, useEffect } from 'react';
import { X, Settings, Play, Pause, AlertCircle } from 'react-feather';
import SocialMediaAgent from '../services/SocialMediaAgent';

interface SocialMediaManagerProps {
  onClose: () => void;
}

const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({ onClose }) => {
  const [config, setConfig] = useState({
    maxTweetsPerDay: 12,
    frequency: 'daily',
    customHours: 24,
    topics: ['AI', 'Web Development', 'Tech Trends', 'Programming'],
    platforms: ['twitter'],
    tone: 'professional'
  });

  const [isRunning, setIsRunning] = useState(false);
  const [lastPost, setLastPost] = useState<any>(null);
  const [agent, setAgent] = useState<SocialMediaAgent | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAgent = async () => {
      try {
        setIsInitializing(true);
        // Check if all required environment variables are present
        const requiredEnvVars = {
          'GROQ API Key': import.meta.env.VITE_GROQ_API_KEY,
          'Twitter API Key': import.meta.env.VITE_TWITTER_API_KEY,
          'Twitter API Secret': import.meta.env.VITE_TWITTER_API_SECRET,
          'Twitter Access Token': import.meta.env.VITE_TWITTER_ACCESS_TOKEN,
          'Twitter Access Secret': import.meta.env.VITE_TWITTER_ACCESS_SECRET
        };

        for (const [name, value] of Object.entries(requiredEnvVars)) {
          if (!value) {
            throw new Error(`Missing ${name} in environment variables`);
          }
        }

        const newAgent = new SocialMediaAgent(
          import.meta.env.VITE_GROQ_API_KEY!,
          {
            apiKey: import.meta.env.VITE_TWITTER_API_KEY!,
            apiSecret: import.meta.env.VITE_TWITTER_API_SECRET!,
            accessToken: import.meta.env.VITE_TWITTER_ACCESS_TOKEN!,
            accessSecret: import.meta.env.VITE_TWITTER_ACCESS_SECRET!
          }
        );

        // Set initial configuration
        newAgent.setConfig({
          maxTweetsPerDay: 12,
          frequency: 'daily'
        });

        setAgent(newAgent);
        setIsRunning(true);
        setError(null);

        // Update status immediately and start status updates
        const updateStatus = () => {
          const currentStatus = newAgent.getStatus();
          setStatus(currentStatus);
          setIsRunning(!!currentStatus.isRunning);
        };

        updateStatus();
        const statusInterval = setInterval(updateStatus, 60 * 1000);

        // Cleanup function
        return () => {
          clearInterval(statusInterval);
          if (newAgent) {
            newAgent.stopScheduledPosts();
          }
        };
      } catch (error) {
        console.error('Error initializing agent:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize social media agent');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAgent();
  }, []);

  const handleConfigChange = (field: string, value: any) => {
    if (!agent || isInitializing) return;

    setConfig(prev => ({
      ...prev,
      [field]: value
    }));

    agent.setConfig({ ...config, [field]: value });
    setStatus(agent.getStatus());
  };

  const handleStartStop = async () => {
    if (!agent || isInitializing) return;

    try {
      if (!isRunning) {
        agent.setConfig(config);
        await agent.startScheduledPosts();
        setIsRunning(true);
      } else {
        agent.stopScheduledPosts();
        setIsRunning(false);
      }
      setStatus(agent.getStatus());
    } catch (error) {
      console.error('Error toggling agent:', error);
      setError(error instanceof Error ? error.message : 'Failed to toggle agent state');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Media Manager
            {isInitializing && ' (Initializing...)'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error ? (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Display */}
            {status && (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Status</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Tweets Posted Today: {status.tweetsPostedToday}</p>
                  <p>Max Tweets Per Day: {status.maxTweetsPerDay}</p>
                  <p>Last Tweet: {status.lastTweetTime ? new Date(status.lastTweetTime).toLocaleString() : 'Never'}</p>
                  <p>Status: {isRunning ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            )}

            {/* Tweets Per Day Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tweets Per Day
              </label>
              <input
                type="number"
                value={config.maxTweetsPerDay}
                onChange={(e) => handleConfigChange('maxTweetsPerDay', parseInt(e.target.value))}
                min={1}
                max={17}
                disabled={isInitializing}
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            {/* Control Button */}
            <button
              onClick={handleStartStop}
              disabled={!agent || isInitializing}
              className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                !agent || isInitializing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isRunning
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors duration-300`}
            >
              {isInitializing ? (
                'Initializing...'
              ) : isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Posting
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Posting
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaManager; 