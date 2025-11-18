import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi.js';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, request } = useApi();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        await request('GET', `/blogs/${id}`, null, setBlog);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, request]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-indigo-500">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-500">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Blogs
        </button>

        {/* Blog Content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Blog Image */}
          {blog.blogImage && (
            <img 
              src={`https://globiea-backend-1.onrender.com${blog.blogImage}`} 
              alt={blog.title} 
              className="w-full h-96 object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/800x400/CCCCCC/333333?text=Image+Missing"; 
              }}
            />
          )}

          <div className="p-8">
            {/* Blog Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Author and Date Info */}
            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">
                  {blog.author?.username || blog.author?.email || 'Unknown Author'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-8 whitespace-pre-line">
                {blog.content}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlog;