import React, { useState, useEffect } from "react";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import "../css/friendReqsPage.css";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import ReqDisplay from "../components/ReqDisplay";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import axios from "../axios";
import { CircularProgress } from "@material-ui/core";

function FriendReqsPage({ currentUser }) {
  const [selectedButton, setSelectedButton] = useState("friendReqReceived");
  const [showFriendsArr, setShowFriendsArr] = useState([]);
  const [suggests, setSuggests] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  // const[suggestions,setSuggestions]=useState([])
  useEffect(() => {
    let allUsers = [];
    let frnds = [];
    let frndsToShow = [];
    let suggestions = [];
    let frndReqSent = [];
    let userMatch = false;
    let reqSent = false;
    setShowFriendsArr([]);
    setSuggests([]);
    async function fetchData() {
      setLoading(true);
      if (selectedButton !== "suggestions") {
        await axios
          .get(`user/${selectedButton}/${currentUser.email}`)
          .then((res) => {
            setLoading(false);
            setShowFriendsArr(res.data);
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      } else {
        await axios
          .get(`user`)
          .then((res) => {
            res.data.map(
              (item) =>
                item.email !== currentUser.email &&
                item.email !== "admin@gmail.com" &&
                allUsers.push(item)
            );
          })
          .catch((err) => console.log(err));
        await axios
          .get(`user/friends/${currentUser.email}`)
          .then((res) => (frnds = res.data))
          .catch((err) => console.log(err));
        await axios
          .get(`user/friendReqSent/${currentUser.email}`)
          .then((res) => (frndReqSent = res.data))
          .catch((err) => console.log(err));

        allUsers?.map((user) => {
          frnds?.map(
            (friend) => friend.friendsEmail === user.email && (userMatch = true)
          );
          if (!userMatch) {
            suggestions.push(user.email);
          } else {
            userMatch = false;
          }
          return true;
        });

        suggestions.map((frndSent) => {
          frndReqSent.map(
            (frnd) => frnd.sentTo === frndSent && (reqSent = true)
          );
          if (!reqSent) {
            frndsToShow.push(frndSent);
          } else {
            reqSent = false;
          }
          return true;
        });
      }
      setSuggests(frndsToShow);
    }
    fetchData();
    return () => {
      frndsToShow = [];
      setSuggests([]);
      setShowFriendsArr([]);
    };
  }, [selectedButton, currentUser, toggle]);

  useEffect(() => {
    if (suggests.length !== 0 && selectedButton === "suggestions") {
      async function fetchDetail(suggestion) {
        console.log(suggestion);
        await axios
          .get(`user/${suggestion}`)
          .then((res) => {
            setLoading(false);
            setShowFriendsArr((arr) => [...arr, res.data[0]]);
          })
          .catch((err) => console.log(err));
      }
      suggests.map((suggestion) => fetchDetail(suggestion));
    }
  }, [suggests, selectedButton]);

  async function handleUpdate() {
    setToggle(!toggle);
  }

  return (
    <div className="friend__request__parent__container">
      <div className="friend__request__container">
        <div className="sidebar__friend__req__container ">
          <div className="sidebar__friend__req__container__header frnd__req__flexor">
            <div className="header__title">Friends</div>
            <div className="button__logo__container frnd__req__flexor">
              <SettingsIcon />
            </div>
          </div>
          <div className="types__buttons frnd__req__flexor">
            <div
              className={`sidebar__buttons ${
                selectedButton === "friendReqReceived" &&
                "sidebar__buttons__isActive"
              }`}
              onClick={() => setSelectedButton("friendReqReceived")}
            >
              <div className="button__logo__container frnd__req__flexor">
                <PersonAddIcon />
              </div>
              Friend Requests
            </div>
            <div
              className={`sidebar__buttons ${
                selectedButton === "friendReqSent" &&
                "sidebar__buttons__isActive"
              }`}
              onClick={() => setSelectedButton("friendReqSent")}
            >
              <div className="button__logo__container frnd__req__flexor">
                <PersonAddDisabledIcon />
              </div>
              Requests Sent
            </div>
            <div
              className={`sidebar__buttons ${
                selectedButton === "friends" && "sidebar__buttons__isActive"
              }`}
              onClick={() => setSelectedButton("friends")}
            >
              <div className="button__logo__container frnd__req__flexor">
                <PersonIcon />
              </div>
              All Friends
            </div>
            <div
              className={`sidebar__buttons ${
                selectedButton === "suggestions" && "sidebar__buttons__isActive"
              }`}
              onClick={() => setSelectedButton("suggestions")}
            >
              <div className="button__logo__container frnd__req__flexor">
                <GroupAddIcon />
              </div>
              Suggestions
            </div>
          </div>
        </div>
        <div
          className={`req__displayer__container frnd__req__flexor ${
            showFriendsArr.length !== 0 &&
            showFriendsArr.length <= 2 &&
            "element__just__start"
          }
        `}
        >
          {showFriendsArr.length === 0 ? (
            <div className="no__req">
              {!loading ? (
                <>
                  <ErrorOutlineIcon
                    style={{ height: "30%", width: "30%", color: "#3a3b3c" }}
                  />
                  <p
                    className="no__ele"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    No
                    {selectedButton === "friendReqReceived"
                      ? " new friend request received"
                      : selectedButton === "friendReqSent"
                      ? " friend request's sent"
                      : selectedButton === "friends"
                      ? " friends found.Sent friends requests to make connection with others"
                      : selectedButton === "suggestions" &&
                        " suggestions found"}
                  </p>
                </>
              ) : (
                <CircularProgress />
              )}
            </div>
          ) : (
            showFriendsArr?.map(
              (friend) =>
                friend.friendsEmail !== "admin@gmail.com" && (
                  <ReqDisplay
                    details={friend}
                    doc={selectedButton}
                    handleUpdate={handleUpdate}
                  />
                )
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendReqsPage;
