import React, { useState } from 'react';
import  useApi  from '../hooks/useApi';
import  useStore  from '../store';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const { addBlog } = useStore();
  const { loading, error, request } = useApi();

  const handleFileChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (blogImage) {
      formData.append('blogImage', blogImage); 
    }

    try {
      await request('POST', '/blogs/create', formData, addBlog);
      setTitle('');
      setContent('');
      setBlogImage(null);
      alert('Blog published successfully!');
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4 text-green-700">✍️ Publish a New Blog</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      
      <form onSubmit={handlePublish}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-3 border rounded mb-3"
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
          className="w-full p-3 border rounded mb-3"
          required
        />
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Optional Image Upload
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          disabled={loading || !title || !content}
        >
          {loading ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;