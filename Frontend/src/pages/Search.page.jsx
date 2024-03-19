import { useParams } from "react-router-dom";
import InPageNavigation from "../components/Inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/Loader.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/Blog-post.component";
import NoDataMessage from "../components/Nodata.component";
import LoadMoreDataBtn from "../components/Load-more-component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/Usercard.component";
import { LuUser2 } from "react-icons/lu";


const SearchPage = ( ) => {

    let { query } = useParams();

    let [blogs, setBlog ] = useState(null)
    let [users, setUsers ] = useState(null)

    const searchBlogs = ({page = 1, create_new_arr = false}) => {

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            query,
            page,
          })
          .then(async ({ data }) => {
            console.log(data.blogs);

            let formateData = await filterPaginationData({
              state: blogs,
              data: data.blogs,
              page,
              countRoute: "/search-blogs-count",
              data_to_send: { query},
              create_new_arr
            });

            console.log(formateData);

            setBlog(formateData);
          })
          .catch((err) => {
            console.log(err);
          });
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
        .then(({ data: { users }}) => {
            setUsers(users)
        })
    }   

    useEffect(() => {

        resetState();
        searchBlogs({page: 1, create_new_arr: true});
        fetchUsers();

    },[query])

    const resetState = () => {
        setBlog(null);
        fetchUsers(null);
    }

    const UserCardWrapper = () => {
      return(
        <>
          {
              users == null ? <Loader /> :
                users.length ?
                  users.map((user, i) => {
                    return (
                      <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.08}}>
                        <UserCard user={user} />
                      </AnimationWrapper>
                    );
                  })
                  : <NoDataMessage message={"No user found"} />
          }
        </>

      )
    }


    return (
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            routes={[`Search result from "${query}"`, "Accounts Matched"]}
            defaultHidden={["Accounts Matched"]}
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

              <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
            </>

            <UserCardWrapper />
          </InPageNavigation>
        </div>

        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <h1 className="font-medium text-xl mb-8">
            User related to search <LuUser2 className="inline" />
          </h1>
          <UserCardWrapper />
        </div>
      </section>
    );
}

export default SearchPage;