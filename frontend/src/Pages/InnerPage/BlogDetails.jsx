import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import BlogSideBar from "./BlogSideBar";
import { BiChevronsRight } from "react-icons/bi";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../RolesRoutes/AuthProvider";

const BlogDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [blogData, setBlogData] = useState(null);
  const [comments, setComments] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [newComment, setNewComment] = useState({ content: '' });
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    fetchBlogDetails();
    fetchPopularPosts();
    fetchDescriptions();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/blogs/${id}/`);
      setBlogData(response.data);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/blogs/popular/`);
      setPopularPosts(response.data);
    } catch (error) {
      console.error('Error fetching popular posts:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/comments/?blog=${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchDescriptions = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/descriptions/?blog=${id}`);
      setDescriptions(response.data);
    } catch (error) {
      console.error('Error fetching descriptions:', error);
    }
  };

  useEffect(() => {
    if (blogData) {
      fetchComments();
    }
  }, [blogData]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment({ ...newComment, [name]: value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/comments/`, {
        blog: id,
        content: newComment.content,
        author: user.id,
      });
      fetchComments(); 
      setNewComment({ content: '' });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (!blogData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BreadCrumb title="Blog Details" />
      <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
        <div className="Container grid grid-cols-6 md:grid-cols-7 lg:grid-cols-6 gap-5 ">
          <div className="col-span-6 md:col-span-4">
            <img
              src={blogData.image}
              alt={blogData.title}
              data-aos="fade-up"
              data-aos-duration="1000"
              className="w-[47rem] h-[34rem]"
            />
            <div className="pt-5 lg:pt-[35px] pr-3">
              <div data-aos="fade-up" data-aos-duration="1000">
                <p className="text-base font-Garamond text-gray dark:text-lightGray">
                  <span>{new Date(blogData.posted_on).toLocaleDateString()} </span>
                  <span className="mx-2">/</span>
                  <span>{blogData.category && blogData.category.map(cat => cat.name).join(', ')}</span>
                </p>
                <h2 className="py-2 sm:py-3 md:py-4 lg:py-[19px] 2xl:py-[25px] font-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] 3xl:text-[40px] leading-6 lg:leading-[26px] text-lightBlack dark:text-white font-semibold">
                  {blogData.title}
                </h2>
                <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora">
                  {blogData.content}
                  ferge
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center w-full gap-4 pt-10">
                {descriptions.map((description) => (
                  <div key={description.id} className="" data-aos="fade-up" data-aos-duration="1000">
                    {description.image && (
                        <img src={description.image} alt={description.title} className="w-[22rem] h-[17rem]" />
                    )}
                  </div>
                ))}
              </div>



              {descriptions.map((description, index) => (
                <div key={index} className="pt-10" data-aos="fade-up" data-aos-duration="1000">
                  {description.title && (
                    <h2 className="pb-2 sm:pb-3 md:pb-4 lg:pb-[19px] 2xl:pb-6 font-Garamond text-lg sm:text-xl md:text-2xl xl:text-[28px] leading-6 lg:leading-7 text-lightBlack dark:text-white font-semibold">
                      {description.title}
                    </h2>
                  )}
                  {description.content && (
                    <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora">
                      {description.content}
                    </p>
                  )}
                </div>
              ))}
              <div className="my-10 py-5 border-t-[1px] border-b-[1px] border-lightGray dark:border-gray lg:flex items-center justify-between" data-aos="fade-up" data-aos-duration="1000">
                <div className="flex items-center space-x-2">
                  <h5 className="text-lg text-[#101010] dark:text-white leading-[28px] font-semibold font-Garamond mr-2">
                    Tags :
                  </h5>
                  {blogData.tags && blogData.tags.map(tag => (
                    <span key={tag.id} className="text-sm border-[1px] border-lightGray dark:border-gray px-3 py-1 dark:text-white">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mt-3 lg:mt-0">
                  <h5 className="text-lg text-[#101010] dark:text-white leading-[28px] font-semibold font-Garamond mr-2">
                    Share :
                  </h5>
                  <Link to="#" className="text-sm px-3 py-1 dark:text-white hover:text-khaki hover:underline underline-offset-4">
                    FB
                  </Link>
                  <Link to="#" className="text-sm px-3 py-1 dark:text-white hover:text-khaki hover:underline underline-offset-4">
                    TW
                  </Link>
                  <Link to="#" className="text-sm px-3 py-1 dark:text-white hover:text-khaki hover:underline underline-offset-4">
                    LN
                  </Link>
                  <Link to="#" className="text-sm px-3 py-1 dark:text-white hover:text-khaki hover:underline underline-offset-4">
                    PI
                  </Link>
                </div>
              </div>
              {/* Comment Section */}
              <div className="my-10 2xl:my-[60px] 3xl:my-[80px]">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-[32px] text-lightBlack dark:text-white font-semibold font-Garamond mb-5 2xl:mb-[30px]">
                  {comments.length} Comments
                </h3>
                <div>
                  {comments.map((comment, index) => (
                    <div key={index} style={{ marginLeft: index > 0 ? '50px' : '0px' }} className="border-[1px] border-lightGray dark:border-gray rounded-sm p-4 sm:p-5 md:p-6 2xl:p-[30px] mb-5" data-aos="fade-up" data-aos-duration="1000">
                      <div className={`grid gap-3 sm:flex md:grid md:gap-5 lg:flex`}>
                        {comment.author_photo && (
                          <img src={comment.author_photo} alt={comment.author_name} className="w-[70px] h-[70px] rounded-full" />
                        )}
                        {/* <img src={comment.author.photo} alt="" className="w-[70px] h-[70px]" /> */}
                        <div className="ml-3 2xl:ml-4 flex-grow">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-base sm:text-lg lg:text-xl font-Garamond font-semibold leading-6 md:leading-7 text-lightBlack dark:text-white">
                                {comment.author.name}
                              </span>
                              <hr className="w-[10px] sm:w-[27px] h-[1px] text-lightBlack dark:text-white mx-1 sm:mx-2" />
                              <span className="text-[13px] sm:text-[15px] font-Lora font-normal text-gray dark:text-lightGray">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-[13px] sm:text-[15px] font-Lora font-normal text-gray dark:text-lightGray cursor-pointer">
                              REPLY
                            </span>
                          </div>
                          <p className="text-sm sm:text-[15px] font-Lora font-normal text-gray dark:text-lightGray mt-3 xl:mt-[15px]">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment form */}
              {user && (
                <div data-aos="fade-up" data-aos-duration="1000">
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-[32px] text-lightBlack dark:text-white font-semibold font-Garamond mb-5 2xl:mb-[30px]">
                    Leave A Comment
                  </h3>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="flex sm:flex-row flex-col items-center gap-5 mb-5">
                      <input
                        type="text"
                        name="name"
                        value={newComment.name}
                        onChange={handleCommentChange}
                        className="w-full h-[50px] border-none outline-none focus:ring-0 placeholder:text-base placeholder:text-lightGray placeholder:leading-[38px] placeholder:font-Lora placeholder:font-normal px-5 dark:bg-normalBlack bg-whiteSmoke dark:text-white"
                        placeholder="Your Name"
                        id="name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={newComment.email}
                        onChange={handleCommentChange}
                        className="w-full h-[50px] border-none outline-none focus:ring-0 placeholder:text-base placeholder:text-lightGray placeholder:leading-[38px] placeholder:font-Lora placeholder:font-normal px-5 dark:bg-normalBlack bg-whiteSmoke dark:text-white"
                        placeholder="Email Address"
                        id="email"
                      />
                    </div>
                    <div className="grid items-center gap-5 mb-5 md:mb-0">
                      <input
                        type="text"
                        name="website"
                        value={newComment.website}
                        onChange={handleCommentChange}
                        className="w-full h-[50px] border-none outline-none focus:ring-0 placeholder:text-base placeholder:text-lightGray placeholder:leading-[38px] placeholder:font-Lora placeholder:font-normal px-5 dark:bg-normalBlack bg-whiteSmoke dark:text-white"
                        placeholder="Your Website"
                        id="website"
                      />
                      <textarea
                        className="w-full h-[160px] border-none outline-none focus:ring-0 placeholder:text-base placeholder:text-lightGray placeholder:leading-[38px] placeholder:font-Lora placeholder:font-normal px-5 dark:bg-normalBlack bg-whiteSmoke dark:text-white resize-none"
                        placeholder="Type Your Comment"
                        name="content"
                        value={newComment.content}
                        onChange={handleCommentChange}
                        id="content"
                        cols="30"
                      ></textarea>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="saveInfo"
                          id="saveInfo"
                          className="border-khaki text-khaki focus:ring-0 focus:outline-none focus:border-none"
                        />
                        <p className="text-[13px] sm:text-[15px] font-Lora font-normal text-gray dark:text-lightGray ml-2">
                          Save your email info in the browser for next comments.
                        </p>
                      </div>
                      <button className="btn-primary">Submit Now</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <BlogSideBar popularPosts={popularPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
