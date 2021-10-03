import React, { useContext, useEffect, useState } from "react";
import "../css/profile_page_post_container.css";
import axios from "../axios";
// import UserContext from "../UserContext";
import Post from "./Post";
function ProfilePagePostContainer({ profilePic, profileOfUser }) {
  const [active, setActive] = useState();
  const [posts, setPosts] = useState([]);
  const [update, setUpdate] = useState(false);

  function changeActiveElement(id) {
    setActive(id);
  }

  useEffect(() => {
    axios
      .get(`post/${profileOfUser.email}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, [profileOfUser, update]);

  function forceUpdate() {
    console.log("update");
    setUpdate(!update);
  }

  return (
    <div className="post__container flex__container__profile__page">
      {posts.length > 0 &&
        posts.map((post) => (
          <Post
            isActive={active === post?._id ? true : false}
            changeActiveElement={changeActiveElement}
            key={post._id}
            forceUpdate={forceUpdate}
            info={post}
            profilePic={profilePic}
          />
        ))}
    </div>
  );
}

export default ProfilePagePostContainer;
