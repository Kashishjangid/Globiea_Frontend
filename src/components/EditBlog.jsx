import React, { useState } from 'react';
import useApi from '../hooks/useApi';
import { X, Save } from 'lucide-react';

const EditBlog = ({ blog, onCancel, onSuccess }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [imageFile, setImageFile] = useState(null);
  const { loading, error, request } = useApi();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    if (imageFile) {
      formData.append('blogImage', imageFile); 
    }

    try {
      await request('PUT', `/blogs/${blog._id}`, formData, null);
      onSuccess();
      console.log('Blog updated successfully!'); 
    } catch (err) {
      console.error("Blog update failed.", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-2xl rounded-lg mb-8 border-4 border-indigo-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">✏️ Edit Post</h2>
        <button onClick={onCancel} className="p-2 text-gray-500 hover:text-red-500 transition">
            <X size={24} />
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
          className="w-full p-3 border rounded-lg mb-3 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        {blog.blogImage && (
            <p className="text-xs text-gray-500 mb-2">Current Image: {blog.blogImage}</p>
        )}
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Change Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded-lg mb-4 text-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          disabled={loading || !title || !content}
        >
          {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;