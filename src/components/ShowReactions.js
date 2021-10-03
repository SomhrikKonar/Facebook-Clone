import React, { useEffect, useState } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import CancelIcon from "@material-ui/icons/Cancel";
import "../css/show__allreactions.css";
import Reaction from "./Reaction";
function ShowReactions({ allReactions, defaultShowCommentsorReactions }) {
  const [selectedReaction, setSelectedReaction] = useState("all");
  const [reactionCounter, setReactionCounter] = useState({
    like: 0,
    love: 0,
    dislike: 0,
  });
  const [reaction, setReaction] = useState({
    like: [],
    love: [],
    dislike: [],
  });

  useEffect(() => {
    let like = 0;
    let love = 0;
    let dislike = 0;
    let likeArr = [];
    let loveArr = [];
    let dislikeArr = [];
    allReactions.map((reaction) =>
      reaction.reaction === "like"
        ? (like = like + 1 && likeArr.push(reaction))
        : reaction.reaction === "love"
        ? (love = love + 1 && loveArr.push(reaction))
        : reaction.reaction === "dislike" &&
          (dislike = dislike + 1 && dislikeArr.push(reaction))
    );
    setReactionCounter({ like: like, love: love, dislike: dislike });
    setReaction({ like: likeArr, love: loveArr, dislike: dislikeArr });
  }, [allReactions]);
  return (
    <>
      <div className="show__all__Comments__or__Reactions__container" />
      <div className="all__reaction__container">
        <div className="reaction__container__header">
          <div className="emojis">
            <div
              className="emoji__container"
              style={{
                fontSize: "20px",
              }}
              onClick={() => setSelectedReaction("all")}
            >
              <div className="show__Reaction">
                <div>All</div>
              </div>

              <div
                className="selected__indicator"
                style={{
                  display: `${selectedReaction === "all" ? "flex" : "none"}`,
                }}
              />
            </div>
            <div
              className="emoji__container"
              onClick={() => setSelectedReaction("like")}
            >
              <div className="show__Reaction">
                <ThumbUpAltIcon
                  style={{
                    color: "#1860f2",
                    fontSize: "30px",
                    marginRight: "4px",
                  }}
                />
                {reactionCounter.like}
              </div>
              <div
                className="selected__indicator"
                style={{
                  display: `${selectedReaction === "like" ? "flex" : "none"}`,
                }}
              />
            </div>
            <div
              className="emoji__container"
              onClick={() => setSelectedReaction("love")}
            >
              <div className="show__Reaction">
                <FavoriteIcon
                  style={{
                    color: "#ed2b46",
                    marginRight: "4px",
                    fontSize: "30px",
                  }}
                />
                {reactionCounter.love}
              </div>
              <div
                className="selected__indicator"
                style={{
                  display: `${selectedReaction === "love" ? "flex" : "none"}`,
                }}
              />
            </div>
            <div
              className="emoji__container"
              onClick={() => setSelectedReaction("dislike")}
            >
              <div className="show__Reaction">
                <ThumbDownAltIcon
                  style={{
                    color: "#1860f2",
                    fontSize: "30px",
                    marginRight: "6px",
                  }}
                />
                {reactionCounter.dislike}
              </div>
              <div
                className="selected__indicator"
                style={{
                  display: `${
                    selectedReaction === "dislike" ? "flex" : "none"
                  }`,
                }}
              />
            </div>
          </div>
          <div
            className="close__reaction__container"
            onClick={defaultShowCommentsorReactions}
          >
            <CancelIcon style={{ fontSize: "30px", cursor: "pointer" }} />
          </div>
        </div>
        <div className="bottom__reaction__container">
          {selectedReaction === "all"
            ? allReactions.map((reactionDetails) => (
                <Reaction detail={reactionDetails} />
              ))
            : selectedReaction === "love"
            ? reaction.love.map((reactionDetails) => (
                <Reaction detail={reactionDetails} />
              ))
            : selectedReaction === "like"
            ? reaction.like.map((reactionDetails) => (
                <Reaction detail={reactionDetails} />
              ))
            : selectedReaction === "dislike" &&
              reaction.dislike.map((reactionDetails) => (
                <Reaction detail={reactionDetails} />
              ))}
        </div>
      </div>
    </>
  );
}

export default ShowReactions;
