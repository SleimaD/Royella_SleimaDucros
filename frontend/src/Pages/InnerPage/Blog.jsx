import { useEffect, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link } from "react-router-dom";
import BlogSideBar from "./BlogSideBar";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [popularPosts, setPopularPosts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [searchTerm, selectedCategory, selectedTags]);

  const fetchBlogs = () => {
    fetch('http://127.0.0.1:8000/api/blogs/') 
      .then(response => response.json())
      .then(data => {
        setBlogs(data);
        setFilteredBlogs(data);
        fetchPopularPosts(data);
      })
      .catch(error => console.error('Error fetching blogs:', error));
  };

  const fetchPopularPosts = (blogsData) => {
    const popular = blogsData
      .filter(blog => blog.comments.length > 0) 
      .sort((a, b) => b.comments.length - a.comments.length) 
      .slice(0, 3); 
    setPopularPosts(popular);
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category.some(cat => cat.name && cat.name.toLowerCase() === selectedCategory.toLowerCase()));
    }

    if (selectedTags.length) {
      filtered = filtered.filter(blog => selectedTags.every(tag => blog.tags.some(t => t.name && t.name.toLowerCase() === tag.toLowerCase())));
    }

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.some(cat => cat.name && cat.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        blog.tags.some(tag => tag.name && tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (filter, type) => {
    if (type === 'category') {
      setSelectedCategory(filter);
      setSearchTerm('');
    } else if (type === 'tag') {
      setSelectedTags(filter);
      setSearchTerm('');
    } else if (type === 'search') {
      setSearchTerm(filter);
      setSelectedCategory(null);
      setSelectedTags([]);
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!popularPosts || popularPosts.length === 0) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <BreadCrumb title="Blog" pageName="blog" />
      <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
        <div className="Container grid grid-cols-6 md:grid-cols-7 lg:grid-cols-6 gap-5">
          <div className="col-span-6 md:col-span-4">
            <div className="grid items-center gap-5 2xl:gap-y-[30px] grid-cols-1 lg:grid-cols-2">
              {currentBlogs.map(blog => (
                <div
                  key={blog.id}
                  className="overflow-hidden 3xl:w-[410px] group"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                >
                  <div className="relative">
                    <img
                      src={blog.image}
                      className="w-full h-[300px] object-cover"
                      alt={blog.title}
                    />
                  </div>
                  <div className="font-Garamond border border-[#ddd] dark:border-gray border-t-0">
                    <div className="py-6 px-[30px]">
                      <div className="flex items-center space-x-6">
                        <p className="text-sm 2xl:text-base leading-[26px] text-gray dark:text-lightGray font-normal uppercase mr-7 ml-3 relative before:absolute before:w-[7px] before:h-[7px] before:left-[-13px] before:bg-[#d1d1d1] dark:before:bg-khaki before:top-[9px]">
                          {new Date(blog.posted_on).toLocaleDateString()}
                        </p>
                        <p className="text-sm 2xl:text-base leading-[26px] text-gray dark:text-lightGray font-normal uppercase mr-7 ml-3 relative before:absolute before:w-[7px] before:h-[7px] before:left-[-13px] before:bg-[#d1d1d1] dark:before:bg-khaki before:top-[9px]">
                          {blog.category.map(cat => cat.name).join(', ')}
                        </p>
                      </div>
                      <Link to={`/blog_details/${blog.id}`} state={{ blog }}>
                        <h2 className="text-xl md:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 sm:py-3 md:py-4 hover:underline underline-offset-2">
                          {blog.title}
                        </h2>
                      </Link>
                    </div>
                    <div className="border-t-[1px] border-[#ddd] dark:border-gray py-2 sm:py-3 md:py-4 xl:py-5">
                      <Link to={`/blog_details/${blog.id}`} state={{ blog }} className="px-[30px] flex items-center justify-between">
                        <div className="">
                          <span className="text-sm sm:text-base flex items-center">
                            <span className="ml-[10px] leading-[38px] uppercase text-lightBlack dark:text-white font-medium group-hover:text-khaki hover:underline underline-offset-1">
                              Read More
                            </span>
                          </span>
                        </div>
                        <span className="">
                          <BsArrowRight className="text-gray dark:text-lightGray group-hover:text-khaki" size={"24px"} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-10">
              <span
                className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] dark:bg-lightBlack border-[1px] border-lightGray dark:border-gray bg-white hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center cursor-pointer group"
                onClick={handlePreviousPage}
              >
                <BsArrowLeft size={20} className="text-lightBlack dark:text-white group-hover:text-white" />
              </span>
              {[...Array(totalPages).keys()].map(number => (
                <span
                  key={number}
                  className={`w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] dark:bg-lightBlack border-[1px] border-lightGray dark:border-gray bg-white hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center font-semibold cursor-pointer group ${currentPage === number + 1 ? 'bg-khaki' : ''}`}
                  onClick={() => setCurrentPage(number + 1)}
                >
                  <span className="text-lightBlack dark:text-white group-hover:text-white">
                    {number + 1}
                  </span>
                </span>
              ))}
              <span
                className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] dark:bg-lightBlack border-[1px] border-lightGray dark:border-gray bg-white hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center cursor-pointer group"
                onClick={handleNextPage}
              >
                <BsArrowRight size={20} className="text-lightBlack dark:text-white group-hover:text-white" />
              </span>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <BlogSideBar 
              onFilter={handleFilter} 
              popularPosts={popularPosts} 
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
