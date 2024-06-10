import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { BiChevronsRight } from "react-icons/bi";
import { Link } from "react-router-dom";

const BlogSideBar = ({ onFilter, popularPosts }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = () => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  const fetchTags = () => {
    fetch('http://127.0.0.1:8000/api/tags/')
      .then(response => response.json())
      .then(data => setTags(data))
      .catch(error => console.error('Error fetching tags:', error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilter(e.target.value, 'search');
  };

  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    onFilter(newCategory, 'category');
  };

  const handleTagClick = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilter(newTags, 'tag');
  };

  return (
    <>
      {/* blog search bar */}
      <div className="bg-whiteSmoke dark:bg-normalBlack items-center w-full p-4 sm:p-8 2xl:p-10 focus:shadow-xl rounded-md">
        <form
          className="flex items-center space-x-2 md:space-x-5 relative"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <input
            placeholder="Search Here"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-5 py-[5px] w-full h-12 md:h-14 text-base
              border-none outline-none rounded-md text-gray dark:text-lightGray focus:border-none placeholder:text-[#515151] focus:ring-0 focus:outline-none dark:bg-lightBlack"
          />
          <Link to="#" className="absolute top-5 right-4 text-lightGray dark:text-gray">
            <FaSearch className="w-4 h-4" />
          </Link>
        </form>
      </div>

      {/* Popular Post */}
      <div className="bg-whiteSmoke dark:bg-normalBlack w-full p-4 sm:p-8 2xl:p-10 mt-5 2xl:mt-[30px] rounded-md">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-2xl leading-6 md:leading-7 lg:leading-[30px] text-lightBlack dark:text-white relative before:w-[50px] before:h-[1px] before:bg-lightBlack dark:before:bg-white before:absolute before:left-0 before:top-9 font-Garamond font-semibold">
          Popular Post
        </h2>
        <div className="pt-10 flex flex-col gap-3">
          {popularPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog_details/${post.id}`}
              className="flex items-center"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <img
                src={post.image}
                className="mr-3 2xl:mr-5 w-[4rem] h-[4rem]"
                alt={post.title}
              />
              <div className="text-left">
                <h4 className="text-base 2xl:text-lg leading-6 text-[#101010] dark:text-white font-medium font-Garamond hover:underline underline-offset-4">
                  {post.title}
                </h4>
                <p className="text-sm md:text-[13px] 2xl:text-sm leading-[26px] font-Lora text-gray dark:text-lightGray font-normal">
                  {new Date(post.posted_on).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-whiteSmoke dark:bg-normalBlack w-full p-4 sm:p-8 2xl:p-10 mt-5 2xl:mt-[30px] rounded-md">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-2xl leading-6 md:leading-7 lg:leading-[30px] text-lightBlack dark:text-white relative before:w-[50px] before:h-[1px] before:bg-lightBlack dark:before:bg-white before:absolute before:left-0 before:top-9 font-Garamond font-semibold">
          Categories
        </h2>
        <div className="pt-10 overflow-y-auto h-[20rem] ">
          <ul className=" " data-aos="fade-up" data-aos-duration="1000">
            {categories.map(category => (
              <li
                key={category.id}
                className={`flex items-center group transition-all duration-300 border-b-[1px] cursor-pointer border-lightGray dark:border-gray pb-3 ${selectedCategory === category.name ? 'bg-khaki text-white' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <BiChevronsRight
                  size={16}
                  className="text-lightBlack dark:text-white group-hover:text-khaki mr-2"
                />
                <span className="text-sm xl:text-base 2xl:text-lg leading-[26px] text-lightBlack group-hover:text-khaki font-medium font-Garamond dark:text-white">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-whiteSmoke dark:bg-normalBlack w-full p-4 sm:p-8 2xl:p-10 mt-5 2xl:mt-[30px] rounded-md">
        <h2 className="text-lg sm:text-xl md:text-[22px] lg:text-2xl leading-6 md:leading-7 lg:leading-[30px] text-lightBlack dark:text-white relative before:w-[50px] before:h-[1px] before:bg-lightBlack dark:before:bg-white before:absolute before:left-0 before:top-9 font-Garamond font-semibold">
          Tag
        </h2>
        <div className="pt-10 overflow-y-auto h-[20rem]" data-aos="fade-up" data-aos-duration="1000">
          <div className="grid items-center grid-cols-2 md:grid-cols-1 2xl:grid-cols-2 gap-3 sm:gap-5">
            {tags.map(tag => (
              <div
                key={tag.id}
                className={`px-2 sm:px-4 py-2 bg-white dark:bg-lightBlack hover:bg-khaki transition-all duration-300 group cursor-pointer ${selectedTags.includes(tag.name) ? 'bg-khaki text-white' : ''}`}
                onClick={() => handleTagClick(tag.name)}
              >
                <h1 className="text-sm sm:text-base leading-6 lg:leading-[30px] font-Garamond text-[#101010] dark:text-white font-medium group-hover:text-white">
                  {tag.name}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogSideBar;
