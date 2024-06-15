import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../RolesRoutes/AuthProvider';

const BlogBack = () => {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    content: '',
    image: null,
    category: [],
    tags: [],
    status: 'draft'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);


  useEffect(() => {
    if (token) {
      fetchBlogs();
      fetchCategories();
      fetchTags();
      console.log("Token in BlogBack:", token);
    }
  }, [token]);

  const fetchBlogs = async () => {
    if (!token) {
      console.error('No token available for fetching blogs');
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/blog-backoffice/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data);
      console.log(`Bearer ${token}`); 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Authentication error:', error.response.data);
      } else {
        console.error('Error fetching blogs:', error);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tags/');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }; 

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedCategories = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(parseInt(options[i].value, 10));
      }
    }
    setForm({ ...form, category: selectedCategories });
  };

  const handleTagChange = (e) => {
    const options = e.target.options;
    const selectedTags = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedTags.push(parseInt(options[i].value, 10));
      }
    }
    setForm({ ...form, tags: selectedTags });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting with token:', token);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    if (form.image) formData.append('image', form.image);
    form.category.forEach((cat, index) => formData.append(`category[${index}]`, cat));
    form.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    formData.append('status', form.status);
  
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, 
    };
    
    try {
      const url = isEditing ? `http://127.0.0.1:8000/api/blog-backoffice/${form.id}/` : 'http://127.0.0.1:8000/api/add-blog/';
      const method = isEditing ? axios.patch : axios.post;
      const response = await method(url, formData, { headers });
      console.log('Response:', response);
      setForm({ id: null, title: '', content: '', image: null, category: [], tags: [], status: 'draft' });
      setIsEditing(false);
      fetchBlogs();
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  const handleEdit = (blog) => {
    setForm({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: null,
      category: blog.category.map(cat => cat.id),
      tags: blog.tags.map(tag => tag.id),
      status: blog.status
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blog-backoffice/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (isEditing) {
      setIsEditing(false);
      setForm({ id: null, title: '', content: '', image: null, category: [], tags: [], status: 'draft' });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Blogs</h1>
      <button onClick={toggleForm} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        {showForm ? 'Hide Form' : 'Add Blog'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="author">Author</label>
            <input
              type="text"
              name="author"
              value={user?.username || ''}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="content">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="image">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="category">Category</label>
            <select
              multiple
              name="category"
              value={form.category}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="tags">Tags</label>
            <select
              multiple
              name="tags"
              value={form.tags}
              onChange={handleTagChange}
              className="w-full p-2 border rounded"
            >
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="status">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            {isEditing ? 'Update' : 'Add'} Blog
          </button>
        </form>
      )}
      <div>
        <h2 className="text-xl font-bold mb-4">Blog List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[90rem] overflow-y-auto container flex-wrap">
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <div key={blog.id} className="group">
                <div className="relative">
                  <img src={blog.image} className="w-full h-36 object-cover" alt={blog.title} />
                </div>
                <div className="font-Garamond border border-gray-300 dark:border-gray-700 border-t-0">
                  <div className="py-6 px-4">
                    <div className="flex items-center space-x-4">
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                        {new Date(blog.posted_on).toLocaleDateString()}
                      </p>
                      <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                        {blog.category.map(cat => categories.find(category => category.id === cat)?.name || 'Unknown').join(', ')}
                      </p>
                    </div>
                    <Link to={`/blog_details/${blog.id}`} state={{ blog }}>
                      <h2 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white py-2 hover:underline">
                        {blog.title}
                      </h2>
                    </Link>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-700 py-2">
                    <div className="px-4 flex items-center justify-between">
                      <button onClick={() => handleEdit(blog)} className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogBack;
