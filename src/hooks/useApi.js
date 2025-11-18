import { useState, useCallback } from 'react';
import axios from 'axios';
import useStore from '../store.js';

const API_BASE_URL = 'https://globiea-backend.onrender.com/api'; 

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const store = useStore(); 

const request = useCallback(async (method, url, data = null, onSuccess = null) => {
  const currentToken = store.token;

  setLoading(true);
  setError(null);
  try {
    
    let headers = {};
    
    if (currentToken) {
      headers['x-auth-token'] = currentToken;
    }

    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      headers,
    };


    if (data && method !== 'DELETE' && method !== 'GET') {
      
      if (data instanceof FormData) {
        config.data = data;
      } else {
        config.data = data;
        headers['Content-Type'] = 'application/json';
      }
    }

    console.log('API Request Config:', {
      method,
      url: `${API_BASE_URL}${url}`,
      hasData: !!data && method !== 'DELETE' && method !== 'GET',
      hasToken: !!currentToken,
      headers
    });
    
    const res = await axios(config);
    
    console.log('API Response:', res.data);
    
    if (onSuccess) onSuccess(res.data);
    
    return res.data;
    
  } catch (err) {
    console.error("API Request Failed:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: err.config
    });
    
    const msg = err.response?.data?.message || err.response?.data?.msg || 'Request failed';
    setError(msg);
    
    throw err;
  } finally {
    setLoading(false);
  }
}, [store.token]);

  return { loading, error, request };
};

export default useApi;