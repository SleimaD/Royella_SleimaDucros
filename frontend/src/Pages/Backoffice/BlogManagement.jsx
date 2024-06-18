import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../RolesRoutes/AuthProvider'; 
import { Link } from 'react-router-dom';
import { MdEdit } from "react-icons/md";

const BlogManagement = () => {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [draftBlogs, setDraftBlogs] = useState([]);
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: '',
    content: '',
    image: null,
    category: [],
    tags: [],
    status: 'draft' 
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchBlogs();
  }, [token]);

  const fetchCategories = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/categories/');
    setCategories(response.data);
  };

  const fetchTags = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/tags/');
    setTags(response.data);
  };

  const fetchBlogs = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/blogs/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBlogs(response.data);
    setDraftBlogs(response.data.filter(blog => blog.status === 'draft'));
    setPendingBlogs(response.data.filter(blog => blog.status === 'pending'));
    setPublishedBlogs(response.data.filter(blog => blog.status === 'approved'));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setForm({ ...form, category: selectedCategories });
  };

  const handleTagChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
    setForm({ ...form, tags: selectedTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
        console.error("User ID is missing.");
        return; 
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    if (form.image) formData.append('image', form.image);
    form.category.forEach(cat => formData.append('category', cat));
    form.tags.forEach(tag => formData.append('tags', tag));
    formData.append('status', form.status);
    formData.append('author_id', user.id); 

    const headers = {
        'Content-Type': 'multipart/form-data'
    };

    const url = isEditing ? `http://127.0.0.1:8000/api/blogs/${form.id}/` : 'http://127.0.0.1:8000/api/add-blog-for-writer/';
    const method = isEditing ? axios.patch : axios.post;

    try {
      const response = await method(url, formData, { headers });
      console.log('Blog saved:', response.data);
      fetchBlogs();
      setForm({
        id: null,
        title: '',
        content: '',
        image: null,
        category: [],
        tags: [],
        status: 'draft'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting blog:', error.response ? error.response.data : error);
    }
  };

  const handleEdit = (blog) => {
    setIsEditing(true);
    setForm({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: null,
      category: blog.category,
      tags: blog.tags,
      status: blog.status
    });
  };

  const submitForReview = async (blog) => {
    const updatedBlog = {
      ...blog,
      status: 'pending'
    };
  
    const formData = new FormData();
    formData.append('title', updatedBlog.title);
    formData.append('content', updatedBlog.content);
    
    
    if (updatedBlog.image instanceof File) {
      formData.append('image', updatedBlog.image);
    }
  
    updatedBlog.category.forEach(cat => formData.append('category', cat));
    updatedBlog.tags.forEach(tag => formData.append('tags', tag));
    formData.append('status', updatedBlog.status);
    formData.append('author_id', user.id);
  
    try {
      const response = await axios({
        method: 'patch',
        url: `http://127.0.0.1:8000/api/blogs/${updatedBlog.id}/`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Blog submitted for review:', response.data);
      fetchBlogs();
    } catch (error) {
      console.error('Error submitting blog for review:', error.response ? error.response.data : error);
    }
  };

  const approveBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      status: 'approved'
    };
  
    const formData = new FormData();
    formData.append('title', updatedBlog.title);
    formData.append('content', updatedBlog.content);
  
    if (updatedBlog.image instanceof File) {
      formData.append('image', updatedBlog.image);
    }
  
    updatedBlog.category.forEach(cat => formData.append('category', cat));
    updatedBlog.tags.forEach(tag => formData.append('tags', tag));
    formData.append('status', updatedBlog.status);
    formData.append('author_id', updatedBlog.author_id); 
  
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/blogs/${updatedBlog.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Blog approved:', response.data);
      fetchBlogs();
    } catch (error) {
      console.error('Error approving blog:', error.response ? error.response.data : error);
    }
  };
  
  const renderBlogs = (blogs, showActions) => (
    <div className='container mx-auto px-4 py-8 w-full flex flex-wrap justify-center items-center gap-3'>
      {blogs.length > 0 ? 
        blogs.map(blog => (
          <div key={blog.id} className="group w-[20rem]">
            <div className="relative">
              <img src={blog.image || '/path/to/default/image.jpg'} className="w-full h-[12rem] object-cover" alt={blog.title} />
            </div>
            <div className="font-Garamond border border-[#e8e8e8] h-[11.5rem] dark:border-gray-700 border-t-0">
              <div className="py-6 px-4">
                <div className="flex items-center space-x-4">
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                    {blog.status}
                  </p>
                </div>
                <Link to={`/blog_details/${blog.id}`} state={{ blog }}>
                  <h2 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white py-2 hover:underline">
                    {blog.title}
                  </h2>
                </Link>
              </div>
              <div className="border-t border-[#e8e8e8] dark:border-gray-700 flex items-center py-3">
                <div className="px-4 flex items-center justify-between py-2 w-full">
                  {showActions && (
                    <>
                      <button onClick={() => handleEdit(blog)} className='text-2xl text-green-500'><MdEdit /></button>
                      {blog.status === 'draft' && <button onClick={() => submitForReview(blog)} className="rounded px-4 py-2">Submit for Review</button>}
                      {blog.status === 'pending' && <button onClick={() => approveBlog(blog)} className="rounded px-4 py-2">Approve</button>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )) :
        <div className="text-center text-khaki mt-10 font-Garamond uppercase text-2xl font-bold border-2 border-dotted p-2 px-4">Nothing Here</div>
      }
    </div>
  );

  return (
    <div className='w-full h-screen p-4'>
      <h1>Blog Management</h1>
      {user.role === 'Redacteur' && (
        <>
        <div className='w-full h-screen p-4'>
       <form onSubmit={handleSubmit} className='w-[90%] flex flex-wrap justify-center items-center'>
         <input type="text" name="title" value={form.title} onChange={handleInputChange} placeholder="Title" />
         <textarea name="content" value={form.content} onChange={handleInputChange} placeholder="Content" />
         <input type="file" name="image" onChange={handleInputChange} />
         <select multiple name="category" value={form.category} onChange={handleCategoryChange}>
           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
         </select>
         <select multiple name="tags" value={form.tags} onChange={handleTagChange}>
           {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
         </select>
         <button type="submit">{isEditing ? 'Update' : 'Save Draft'}</button>
       </form>
       <button onClick={() => setForm({ ...form, status: 'pending' })} disabled={form.status === 'pending'}>
         Submit for Review
       </button>
       <div className='mt-10'>
         <h2>Actual Posts</h2>
         <div className='container mx-auto px-4 py-8 w-full flex flex-wrap justify-center items-center gap-3 '>
           {publishedBlogs.map(blog => (
             <div key={blog.id} className="group w-[20rem] ">
               <div className="relative">
                 <img src={blog.image} className="w-full h-[12rem] object-cover" alt={blog.title} />
               </div>
               <div className="font-Garamond border border-[#e8e8e8] h-[11.5rem]  dark:border-gray-700 border-t-0">
                 <div className="py-6 px-4">
                   <div className="flex items-center space-x-4">
                     <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                       {new Date(blog.posted_on).toLocaleDateString()}
                     </p>
                     <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                       {blog.category.map(cat => categories.find(category => category.id === cat)?.name ||  'Unknown').join(', ')}
                     </p>
                   </div>
                   <Link to={`/blog_details/${blog.id}`} state={{ blog }}>
                     <h2 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white py-2 hover:underline">
                       {blog.title}
                     </h2>
                   </Link>
                 </div>
                 <div className="border-t border-[#e8e8e8] dark:border-gray-700 flex items-center py-3">
                   <div className="px-4 flex items-center justify-between py-2">
                     <button onClick={() => handleEdit(blog)} className='text-2xl text-green-500'><MdEdit /></button>
                   </div>
                 </div>
               </div>
             </div> 
           ))}
         </div>
         {/* Section for Draft Posts */}
         <h2>Draft Posts</h2>
         <div className='container mx-auto px-4 py-8 w-full flex flex-wrap justify-center items-center gap-3'>
           {draftBlogs.length > 0 ?
             draftBlogs.map(blog => (
             <div key={blog.id} className="group w-[20rem] ">
               <div className="relative">
                 <img src={blog.image || '/path/to/default/image.jpg'} className="w-full h-[12rem] object-cover" alt={blog.title} />
               </div>
               <div className="font-Garamond border border-[#e8e8e8] h-[11.5rem]  dark:border-gray-700 border-t-0">
                 <div className="py-6 px-4">
                   <div className="flex items-center space-x-4">
                     <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                       Draft
                     </p>
                   </div>
                   <h2 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white py-2">
                     {blog.title}
                   </h2>
                 </div>
                 <div className="border-t border-[#e8e8e8] dark:border-gray-700 flex items-center py-3">
                   <div className="px-4 flex items-center justify-between py-2 w-full">
                     <button onClick={() => handleEdit(blog)} className='text-2xl text-green-500'><MdEdit /></button>
                   <button onClick={() => submitForReview(blog)} className=" rounded px-4 py-2">
                   Submit for Review
                 </button>
                   </div>
                 </div>
               </div>
             </div> 
           )) :
           <div className="text-center text-khaki mt-10 font-Garamond uppercase text-2xl font-bold border-2 border-dotted p-2 px-4">No draft posts</div>
           }

         </div>
         <h2>Pending Posts</h2>
         <div className='container mx-auto px-4 py-8 w-full flex flex-wrap justify-center items-center gap-3'>
           {pendingBlogs.length > 0 ?
             pendingBlogs.map(blog => (
             <div key={blog.id} className="group w-[20rem] ">
               <div className="relative">
                 <img src={blog.image || '/path/to/default/image.jpg'} className="w-full h-[12rem] object-cover" alt={blog.title} />
               </div>
               <div className="font-Garamond border border-[#e8e8e8] h-[11.5rem]  dark:border-gray-700 border-t-0">
                 <div className="py-6 px-4">
                   <div className="flex items-center space-x-4">
                     <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-normal uppercase mr-7 ml-3 relative before:absolute before:w-2 before:h-2 before:left-[-13px] before:bg-gray-300 dark:before:bg-khaki before:top-2">
                       Pending
                     </p>
                   </div>
                   <h2 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white py-2">
                     {blog.title}
                   </h2>
                 </div>
                 <div className="border-t border-[#e8e8e8] dark:border-gray-700 flex items-center py-3">
                   <div className="px-4 flex items-center justify-between py-2">
                     <button onClick={() => handleEdit(blog)} className='text-2xl text-green-500'><MdEdit /></button>
                   </div>
                 </div>
               </div>
             </div> 
           ))
           : <div className="text-center text-khaki mt-10 font-Garamond uppercase text-2xl font-bold border-2 border-dotted p-2 px-4">No pending posts</div>
           }
         </div>
       </div>
     </div>
        </>
      )}

      {(user.role === 'Admin' || user.role === 'Webmaster') && (
        <>
          <h2>Actual Posts</h2>
          {renderBlogs(publishedBlogs, false)}
          <h2>Pending Posts</h2>
          {renderBlogs(pendingBlogs, true)}
        </>
      )}
    </div>
  );
};

export default BlogManagement;

