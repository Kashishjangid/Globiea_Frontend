import React, { useState } from 'react';
import useStore from '../store.js';
import useApi from '../hooks/useApi.js';
import { Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog, onEdit, onDelete, showHoverActions = true }) => { // NEW: showHoverActions prop
  
  const navigate = useNavigate();

  const { user } = useStore();
  const { request, loading } = useApi();
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // FIXED: Use user.id instead of user._id and handle null user safely
  const isAuthor = user && blog.author && (
    (blog.author._id === user.id) || 
    (blog.author === user.id) ||
    (typeof blog.author === 'object' && blog.author._id === user.id) ||
    (typeof blog.author === 'string' && blog.author === user.id)
  );

  const handleDelete = async () => {
    if (!user || !isAuthor) return;

    try {
      await request('DELETE', `/blogs/${blog._id}`);
      onDelete(); // Notify App to re-fetch
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };
  
  // Utility to format date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Utility to get author email/name for display
  const getAuthorDisplay = () => {
    console.log('Blog Author Data:', blog.author.username);
    // if (typeof blog.author.username === 'object' && blog.author.username) {
      return blog.author.username;
    // } else if (typeof blog.author === 'object' && blog.author.email) {
      // return blog.author.email;
    // } else if (user && isAuthor) {
      // return user.email || 'You';
    // } else {
      // return 'Unknown User';
    // }
  };

    const handleCardClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 border border-gray-100 relative"
      onMouseEnter={() => showHoverActions && setIsHovered(true)} // Only set hover if showHoverActions is true
      onMouseLeave={() => showHoverActions && setIsHovered(false)} // Only set hover if showHoverActions is true
      onClick={handleCardClick}
    >
      {/* Action Buttons Overlay - Only show if showHoverActions is true and user is author */}
      {showHoverActions && isAuthor && isHovered && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-10 transition-opacity duration-300 rounded-xl">
          {!showConfirm ? (
            <div className="flex space-x-4">
              <button 
                onClick={() => onEdit(blog)}
                className="p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition shadow-lg flex items-center gap-2"
                disabled={loading}
              >
                <Edit size={18} /> Edit
              </button>
              <button 
                onClick={() => setShowConfirm(true)}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg flex items-center gap-2"
                disabled={loading}
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-2xl text-center">
              <p className="text-gray-800 font-semibold mb-3">Are you sure?</p>
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Blog Content */}
      {blog.blogImage && (
        <img 
          src={`http://localhost:3000${blog.blogImage}`} 
          alt={blog.title} 
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/CCCCCC/333333?text=Image+Missing"; }}
        />
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{blog.content}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
            <span className={`text-sm font-medium mr-3 ${isAuthor ? 'text-green-600' : 'text-indigo-500'}`}>
                {getAuthorDisplay()}
                {isAuthor && ' (You)'}
            </span>
            <span className="text-xs text-gray-400">
                | {formatDate(blog.createdAt)}
            </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;