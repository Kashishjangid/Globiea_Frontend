import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SingleBlog from './components/SingleBlog.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
      </Routes>
    </Router>
  
  </StrictMode>,
)