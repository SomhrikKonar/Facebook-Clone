import React, { useContext, useEffect, useState } from "react";
import "../css/contacts.css";
import SearchIcon from "@material-ui/icons/Search";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import UserContext from "../UserContext";
import axios from "../axios";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
function Contacts() {
  const userDetails = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [friendDetails, setFriendDetails] = useState([]);
  useEffect(() => {
    const Socket = io("https://socket-fb.herokuapp.com");
    Socket.on("changeInUsersColl", (change) => {
      fetchData();
    });
    async function fetchData() {
      console.log("working112");

      await axios
        .get(`user/${userDetails?.email}`)
        .then((res) => getData(res.data[0].friends))
        .catch((err) => console.log(err));

      function getData(friends) {
        setFriends([]);
        setFriendDetails([]);
        friends?.map((friend) => {
          axios
            .get(`user/${friend.friendsEmail}`)
            .then((res) =>
              setFriendDetails((prevState) => [...prevState, res.data[0]])
            )
            .catch((err) => console.log(err));
        });
      }
    }
    return () => {
      Socket.close();
      setFriends([]);
      setFriendDetails([]);
    };
  }, [userDetails?.email]);
  console.log("freidns", friends, "friednsDetails", friendDetails);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`user/${userDetails?.email}`)
        .then((res) => getData(res.data[0].friends))
        .catch((err) => console.log(err));

      function getData(friends) {
        setFriends([]);
        setFriendDetails([]);
        friends?.map((friend) => {
          axios
            .get(`user/${friend.friendsEmail}`)
            .then((res) =>
              setFriendDetails((prevState) => [...prevState, res.data[0]])
            )
            .catch((err) => console.log(err));
        });
      }
    }
    fetchData();
    return () => {
      setFriends([]);
      setFriendDetails([]);
    };
  }, [userDetails?.email]);
  console.log(friendDetails);

  return (
    <div className="right__sidebar__container">
      <div className="contacts__container">
        <div className="header">
          <div className="title">Contacts</div>
          <div className="icon">
            <VideoCallIcon />
          </div>

          <div className="icon">
            <SearchIcon />
          </div>

          <div className="icon">
            <MoreHorizIcon />
          </div>
        </div>
        <div className="online__user__containers flex__contacts">
          {friendDetails?.map((frnd) => (
            <Link
              to={{
                pathname: `/${frnd?.userName}/Profile`,
                state: { showProfileOfUser: frnd },
              }}
              style={{
                textDecoration: "none",
                color: "#f3f3f3",
                width: "80%",
                float: "right",
              }}
              key={frnd._id}
            >
              <div className="friendsOnlineStatus flex__contacts">
                <div className="contact__profile__image__container">
                  <Avatar src={frnd?.profilePicture} />
                  <div
                    className="isOnline"
                    style={{
                      backgroundColor: `${frnd?.isActive ? "green" : "red"}`,
                    }}
                  />
                </div>

                <p className="contact__name">{frnd?.userName}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contacts;
