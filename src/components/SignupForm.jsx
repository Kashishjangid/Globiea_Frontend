import React, { useState } from 'react';
import  useApi  from '../hooks/useApi';

const SignupForm = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { loading, error, request } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await request('POST', '/auth/signup', { username, email, password });
      
      setUsername('');
      setEmail('');
      setPassword('');
      setSuccess(true);
      
      if (onSignupSuccess) onSignupSuccess(); 

    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-lg border-t-4 border-green-500">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">✨ Register New Account</h2>
      
      {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-3 text-center font-semibold">Registration successful! Please log in.</p>}
      
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        className="w-full p-3 mb-4 border border-gray-300 rounded" 
        required
      />
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
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;