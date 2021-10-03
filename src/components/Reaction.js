import React from "react";
import { Avatar } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import FavoriteIcon from "@material-ui/icons/Favorite";
import "../css/show__allreactions.css";
function Reaction({ detail }) {
  return (
    <div className="reaction__details__container">
      <div className="profile__container">
        <Avatar src={detail.profilePicture} />
        <div
          className="individual__reaction__container"
          style={{
            backgroundColor: `${
              detail.reaction === "love" ? "#ed2b46" : "#1860f2"
            }`,
          }}
        >
          {detail.reaction === "like" ? (
            <ThumbUpAltIcon style={{ fontSize: "14px" }} />
          ) : detail.reaction === "dislike" ? (
            <ThumbDownAltIcon style={{ fontSize: "14px" }} />
          ) : (
            detail.reaction === "love" && (
              <FavoriteIcon style={{ fontSize: "14px" }} />
            )
          )}
        </div>
      </div>
      <div className="commentor__name">{detail.reactorName}</div>
      <div className="add__friend__conatiner">
        <PersonAddIcon /> &nbsp;&nbsp;Add Friend
      </div>
    </div>
  );
}

export default Reaction;
