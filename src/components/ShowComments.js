import React, { useEffect, useRef, useState } from "react";
import "../css/show__allcomments.css";
import Comment from "./Comment";
import CancelIcon from "@material-ui/icons/Cancel";

function ShowComments({
  info,
  allComments,
  postCreator,
  defaultShowCommentsorReactions,
  handleDeleteComment,
  handleDeleteReply,
  forceUpdate,
}) {
  useEffect(() => {
    allComments.length === 0 && defaultShowCommentsorReactions();
    commentRef.current?.scrollIntoView();
  }, [allComments, defaultShowCommentsorReactions]);
  const [readingComment, setReadingComment] = useState();
  const commentRef = useRef();
  function setCommentRef(id) {
    setReadingComment(id);
  }
  return (
    <>
      <div className="show__all__Comments__or__Reactions__container" />
      <div className="comments__parent__container">
        <div className="comments__container__header">
          <div className="Comments__header">Comments</div>
          <div
            className="cancel__button__comments__conatainer"
            onClick={defaultShowCommentsorReactions}
          >
            <CancelIcon style={{ fontSize: "35px" }} />
          </div>
        </div>
        <div className="container__all__comments">
          {allComments.map((comment) => (
            <div className="parent__comment">
              <Comment
                info={info}
                handleDeleteReply={handleDeleteReply}
                handleDeleteComment={handleDeleteComment}
                comment={comment}
                postCreator={postCreator}
                forceUpdate={forceUpdate}
                setCommentRef={setCommentRef}
              />
              {comment._id === readingComment && (
                <div className="scrollCommentIntoView" ref={commentRef} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ShowComments;
