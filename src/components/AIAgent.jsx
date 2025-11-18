import React, { useState } from 'react';
import useApi from '../hooks/useApi';

const AIAgent = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [responseNote, setResponseNote] = useState('');
  const { loading, error, request } = useApi();

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setAiResponse('');
    setResponseNote('');

    try {
      await request('POST', '/ai/query', { question: query }, (data) => {
        setAiResponse(data.answer);
        setResponseNote(data.note);
      });
      setQuery('');
    } catch (err) {
      console.error('AI Request failed:', err);
    }
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-8 border border-blue-200">
      <h2 className="text-xl font-bold text-blue-800 mb-3">🤖 MiniBlog Support Agent</h2>
      
      <form onSubmit={handleAskAI} className="flex flex-col gap-3">
        <input 
          type="text"
          className="p-3 border rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ask about features, tech stack, or support..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Analyzing...' : 'Ask Agent'}
        </button>
      </form>
      
      {aiResponse && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-gray-800">Agent Response:</p>
            {responseNote && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {responseNote}
              </span>
            )}
          </div>
          <p className="text-gray-700 mt-1">{aiResponse}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="font-bold text-red-800">Error:</p>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AIAgent;