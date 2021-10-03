import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/header.css";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import GroupOutlinedIcon from "@material-ui/icons/GroupOutlined";
import MovieOutlinedIcon from "@material-ui/icons/MovieOutlined";
import StorefrontOutlinedIcon from "@material-ui/icons/StorefrontOutlined";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import MovieIcon from "@material-ui/icons/Movie";
import StorefrontIcon from "@material-ui/icons/Storefront";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import axios from "../axios";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import Notifications from "./Notifications";
import { io } from "socket.io-client";
import handleNotification from "../functions/handleNotification";
import PostIdForSinglePostShow from "../PostIdContext";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { auth } from "../firebase";
import DeleteUser from "./DeleteUser";
function Header({ userDetails, len, setReload, reload }) {
  const location = useLocation().pathname;
  const [selectedIcon, setSelectedIcon] = useState("home");
  const [allUser, setAllUser] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [show, setShow] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [notices, setNotices] = useState(0);
  let search = "";
  const setPostId = useContext(PostIdForSinglePostShow);

  async function handleSignOut() {
    await axios
      .put(`user/${userDetails.email}/update/isActive`, {
        field: false,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    auth.signOut();
  }

  //socket listner
  useEffect(() => {
    const Socket = io("https://socket-fb.herokuapp.com");

    axios
      .put(`user/${userDetails.email}/update/isActive`, {
        field: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    Socket.on("changeInPostsColl", (change) => {
      console.log("length", len);
      handleNotification(change, userDetails, len);
    });
    Socket.on("changeInUsersColl", (change) => {
      handleNotification(change, userDetails);
    });
    Socket.on("changeInNotificationsColl", (change) => {
      let notices;
      axios
        .get(`notification/getUserByMail/${userDetails?.email}`)
        .then((res) => {
          notices = res.data.notifications;
          let filteredNotices = notices?.filter(
            (notice) => notice?.seen === false
          );
          setNotices(filteredNotices);
        })
        .catch((err) => console.log(err));
    });
    return () => {
      Socket.close();
    };
  }, [userDetails, show, selectedIcon, len]);

  useEffect(() => {
    async function fetchData() {
      axios
        .get("user")
        .then((res) => setAllUser(res.data))
        .catch((err) => console.log(err));

      axios
        .get(`notification/getUserByMail/${userDetails.email}`)
        .then((res) => {
          let Notice = res.data.notifications.filter(
            (notice) => notice?.seen === false
          );
          console.log(Notice);
          setNotices(Notice);
        })
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [userDetails.email]);

  useEffect(() => {
    console.log("working 111");
    if (location === "/") {
      setSelectedIcon("home");
    } else if (location === `/${userDetails?.userName}/Profile`) {
      setSelectedIcon("userDetails");
    } else if (location === `/${userDetails?.userName}/FriendReqs`) {
      setSelectedIcon("friends");
    } else if (location === "/videos") {
      setSelectedIcon("watch");
    } else if (location === "/marketplace") {
      setSelectedIcon("shop");
    } else if (location === "notifications") {
      setSelectedIcon("notifications");
    }
  }, [location, userDetails]);

  function handleSearch(e) {
    let match = [];
    search = e.target.value.trim();
    search = search.toLowerCase();

    if (search.length > 0) {
      match = allUser.filter(function (user) {
        const name = user.userName;
        const Fname = name?.substr(0, name.indexOf(" ")).toLowerCase();
        const Lname = name
          ?.substr(name.indexOf(" ") + 1, name.length)
          .toLowerCase();
        return (
          Fname?.substr(0, search.length) === search ||
          Lname?.substr(0, search.length) === search
        );
      });
    }
    setSearchUser(match);
  }

  function updateSeen() {
    if (notices?.length > 0)
      notices?.map((notification) =>
        axios
          .put(`notification/seen/${userDetails.email}/${notification._id}`)
          .then((res) => {
            axios
              .get(`notification/getUserByMail/${userDetails?.email}`)
              .then((res) => {
                let notices = res.data.notifications;
                let filteredNotices = notices?.filter(
                  (notice) => notice?.seen === false
                );
                setNotices(filteredNotices);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err))
      );
  }

  return (
    <div className="header__container">
      <div className="header__left">
        <div className="header__logo" />
        <div className="header__searchbar">
          <TextField
            className="search"
            id="input-with-icon-textfield"
            placeholder="Search Facebook"
            onChange={(e) => {
              handleSearch(e);
              setSearchValue(e.target.value.trim());
            }}
            value={searchValue}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#e4e6eb " }} />
                </InputAdornment>
              ),
            }}
          />
          <div className="search__result__container">
            {searchUser.length > 0 && (
              <div
                className="back__arrow__container"
                onClick={() => {
                  setSearchUser([]);
                }}
              >
                <div className="back__arrow" onClick={() => setSearchValue("")}>
                  <KeyboardBackspaceIcon
                    style={{ color: "#f5f5f5", fontSize: "30px" }}
                  />
                </div>
              </div>
            )}
            {searchUser.map((user) => (
              <Link
                to={{
                  pathname: `/${user?.userName}/Profile`,
                  state: { showProfileOfUser: user },
                }}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setSearchValue("");
                  setSearchUser([]);
                }}
              >
                <div className="serach__result" key={user.email}>
                  <Avatar src={user.profilePicture} />
                  <div className="serach__result__name">{user.userName}</div>
                  <div className="add__friend">
                    <PersonAddIcon style={{ color: "#f5f5f5" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div
          className="burger__button"
          onClick={() => setShow(show === "moreOptions" ? "" : "moreOptions")}
        >
          <MenuIcon style={{ fontSize: "30px" }} />
        </div>
      </div>
      <div className="header__buttons__container">
        <div
          className={`router__button ${selectedIcon === "home" && "isActive"}`}
          onClick={() => {
            setSelectedIcon("home");
            setPostId(undefined);
          }}
        >
          <Link
            onClick={() => selectedIcon === "home" && setReload(!reload)}
            to="/"
            className="home__link"
            style={{ textDecoration: "none" }}
          >
            <div className="router__button__icon">
              {selectedIcon !== "home" ? (
                <HomeOutlinedIcon style={{ fontSize: "30px" }} />
              ) : (
                <HomeIcon style={{ fontSize: "30px", color: "#2d88ff" }} />
              )}
            </div>
          </Link>
          <div className="router__button__bottom" />
        </div>

        <div
          className={`router__button ${
            selectedIcon === "friends" && "isActive"
          }`}
          onClick={() => setSelectedIcon("friends")}
        >
          <Link
            to={`/${userDetails?.userName}/FriendReqs`}
            className="friendReq__link"
            style={{ textDecoration: "none" }}
          >
            <div className="router__button__icon">
              {selectedIcon === "friends" ? (
                <GroupIcon style={{ fontSize: "30px", color: "#2d88ff" }} />
              ) : (
                <GroupOutlinedIcon style={{ fontSize: "30px" }} />
              )}
            </div>
          </Link>
          <div className="router__button__bottom" />
        </div>

        <div
          className={`router__button ${selectedIcon === "watch" && "isActive"}`}
          onClick={() => setSelectedIcon("watch")}
        >
          <Link
            to={"/videos"}
            className="watch__link"
            style={{ textDecoration: "none" }}
          >
            <div className="router__button__icon">
              {selectedIcon === "watch" ? (
                <MovieIcon style={{ fontSize: "30px", color: "#2d88ff" }} />
              ) : (
                <MovieOutlinedIcon style={{ fontSize: "30px" }} />
              )}
            </div>
          </Link>
          <div className="router__button__bottom" />
        </div>
        <div
          className={`router__button ${selectedIcon === "shop" && "isActive"}`}
          onClick={() => setSelectedIcon("shop")}
        >
          <Link
            to="/marketplace"
            className="shop__link"
            style={{ textDecoration: "none" }}
          >
            <div className="router__button__icon">
              {selectedIcon !== "shop" ? (
                <StorefrontOutlinedIcon style={{ fontSize: "30px" }} />
              ) : (
                <StorefrontIcon
                  style={{ fontSize: "30px", color: "#2d88ff" }}
                />
              )}
            </div>
          </Link>
          <div className="router__button__bottom" />
        </div>
        <div
          className={`router__button notification__button ${
            selectedIcon === "notifications" && "isActive"
          }`}
          onClick={() => setSelectedIcon("notifications")}
        >
          <Link
            to={{
              pathname: "/notifications",
              data: { updateSeen: updateSeen },
            }}
            className="shop__link"
            style={{ textDecoration: "none" }}
          >
            <div className="router__button__icon">
              {selectedIcon === "notifications" ? (
                <div style={{ position: "relative" }}>
                  <NotificationsIcon
                    style={{ fontSize: "30px", color: "#2d88ff" }}
                  />
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <div className="numberOfNotification">{notices?.length}</div>
                  <NotificationsNoneOutlinedIcon style={{ fontSize: "30px" }} />
                </div>
              )}
            </div>
          </Link>
          <div className="router__button__bottom" />
        </div>
      </div>
      <div className="header__right">
        <Link
          to={{
            pathname: `/${userDetails?.userName}/Profile`,
            state: { showProfileOfUser: userDetails },
          }}
          style={{ textDecoration: "none" }}
        >
          <div
            className={`header__userDetails ${
              selectedIcon === "userDetails" && "selected__header__userDetails"
            }`}
            onClick={() => setSelectedIcon("userDetails")}
          >
            <Avatar src={userDetails?.profilePicture} />
            <p>
              {userDetails?.userName?.slice(
                0,
                userDetails?.userName.indexOf(" ")
              )}
            </p>
          </div>
        </Link>
        <div className="icon__button__container">
          <div className="icon__button">
            <AddIcon style={{ fontSize: "25px" }} />
          </div>
          <div className="icon__button">
            <MessageOutlinedIcon style={{ fontSize: "20px" }} />
          </div>
          <div
            className={`icon__button ${
              show === "notification" && "selected__icon"
            }`}
            style={{ position: "relative" }}
          >
            <div
              onClick={() =>
                setShow(show === "notification" ? "" : "notification")
              }
            >
              <div className="numberOfNotification">{notices?.length}</div>
              <NotificationsNoneOutlinedIcon style={{ fontSize: "25px" }} />
            </div>
            {show === "notification" && (
              <Notifications updateSeen={updateSeen} />
            )}
          </div>
          <div
            className="icon__button"
            style={{ postion: "relative" }}
            onClick={() => setShow(show === "moreOptions" ? "" : "moreOptions")}
          >
            <ArrowDropDownIcon style={{ fontSize: "35px" }} />
          </div>
        </div>
      </div>
      {show === "moreOptions" && (
        <div className="more__options__container">
          <div className="logout__button" onClick={() => handleSignOut()}>
            <div className="logout__icon">
              <ExitToAppRoundedIcon
                style={{ marginTop: "3px", fontSize: "20px" }}
              />
            </div>
            <div className="logout__text">Logout</div>
          </div>
          <div className="delete__button" onClick={() => setShowDelete(true)}>
            <div className="delete__icon">
              <DeleteRoundedIcon
                style={{ marginTop: "3px", fontSize: "20px" }}
              />
            </div>
            <div className="delete__text">Delete</div>
          </div>
          {showDelete && <DeleteUser setShowDelete={setShowDelete} />}
        </div>
      )}
    </div>
  );
}

export default Header;
