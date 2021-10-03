import React, { useContext, useEffect, useState } from "react";
import axios from "../axios";
import "../css/notification.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import PostIdForSinglePostShow from "../PostIdContext";

function Notice({ notice }) {
  const [profile, setProfile] = useState("");
  const setPostId = useContext(PostIdForSinglePostShow);
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`user/${notice.creatorEmail}`)
        .then((res) => setProfile(res.data[0]))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [notice.creatorEmail]);

  return (
    <>
      {notice?.postId ? (
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            className={`notification__container ${!notice.seen && "not__seen"}`}
            onClick={() => setPostId(notice.postId)}
          >
            <div className="profilePic__for__notification">
              <Avatar src={profile?.profilePicture} />
            </div>
            <div className="notification__msg">
              <span className="name">{profile?.userName}</span> {notice.notice}
            </div>
          </div>
        </Link>
      ) : (
        <Link
          to={{
            pathname: `/${profile?.userName}/Profile`,
            state: { showProfileOfUser: profile },
          }}
          style={{ textDecoration: "none" }}
        >
          <div
            className={`notification__container ${!notice.seen && "not__seen"}`}
          >
            <div className="profilePic__for__notification">
              <Avatar src={profile?.profilePicture} />
            </div>
            <div className="notification__msg">
              <span className="name">{profile?.userName}</span> {notice.notice}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default Notice;
