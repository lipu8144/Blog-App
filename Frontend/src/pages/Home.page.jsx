import { useEffect, useState } from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/Inpage-navigation.component";
import Loader from "../components/Loader.component";
import BlogPostCard from "../components/Blog-post.component";
import MinimalBlogPost from "../components/Nobanner-blog-post.component";
import { FaArrowTrendUp } from "react-icons/fa6";
import { activeTabRef } from "../components/Inpage-navigation.component";
import NoDataMessage from "../components/Nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/Load-more-component";

const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingblogs, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programming",
    "hollywood",
    "film making",
    "social media",
    "cooking",
    "tech",
    "finance",
    "travel",
  ];

  const fetchLatestBlogs = ({ page = 1}) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {page})
      .then( async ({ data }) => {

        // console.log(data.blogs);

        let formateData = await filterPaginationData({
           state: blogs,
           data: data.blogs,
           page,
           countRoute: "/all-latest-blogs-count"
        })

        // console.log(formateData);

        setBlog(formateData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,page
      })
      .then(async ({ data }) => {
        // console.log(data.blogs);

        let formateData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState}
        });
        // console.log(formateData);
        setBlog(formateData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlog(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };


  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1});
    } else {
      fetchBlogsByCategory({ page: 1});
    }

    if (!trendingblogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);


  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blog */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : blogs.result.length ? (
                blogs.result.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{
                        duration: 1,
                        delay: i * 1,
                      }}
                      key={i}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No Blogs Published" />
              )}

              <LoadMoreDataBtn state={blogs} fetchDataFun={( pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory)} />
            </>

            {trendingblogs == null ? (
              <Loader />
            ) : trendingblogs.length ? (
              trendingblogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{
                      duration: 1,
                      delay: i * 1,
                    }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No Blogs Published" />
            )}
          </InPageNavigation>
        </div>

        {/* filters and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={
                        "tag " +
                        (pageState == category ? " bg-black text-white" : " ")
                      }
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <FaArrowTrendUp className="inline" />
              </h1>
              {trendingblogs == null ? (
                <Loader />
              ) : trendingblogs.length ? (
                trendingblogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{
                        duration: 1,
                        delay: i * 1,
                      }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No Blogs Published" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
