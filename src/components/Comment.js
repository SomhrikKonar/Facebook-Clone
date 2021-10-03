import React, { useContext, useRef, useState } from "react";
import { Avatar } from "@material-ui/core";
import UserContext from "../UserContext";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import "../css/show__allcomments.css";
import axios from "../axios";
function Comment({
  info,
  comment,
  postCreator,
  handleDeleteComment,
  handleDeleteReply,
  forceUpdate,
  setCommentRef,
}) {
  const userDetails = useContext(UserContext);
  const [showDelete, setShowDelete] = useState({ state: false, id: 0 });
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState(false);
  const replyMsgRef = useRef();
  const [replyMsg, setReplyMsg] = useState();

  async function handlePostReply() {
    if (replyMsg) {
      await axios
        .put(`post/${info._id}/${comment._id}/updateReply`, {
          replyDetail: {
            replierName: userDetails.userName,
            replierPicUrl: userDetails.profilePicture,
            replierEmail: userDetails.email,
            replierMsg: replyMsg,
          },
        })
        .then(() => {
          setShowReplies(true);
          setReply(false);
          setReplyMsg("");
          forceUpdate();
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div
      className="parent__single__comment__container"
      style={{ marginBottom: "30px" }}
    >
      <div
        className={`last__comment__container ${
          (userDetails.email === postCreator ||
            userDetails.email === comment.commentedBy) &&
          "delete__comment__available"
        }`}
        style={{ marginBottom: "5px" }}
      >
        <Avatar src={comment?.profilePicture} />
        <div className="comment__message__container">
          <div className="comment__name__container">
            {comment?.commentorName}
          </div>
          <div className="last__comment__message">{comment?.comment}</div>
        </div>
        <div
          className="show__more__horizontal__icons"
          onClick={() => {
            setShowDelete({
              state: !showDelete,
              id: showDelete.id === comment._id ? 0 : comment._id,
            });
            setCommentRef(info._id);
          }}
          style={{
            display: `${showDelete.id === comment._id ? "block " : "none"}`,
          }}
        >
          <MoreHoriz />
        </div>
        {showDelete.id === comment._id && (
          <div className="delete__button__container">
            <div
              className="delete__button"
              onClick={() => {
                handleDeleteComment(comment._id);
              }}
            >
              Delete
            </div>
          </div>
        )}
      </div>

      <div className="show__and__replies__container">
        {comment?.replies.length > 0 && (
          <div
            className="show__replies__button"
            onClick={() => {
              setShowReplies(!showReplies);
              setCommentRef(info._id);
            }}
          >
            Show all replies
          </div>
        )}
        <div
          className="add__reply"
          onClick={() => {
            setReply(!reply);
            setCommentRef(info._id);
          }}
        >
          Reply
        </div>
      </div>
      {comment?.replies.length > 0 && showReplies && (
        <div className="replies__container">
          {comment?.replies.map((item, index) => (
            <div className="comment__parent__container">
              <div
                className={`last__comment__container ${
                  (userDetails.email === postCreator ||
                    userDetails.email === item.replierEmail) &&
                  "delete__comment__available"
                }`}
                style={{ margin: "10px 0px" }}
                key={index}
              >
                <Avatar src={item?.replierPicUrl} />
                <div className="comment__message__container">
                  <div className="comment__name__container">
                    {item?.replierName}
                  </div>
                  <div className="last__comment__message">
                    {item?.replierMsg}
                  </div>
                </div>
                <div
                  className="show__more__horizontal__icons"
                  onClick={() =>
                    setShowDelete({
                      state: !showDelete,
                      id: showDelete.id === item._id ? 0 : item._id,
                    })
                  }
                  style={{
                    display: `${
                      showDelete.id === item._id ? "block " : "none"
                    }`,
                  }}
                >
                  <MoreHoriz />
                </div>
                {showDelete.id === item._id && (
                  <div className="delete__button__container">
                    <div
                      className="delete__button"
                      onClick={() => {
                        handleDeleteReply(comment._id, item._id);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
              <div
                className="add__reply"
                style={{ marginTop: "-8px", marginLeft: "50px" }}
                onClick={() => setReply(!reply)}
              >
                Reply
              </div>
            </div>
          ))}
        </div>
      )}
      {reply && (
        <div
          className="parent__reply__container"
          style={{ display: "flex", marginTop: "10px" }}
          onLoad={() => replyMsgRef.current.focus()}
        >
          <Avatar src={userDetails.profilePicture} />
          <div className="reply__input__container">
            <input
              ref={replyMsgRef}
              className="reply__input"
              type="text"
              placeholder="Write a comment"
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handlePostReply(comment._id)
              }
            />
            <div className="comment__message">Press Enter to post.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comment;
