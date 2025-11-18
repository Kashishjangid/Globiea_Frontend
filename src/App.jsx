import React, { useEffect, useState, useCallback } from 'react';
import './index.css'

// Custom Hooks and State
import useStore from './store.js'; 
import useApi from './hooks/useApi.js';   

// Components
import CreateBlog from './components/CreateBlog';
import BlogCard from './components/BlogCard'; 
import AIAgent from './components/AIAgent';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import EditBlog from './components/EditBlog'; 

// Define view constants
const VIEW_ALL = 'all';
const VIEW_MY_BLOGS = 'my';

function App() {
  const { user, blogs, setBlogs, logout } = useStore();
  const { loading, error, request } = useApi();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentView, setCurrentView] = useState(VIEW_ALL);
  const [editingBlog, setEditingBlog] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]); // Separate state for user's blogs

  // FIXED: Separate fetch functions for different views
  const fetchAllBlogs = useCallback(async () => {
    try {
      await request('GET', '/blogs', null, setBlogs);
    } catch (err) {
      console.error("Failed to fetch all blogs:", err);
    }
  }, [request, setBlogs]);

  const fetchMyBlogs = useCallback(async () => {
    if (!user) return;
    
    try {
      await request('GET', '/blogs/my', null, setMyBlogs);
    } catch (err) {
      console.error("Failed to fetch user blogs:", err);
    }
  }, [request, user, setMyBlogs]);

  

  // Effect to fetch blogs based on current view
  useEffect(() => {
    if (currentView === VIEW_ALL) {
      fetchAllBlogs();
    } else if (currentView === VIEW_MY_BLOGS && user) {
      fetchMyBlogs();
    }
  }, [currentView, user, fetchAllBlogs, fetchMyBlogs]);

  // Effect to fetch all blogs on initial load
  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  // Helper to switch back to login view after successful signup
  const handleSignupSuccess = () => {
    setIsLoginView(true);
  };
  
  // Handlers for BlogCard
  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setCurrentView(VIEW_MY_BLOGS);
  };

  const handleEditCancel = () => {
    setEditingBlog(null);
  };

  // Re-fetch blogs after a successful edit/delete/create
  const handleActionSuccess = () => {
    setEditingBlog(null);
    if (currentView === VIEW_ALL) {
      fetchAllBlogs();
    } else if (currentView === VIEW_MY_BLOGS) {
      fetchMyBlogs();
      // Also refresh all blogs to keep everything in sync
      fetchAllBlogs();
    }
  };

  // Determine which blogs to display based on current view
  const displayedBlogs = currentView === VIEW_MY_BLOGS ? myBlogs : blogs;

  // Calculate my blogs count from the actual myBlogs state, not filtered blogs
  const myBlogsCount = myBlogs.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow p-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black text-indigo-700">MiniBlog 📝</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Welcome, {user.email}</span> 
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <span className="mr-2">Please log in or sign up below.</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        
        {/* Top Section: Auth/Create Blog & AI Agent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          <div className="lg:col-span-1">
            {editingBlog ? (
                <EditBlog blog={editingBlog} onCancel={handleEditCancel} onSuccess={handleActionSuccess} />
            ) : (
                !user ? (
                    <div className="space-y-4">
                      {isLoginView ? (
                        <>
                          <LoginForm />
                          <p className="text-center text-gray-600">
                            Need an account?{' '}
                            <button 
                              onClick={() => setIsLoginView(false)} 
                              className="text-green-600 font-semibold hover:underline transition"
                            >
                              Sign Up
                            </button>
                          </p>
                        </>
                      ) : (
                        <>
                          <SignupForm onSignupSuccess={handleSignupSuccess} />
                          <p className="text-center text-gray-600">
                            Already registered?{' '}
                            <button 
                              onClick={() => setIsLoginView(true)} 
                              className="text-indigo-600 font-semibold hover:underline transition"
                            >
                              Log In
                            </button>
                          </p>
                        </>
                      )}
                    </div>
                ) : (
                  <CreateBlog onSuccess={handleActionSuccess} />
                )
            )}
          </div>
          
          <div className="lg:col-span-2">
            <AIAgent />
          </div>
        </div>
        
        {/* Blog View Toggle and Title */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-3xl font-bold text-gray-800">
                {currentView === VIEW_ALL ? 'All Blog Posts' : 'My Posts'}
            </h2>
            <div className="flex space-x-2 p-1 bg-gray-200 rounded-lg">
                <button
                    onClick={() => setCurrentView(VIEW_ALL)}
                    className={`px-4 py-1 rounded-md transition ${currentView === VIEW_ALL ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-300'}`}
                >
                    All Blogs
                </button>
                {user && (
                    <button
                        onClick={() => setCurrentView(VIEW_MY_BLOGS)}
                        className={`px-4 py-1 rounded-md transition ${currentView === VIEW_MY_BLOGS ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-300'}`}
                    >
                        My Posts 
                    </button>
                )}
            </div>
        </div>

        {/* Blog Feed */}
        {loading && <p className="text-center text-xl text-indigo-500 py-6">Loading blogs...</p>}
        {error && <p className="text-center text-red-500 font-semibold py-6">Error fetching posts: {error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {displayedBlogs.map(blog => (
    <BlogCard 
        key={blog._id} 
        blog={blog} 
        onEdit={handleEditClick} 
        onDelete={handleActionSuccess}
    />
  ))}
</div>
        
        {displayedBlogs.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 py-10">
                {currentView === VIEW_ALL 
                  ? "No blogs published yet. Be the first!" 
                  : "You haven't posted any blogs yet."}
            </p>
        )}
      </main>
    </div>
  );
}

export default App;