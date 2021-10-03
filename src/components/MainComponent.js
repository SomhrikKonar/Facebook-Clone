import React, { useState, useEffect, useContext, useRef } from "react";
import "../css/main__component.css";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import CreatePostModal from "./CreatePostModal";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Post from "./Post";
import axios from "../axios";
import UserContext from "../UserContext";
import { CircularProgress } from "@material-ui/core";
function MainComponent({ singlePost, reload }) {
  const userDetails = useContext(UserContext);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pst, setPst] = useState([]);
  const [friends, setFriends] = useState();
  const [profilePic, setProfilePic] = useState();
  const [update, setUpdate] = useState(false);
  const [active, setActive] = useState();
  const refTop = useRef();
  const [loading, setLoading] = useState(false);
  function closePostCreation() {
    setOpenCreatePostModal(false);
  }

  function changeActiveElement(id) {
    setActive(id);
  }

  useEffect(() => {
    setLoading(true);
    let frnds = [userDetails.email];
    async function fetchData() {
      console.log("entering 1nd effct");
      await axios
        .get(`user/${userDetails.email}`)
        .then((res) => {
          setProfilePic(res.data[0]?.profilePicture);
          res.data[0].friends.map((frnd) => frnds.push(frnd.friendsEmail));
        })
        .catch((err) => console.log(err));
      setFriends(frnds);
    }
    fetchData();
    return () => {
      setFriends();
      frnds.length = 0;
      console.warn("frnds", frnds);
    };
  }, [userDetails]);

  // console.log("showPost", setShowPost);

  //getting posts

  useEffect(() => {
    async function fetchData(frnd) {
      setPosts([]);
      setLoading(true);
      await axios
        .get(`post/${frnd}`)
        .then((res) => {
          res.data.map((post) =>
            setPosts((prevState) => [
              ...prevState,
              {
                post: post,
                time: new Date(post.createdAt),
              },
            ])
          );
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
    function getPosts() {
      friends?.map((frnd, index) => fetchData(frnd, index));
    }
    getPosts();

    return () => {
      // console.log("unmounting");
      setPosts([]);
    };
  }, [friends, update, reload]);

  //sorting array

  useEffect(() => {
    setPst(posts.sort((a, b) => b.time - a.time));
  }, [posts]);

  function forceUpdate() {
    setUpdate(!update);
  }
  return (
    <div className="main__componenet__container">
      {loading ? (
        <div className="show__loading">
          <CircularProgress
            style={{ color: "#bc1ff3", height: "50px", width: "50px" }}
          />
        </div>
      ) : (
        <>
          <div className="top" ref={refTop} />
          {!singlePost ? (
            <>
              {openCreatePostModal && (
                <CreatePostModal
                  forceUpdate={forceUpdate}
                  closePostCreation={closePostCreation}
                  userDetails={userDetails}
                />
              )}
              <div className="create__post">
                <div className="row__1">
                  <div className="avatar">
                    <Avatar src={profilePic} />
                  </div>
                  <div className="create__post__text">
                    <TextField
                      disabled={openCreatePostModal && true}
                      onFocus={() => setOpenCreatePostModal(true)}
                      className="text__field"
                      id="input-with-icon-textfield"
                      placeholder={`What's on your mind,${userDetails?.userName?.substr(
                        0,
                        userDetails?.userName?.indexOf(" ")
                      )}?`}
                    />
                  </div>
                </div>
                <div className="row__2">
                  <div className="button__container">
                    <div className="logo__container">
                      <VideoCallIcon style={{ color: "#f02849" }} />
                    </div>
                    <div className="title__container">Live video</div>
                  </div>
                  <div
                    className="button__container"
                    onClick={() => setOpenCreatePostModal(true)}
                  >
                    <div className="logo__container">
                      <PhotoLibraryIcon style={{ color: "#45bd62" }} />
                    </div>
                    <div className="title__container">Photo/ Video</div>
                  </div>
                  <div className="button__container">
                    <div className="logo__container">
                      <InsertEmoticonIcon style={{ color: "#f7b928" }} />
                    </div>
                    <div className="title__container">Feeling/ Activity</div>
                  </div>
                </div>
              </div>
              <div className="main__component__post">
                {pst.map((post) => (
                  <Post
                    key={post.post?._id}
                    forceUpdate={forceUpdate}
                    info={post.post}
                    changeActiveElement={changeActiveElement}
                    isActive={active === post.post?._id ? true : false}
                  />
                ))}
              </div>
            </>
          ) : (
            <Post
              forceUpdate={forceUpdate}
              info={singlePost}
              changeActiveElement={changeActiveElement}
              isActive={active === singlePost?._id ? true : false}
            />
          )}
          <div
            className="scrollToTop"
            onClick={() => {
              refTop.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ExpandLessIcon style={{ color: "black", fontSize: "35px" }} />
          </div>
        </>
      )}
    </div>
  );
}

export default MainComponent;
