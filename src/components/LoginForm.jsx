import React, { useState } from 'react';
import  useStore  from '../store';
import  useApi  from '../hooks/useApi';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useStore();
  const { loading, error, request } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await request('POST', '/auth/login', { email, password });
      
      if (data.token) {
        login(data.user, data.token);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg border-t-4 border-indigo-500">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">🔐 Log In</h2>
      
      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
      
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        className="w-full p-3 mb-4 border border-gray-300 rounded" 
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        className="w-full p-3 mb-6 border border-gray-300 rounded" 
        required
      />
      <button 
        type="submit" 
        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;