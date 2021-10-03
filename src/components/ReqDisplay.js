import React, { useContext, useEffect, useState } from "react";
import axios from "../axios";
import "../css/friendReqsPage.css";
import handleAddOrRemoveFriend from "../functions/handleRequests";
import PersonIcon from "@material-ui/icons/Person";
import UserContext from "../UserContext";
import CircularProgress from "@material-ui/core/CircularProgress";

function ReqDisplay({ details, doc, handleUpdate }) {
  const userDetails = useContext(UserContext);
  const [user, setUser] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    if (doc !== "suggestions") {
      const field =
        doc === "friendReqReceived"
          ? "receivedFrom"
          : doc === "friendReqSent"
          ? "sentTo"
          : doc === "friends" && "friendsEmail";
      axios
        .get(`user/${details[field]}`)
        .then((res) => setUser(res.data[0]))
        .catch((err) => console.log(err));
    } else {
      setUser(details);
    }
  }, [details, doc]);
  return (
    <div className="req__holder frnd__req__flexor">
      <div className="req__image__container frnd__req__flexor ">
        {user?.profilePicture && !imageLoaded && (
          <div className="loader__profile__image">
            <CircularProgress />
          </div>
        )}
        {user?.profilePicture ? (
          <img
            src={user?.profilePicture}
            onLoad={() => {
              setImageLoaded(true);
            }}
            alt="preview"
            height="100%"
            width="100%"
            style={{ display: `${!imageLoaded ? "none" : "block"}` }}
          />
        ) : (
          <div className="no__Profil__IMG ">
            <PersonIcon />
          </div>
        )}
      </div>
      <div className="info__and__buttons">
        <div className="user__name">{user?.userName}</div>
        <div
          className={`${
            doc === "friendReqReceived" && "two__multi__use__button"
          }`}
        >
          <div
            className="multi__use__button"
            onClick={() => {
              let ret = handleAddOrRemoveFriend(doc, user, userDetails);
              ret.then((res) => {
                if (res) handleUpdate();
              });
            }}
          >
            {doc === "friendReqReceived"
              ? "Confirm"
              : doc === "friendReqSent"
              ? "Cancel"
              : doc === "friends"
              ? "Remove"
              : doc === "suggestions" && "Add Friend"}
          </div>
          {doc === "friendReqReceived" && (
            <div
              className="multi__use__button"
              onClick={() => {
                let ret = handleAddOrRemoveFriend(
                  "request_sent",
                  user,
                  userDetails
                );
                ret.then((res) => res && handleUpdate());
              }}
            >
              Delete
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReqDisplay;
