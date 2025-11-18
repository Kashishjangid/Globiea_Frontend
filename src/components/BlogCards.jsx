import React from 'react';

const BlogCard = ({ blog }) => {
  const imageBaseUrl = 'http://localhost:3000'; 
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-400">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{blog.title}</h3>
      
      {blog.imageUrl && (
        <img 
          src={`${imageBaseUrl}${blog.imageUrl}`} 
          alt={blog.title} 
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      
      <p className="text-gray-600 mb-4">{blog.content.substring(0, 150)}...</p>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span className="font-medium">Author: {blog.author?.email || 'N/A'}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      
    </div>
  );
};

export default BlogCard;