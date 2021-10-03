import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import "../css/profile_page_post_container.css";
import { Avatar } from "@material-ui/core";
import { io } from "socket.io-client";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import UserContext from "../UserContext";
import PublicIcon from "@material-ui/icons/Public";
import PeopleIcon from "@material-ui/icons/People";
import LockIcon from "@material-ui/icons/Lock";
import ImageBox from "./ImageBox";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ShowComments from "./ShowComments";
import ShowReactions from "./ShowReactions";
import { storage } from "../firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "../axios";
import commentLength from "../CommentLenContext";
function Post({ info, forceUpdate, changeActiveElement, isActive }) {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const commentRef = useRef();
  const replyInputRef = useRef();
  const [deleting, setDeleting] = useState(false);
  const userDetails = useContext(UserContext);
  const images = info?.postData;
  const [largeImage, setLargeImage] = useState();
  const [showImages, setShowImages] = useState();
  const [react, setReact] = useState("");
  const [newReaction, setNewReaction] = useState(false);
  const [showAnimatioButtons, setShowAnimationButtons] = useState(false);
  const [adminPostDelete, setAdminPostDelete] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [allReactions, setAllReactions] = useState([]);
  const [showInReactionHolder, setShowInReactionHolder] = useState([]);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [toggleCommented, setToggleCommented] = useState(false);
  const [showCommentsorReactions, setShowCommentsorReactions] = useState("");
  const [currentUserProfilePicture, setCurrentUserProfilePicture] = useState();
  const [profilePic, setProfilePic] = useState();
  const [lastComment, setLastComment] = useState();
  const postRef = storage
    .ref()
    .child(`Posts/${info?.postCreator}/${info?._id}`);
  const [metadata, setMetadata] = useState();
  const [playVideo, setPlayVideo] = useState({
    index: 0,
    play: false,
  });
  const [replyToComment, setReplyToComment] = useState(false);
  const [refOfParentComment, setRefOfParentComment] = useState(0);
  const [replierMsg, setReplierMsg] = useState("");
  const videoRef = useRef([]);
  let mouseDown = false;
  let mouseIn = false;
  let timer = 0;
  let timer1 = 0;
  const [hr, setHr] = useState();
  const [min, setMin] = useState();
  const [sec, setSec] = useState();
  const [watchtime, setWatchTime] = useState();
  const [postedAtTime, setPostedAtTime] = useState();
  const CommentLenContxt = useContext(commentLength);
  useEffect(() => {
    const Socket = io("https://socket-fb.herokuapp.com");

    Socket.on("changeInPostsColl", (change) => {
      if (change.documentKey._id === info._id) {
        setToggleCommented(!toggleCommented);
        console.log("toggling");
      }
    });
    return () => {
      Socket?.close();
    };
  }, [info._id, toggleCommented]);

  // date calculations---->

  const date = new Date(info.createdAt).toDateString();
  const postYear = date.substr(date.lastIndexOf(" "));
  const currentYear = new Date().getFullYear().toString();
  const postTime = new Date(info.createdAt).toLocaleTimeString();
  const am__pm = postTime.substr(postTime.lastIndexOf(" "));
  const today_date = new Date().toLocaleDateString();
  const post_date = new Date(info.createdAt).toLocaleDateString();

  //time of post creation

  useEffect(() => {
    let hrs, mins, secs;
    if (today_date === post_date) {
      let timeDiff = watchtime - postedAtTime;
      hrs = Math.floor(timeDiff / (3600 * 1000));
      if (hrs < 1) mins = Math.floor(timeDiff / (60 * 1000));
      if (hrs < 1 && mins < 1) secs = Math.floor(timeDiff / 1000);
    }
    setHr(hrs);
    setMin(mins);
    setSec(secs);
  }, [post_date, postedAtTime, today_date, watchtime]);

  useEffect(() => {
    setWatchTime(new Date().getTime());
    setPostedAtTime(new Date(info.createdAt).getTime());
  }, [info.createdAt]);

  // useEffect(() => {
  //   console.log("new react", newReaction);
  //   console.log("show anim btn", showAnimatioButtons);
  // }, [newReaction, showAnimatioButtons]);

  //getting profile picture
  useEffect(() => {
    async function fetchPictures() {
      await axios
        .get(`user/${info.postCreator}`)
        .then((res) => {
          setProfilePic(res.data[0].profilePicture);
        })
        .catch((err) => console.log(err));

      await axios
        .get(`user/${userDetails.email}`)
        .then((res) => {
          setCurrentUserProfilePicture(res.data[0].profilePicture);
        })
        .catch((err) => console.log(err));
    }
    fetchPictures();
  }, [userDetails.email, info.postCreator]);

  function defaultShowCommentsorReactions() {
    setShowCommentsorReactions("");
  }

  //set admin
  useEffect(() => {
    info.postCreator === userDetails.email && setAdminPostDelete(true);
  }, [info, userDetails]);

  //check image is large or not
  useEffect(() => {
    if (images.length !== 0) {
      const img = new Image();
      img.src = images[0]?.url;
      img.onload = () => {
        img.height < img.width && setLargeImage(true);
      };
    }
  }, [images]);

  //check display resize
  useLayoutEffect(() => {
    function changeDeviceWidth() {
      setDeviceWidth(window.innerWidth);
    }
    window.addEventListener("resize", changeDeviceWidth);
    return () => {
      window.removeEventListener("resize", changeDeviceWidth);
    };
  }, []);

  //get post metadata
  useEffect(() => {
    if (images.length !== 0) {
      const pRef = storage
        .ref()
        .child(`Posts/${info?.postCreator}/${info?._id}/${images[0]?.name}`);
      pRef.getMetadata().then((res) => {
        let type = res.contentType;
        let mData = type.substr(0, type.indexOf("/"));
        setMetadata(mData);
        setLargeImage(true);
      });
    }
  }, [images, info?._id, info?.postCreator]);

  // getting reaction info
  useEffect(() => {
    //if user reacted before
    async function fetchData() {
      await axios
        .get(`post/${info._id}/${userDetails.email}/checkifreactionexists`)
        .then((res) => {
          if (res.data.length === 0) {
            setNewReaction(true);
          } else {
            setReact(res.data[0].reaction);
            setNewReaction(false);
          }
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [info._id, userDetails.email]);

  //get all comments
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`post/${info._id}/getAllComment`)
        .then((res) => setAllComments(res.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [info._id, toggleCommented]);

  //ref of the currently focussed comment
  useEffect(() => {
    if (refOfParentComment) {
      const showComment = allComments.filter(
        (comment) => comment._id === refOfParentComment
      );
      console.log(showComment[0]);
      setLastComment(showComment[0]);
    } else {
      setLastComment(allComments[0]);
    }
  }, [allComments, refOfParentComment]);

  //getting all reactions
  useEffect(() => {
    async function fetchAllUsers() {
      let twoReacts = [];
      let allReacts = [];
      await axios
        .get(`post/${info._id}/getAllReactions`)
        .then((res) => {
          res.data.map(
            (react) => react.reaction !== "" && allReacts.push(react)
          );
          res.data.map(
            (reacts) =>
              twoReacts.length + 1 < 3 &&
              reacts.reaction !== "" &&
              twoReacts[0] !== reacts.reaction &&
              twoReacts.push(reacts.reaction)
          );
        })
        .catch((err) => console.log("err", err));

      setAllReactions(allReacts);
      setShowInReactionHolder(twoReacts);
    }
    fetchAllUsers();
  }, [info, react, toggleCommented]);

  //update comment
  async function handlePostComment() {
    if (comment !== "") {
      CommentLenContxt(0);
      axios
        .put(`post/${info._id}/createComment`, {
          comment: {
            commentorName: userDetails.userName,
            commentedBy: userDetails.email,
            comment: comment,
            profilePicture: currentUserProfilePicture,
          },
        })
        .then(() => {
          setComment("");
          setToggleCommented(!toggleCommented);
        })
        .catch((err) => console.log(err));
    }
  }

  //adding reply
  async function handlePostReplyToComment(commentId) {
    if (replierMsg) {
      await axios
        .put(`post/${info._id}/${commentId}/updateReply`, {
          replyDetail: {
            replierName: userDetails.userName,
            replierPicUrl: currentUserProfilePicture,
            replierEmail: userDetails.email,
            replierMsg: replierMsg,
          },
        })
        .then(() => {
          setReplyToComment(false);
          setReplierMsg("");
          setToggleCommented(!toggleCommented);
        })
        .catch((err) => console.log(err));
    }
  }

  //deleteing comment
  async function handleDeleteComment(commentId) {
    axios.get(`post/getPostById/${info._id}`).then((res) => {
      console.log("delteing", res.data[0].postComments.length);
      CommentLenContxt(res.data[0].postComments.length);
      handleDelete();
    });
    async function handleDelete() {
      await axios
        .get(`post/${info._id}/deleteComment/${commentId}`)
        .then(() => setToggleCommented(!toggleCommented))
        .catch((err) => console.log(err));
    }
  }

  //deleting replies on comment
  async function handleDeleteReply(commentId, replyId) {
    await axios
      .get(`post/${info._id}/deleteCommentReply/${commentId}/${replyId}`)
      .then(() => setToggleCommented(!toggleCommented))
      .catch((err) => console.log(err));
  }

  // updating reaction info
  async function putData(reaction) {
    setReact(reaction);
    setShowAnimationButtons(false);
    console.log(reaction);
    newReaction
      ? await axios
          .put(`post/${info._id}/AddPostReacts`, {
            reactDetails: {
              reactorName: userDetails.userName,
              reaction: reaction,
              reactedBy: userDetails.email,
              profilePicture: currentUserProfilePicture,
            },
          })
          .then((res) => {
            setNewReaction(false);
            console.log("adding", res);
          })
          .catch((err) => console.log(err))
      : await axios
          .put(`post/${info._id}/postReacts`, {
            reactDetails: {
              reaction: reaction,
              reactedBy: userDetails.email,
            },
          })
          .then((res) => console.log("updating", info))
          .catch((err) => console.log(err));
  }

  //delete post

  async function deletePost() {
    setDeleting(true);
    await axios
      .delete(`post/${info._id}/deletePost`)
      .then(() => {
        if (images.length === 0) {
          setDeleting(false);
          forceUpdate();
        } else {
          images.map((item, index) => deleteFromStorage(item, index));
        }
      })
      .catch((err) => console.log(err));
  }

  async function deleteFromStorage(item, index) {
    console.log("deletefromstorage");
    const imgRef = postRef.child(`/${item?.name}`);

    imgRef
      .delete()
      .then(() => {
        info.postData.length - 1 === index && setDeleting(false);
        forceUpdate();
      })
      .catch((err) => console.log(err));
  }

  function closeShowImages() {
    setShowImages(false);
  }

  useEffect(() => {
    videoRef.current.map((item, index) => {
      !isActive
        ? videoRef.current[index].pause()
        : index !== playVideo.index
        ? videoRef.current[index].pause()
        : playVideo.play
        ? videoRef.current[index].play()
        : videoRef.current[index].pause();
    });
  }, [playVideo, isActive]);

  function handlePlay(i) {
    changeActiveElement(info._id);
    console.log("play pause");
    setPlayVideo({
      index: i,
      play: videoRef.current[i]?.paused,
    });
  }

  function checkingMouseDownTime() {
    mouseDown = true;

    const interval = setInterval(timerFunc, 100);

    function timerFunc() {
      console.log("mouseDown", mouseDown);
      if (mouseDown && timer < 5) {
        timer = timer + 1;
      } else if (!mouseDown && timer < 5) {
        timer = 0;
        setShowAnimationButtons(false);
        clearInterval(interval);
      } else if (mouseDown && timer >= 5) {
        mouseDown = false;
        timer = 0;
        console.log("settinh true");
        setShowAnimationButtons(true);
        clearInterval(interval);
      }
    }
  }

  function handleMouseIn(i, state) {
    mouseIn = true;
    changeActiveElement(info._id);
    const mouseInterval = setInterval(mouseInFor, 500);
    console.log("index", i);
    function mouseInFor() {
      console.log("timer", timer1, "mouseIn", mouseIn);
      if (playVideo.index === i && playVideo.play) {
        timer1 = 0;
        clearInterval(mouseInterval);
      } else if (mouseIn && timer1 < 5) {
        timer1 = timer1 + 1;
      } else if (!mouseIn && timer1 < 5) {
        timer1 = 0;
        clearInterval(mouseInterval);
      } else if (timer1 >= 5) {
        timer1 = 0;
        mouseIn = false;
        clearInterval(mouseInterval);
        setPlayVideo({
          index: i,
          play: state,
        });
      }
    }
  }

  return showImages ? (
    <ImageBox images={images} closeShowImages={closeShowImages} />
  ) : (
    <div className="post__container__profile__page">
      {deleting && (
        <div className="overlay__video__deleting">
          <CircularProgress
            color="secondary"
            style={{ height: "60px", width: "60px" }}
          />
        </div>
      )}
      <div className="post__container__header flex__container__profile__page">
        <Avatar src={profilePic} />
        <div className="post__container__header__middle ">
          <div className="username__post">{info?.user}</div>
          <div className="post__time__and__visibility">
            <div className="post__time">
              {today_date === post_date
                ? hr > 0
                  ? hr + " hr"
                  : min > 0
                  ? min + " min"
                  : sec + " sec"
                : postYear.trimStart() === currentYear
                ? date.substr(0, date.lastIndexOf(" ")) + " "
                : date + " at"}
              {today_date !== post_date &&
                postTime.substr(0, postTime.lastIndexOf(":")) + am__pm}
            </div>
            {info.visibility === "Public" ? (
              <PublicIcon />
            ) : info.visibility === "Friends" ? (
              <PeopleIcon />
            ) : (
              info.visibility === "Only me" && <LockIcon />
            )}
          </div>
        </div>
        <div
          className="post__container__header__right"
          onClick={() => setShowPostOptions(!showPostOptions)}
        >
          <div className="more__Options" style={{ cursor: "pointer" }}>
            <MoreHorizIcon />
          </div>

          {showPostOptions && adminPostDelete && (
            <>
              <div
                className="bg__modal"
                onClick={() => setShowPostOptions(false)}
              />
              <div className="post__option__modal" onClick={deletePost}>
                Delete
              </div>
            </>
          )}
        </div>
      </div>
      <div className="post__description">{info.postDescription}</div>
      {images.length !== 0 && (
        <div
          className={`post__images ${
            images.length === 1
              ? "full__grid__image"
              : images.length === 2
              ? largeImage
                ? "two__row__one__column"
                : "two__column__one__row"
              : largeImage
              ? "first__row__big"
              : "first__column__big"
          } ${images.length > 3 && !largeImage && "three__row__two__column"}`}
          onClick={() => metadata === "image" && setShowImages(true)}
        >
          {images.map((img, index) =>
            index < 4 ? (
              <div
                className={`profile__page__post__image__container`}
                key={index}
                style={{
                  gridArea: `${
                    images.length > 2
                      ? index < 1
                        ? largeImage
                          ? `1/1/2/${images.length > 4 ? 4 : images.length}`
                          : `1/1/${images.length > 4 ? 4 : images.length}/2`
                        : largeImage
                        ? `2/${index}/3/${index + 1}`
                        : `${index}/3/${index + 1}/2`
                      : largeImage
                      ? `${index + 1}/1/${index + 2}/3`
                      : `1/${index + 1}/3/${index + 2}`
                  }`,
                }}
              >
                {metadata === "image" ? (
                  <img
                    onClick={() => changeActiveElement(info._id)}
                    onMouseOver={() => changeActiveElement(info._id)}
                    src={img?.url}
                    alt="img"
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  metadata === "video" && (
                    <div className="video__container">
                      <video
                        ref={(e) => (videoRef.current[index] = e)}
                        src={img?.url}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover" }}
                        controls
                      />
                      <div
                        onMouseEnter={() =>
                          deviceWidth > 900 && handleMouseIn(index, true)
                        }
                        onMouseLeave={() => (mouseIn = false)}
                        className="video__overlay"
                        onClick={() => handlePlay(index)}
                        onDoubleClick={() =>
                          videoRef.current[index].requestFullscreen()
                        }
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className={`profile__page__post__image__container flex__container__profile__page extra__images`}
                key={index}
                style={{
                  gridArea: `${largeImage ? "2/3/3/4" : "3/2/4/3"}`,
                }}
              >
                + {images.length - 4}
              </div>
            )
          )}
        </div>
      )}
      <div className="reaction__and__comments__container flex__container__profile__page">
        <div
          className="reaction__container  flex__container__profile__page"
          onClick={() => setShowCommentsorReactions("reactions")}
        >
          {showInReactionHolder.map((reaction, index) =>
            reaction === "like" ? (
              <ThumbUpAltIcon style={{ color: "#1860f2" }} key={index} />
            ) : reaction === "dislike" ? (
              <ThumbDownAltIcon style={{ color: "#1860f2" }} key={index} />
            ) : (
              reaction === "love" && (
                <FavoriteIcon style={{ color: "#ed2b46" }} key={index} />
              )
            )
          )}
          &nbsp;
          {allReactions.length > 2 && allReactions.length - 2}
        </div>
        {showCommentsorReactions === "reactions" && (
          <ShowReactions
            allReactions={allReactions}
            defaultShowCommentsorReactions={defaultShowCommentsorReactions}
          />
        )}
        <div
          className="comments__container  flex__container__profile__page"
          onClick={() => {
            setShowCommentsorReactions("comments");
          }}
        >
          {allComments.length > 0 && allComments.length}
          {allComments.length > 0 && ` comments`}
        </div>
        {showCommentsorReactions === "comments" && (
          <ShowComments
            info={info}
            allComments={allComments}
            defaultShowCommentsorReactions={defaultShowCommentsorReactions}
            handleDeleteReply={handleDeleteReply}
            handleDeleteComment={handleDeleteComment}
            postCreator={info.postCreator}
            forceUpdate={forceUpdate}
          />
        )}
      </div>
      <div className="post__container__bottom flex__container__profile__page">
        <div
          className="post__bottom__icons flex__container__profile__page"
          onPointerDown={() => {
            checkingMouseDownTime();
            console.log("mouseDown");
          }}
          onPointerUp={() => {
            console.log("mouse up");
            mouseDown = false;
          }}
          onClick={() => {
            console.log("mouse click");
            react === ""
              ? !showAnimatioButtons && putData("like")
              : !showAnimatioButtons && putData("");
          }}
          style={{ position: "relative" }}
        >
          {showAnimatioButtons && (
            <>
              <div
                className="bg__modal"
                onClick={() => {
                  console.log("false");
                  setShowAnimationButtons(false);
                }}
              />
              <div className="animation__buttons__container">
                <div
                  className="animated__button__container"
                  style={{ backgroundColor: "#1860f2" }}
                  onClick={() => {
                    putData("like");
                  }}
                >
                  <div className="animated__icons">
                    <ThumbUpAltIcon style={{ padding: 0 }} />
                  </div>
                </div>
                <div
                  className="animated__button__container"
                  style={{ backgroundColor: "#ed2b46" }}
                  onClick={() => {
                    putData("love");
                  }}
                >
                  <div className="animated__icons">
                    <FavoriteIcon />
                  </div>
                </div>
                <div
                  className="animated__button__container"
                  style={{ backgroundColor: "#1860f2" }}
                  onClick={() => {
                    putData("dislike");
                  }}
                >
                  <div className="animated__icons">
                    <ThumbDownAltIcon />
                  </div>
                </div>
              </div>
            </>
          )}
          {react === "" ? (
            <ThumbUpAltOutlinedIcon />
          ) : react === "like" ? (
            <ThumbUpAltIcon style={{ color: "#1860f2" }} />
          ) : react === "love" ? (
            <FavoriteIcon style={{ color: "#ed2b46" }} />
          ) : (
            react === "dislike" && (
              <ThumbDownAltIcon style={{ color: "#1860f2" }} />
            )
          )}
          &nbsp;Like
        </div>
        <div
          className="post__bottom__icons flex__container__profile__page"
          style={{ width: "44%" }}
          onClick={() => commentRef.current.focus()}
        >
          <ChatBubbleOutlineOutlinedIcon />
          &nbsp;Comment
        </div>
        <div className="post__bottom__icons flex__container__profile__page">
          <ShareOutlinedIcon />
          &nbsp; Share
        </div>
      </div>

      {allComments.length > 0 && (
        <div className="last__comment__container__parent">
          <div className="last__comment__container">
            <Avatar src={lastComment?.profilePicture} />
            <div className="comment__message__container">
              <div className="comment__name__container">
                {lastComment?.commentorName}
              </div>
              <div className="last__comment__message">
                {lastComment?.comment}
              </div>
              <div
                className="reply__message"
                onClick={() => {
                  setReplyToComment(!replyToComment);
                  setRefOfParentComment(lastComment?._id);
                }}
              >
                Reply
              </div>
            </div>
          </div>
          {allComments[0]?.replies.length > 0 && (
            <div className="replies__of__last__comment">
              {allComments[0]?.replies.length > 2 && "Show previous replies"}
              <div className="last__three__reply">
                {allComments[0]?.replies.map(
                  (item, index) =>
                    allComments[0]?.replies.length - index <= 2 && (
                      <div className="last__comment__container">
                        <Avatar src={item.replierPicUrl} />
                        <div className="comment__message__container">
                          <div className="comment__name__container">
                            {item?.replierName}
                          </div>
                          <div className="last__comment__message">
                            {item?.replierMsg}
                          </div>
                          <div
                            className="reply__message"
                            onClick={() => setReplyToComment(!replyToComment)}
                          >
                            Reply
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
          {replyToComment && (
            <div
              className="parent__reply__container"
              style={{ display: "flex" }}
              onLoad={() => replyInputRef.current.focus()}
            >
              <Avatar src={currentUserProfilePicture} />
              <div className="reply__input__container">
                <input
                  ref={replyInputRef}
                  className="reply__input"
                  type="text"
                  placeholder="Write a comment"
                  value={replierMsg}
                  onChange={(e) => setReplierMsg(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handlePostReplyToComment(allComments[0]._id)
                  }
                />
                <div className="comment__message">Press Enter to post.</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="post__comment flex__container__profile__page">
        <div className="comment__profile__picture">
          <Avatar src={currentUserProfilePicture} />
        </div>
        <div className="input__comment">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            ref={commentRef}
          />
          <div className="comment__message">Press Enter to post.</div>
        </div>
      </div>
    </div>
  );
}

export default Post;
