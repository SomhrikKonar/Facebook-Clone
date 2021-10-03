import React, { useState, useEffect, useRef } from "react";
import "../css/profilepage.css";
import ProfilePagePostContainer from "../components/ProfilePagePostContainer";
import ProfilePageSideContainer from "../components/ProfilePageSideContainer";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import TextField from "@material-ui/core/TextField";
import PublicIcon from "@material-ui/icons/Public";
import { TextareaAutosize } from "@material-ui/core";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import { storage } from "../firebase";
import axios from "../axios";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useLocation } from "react-router-dom";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";

function Profilepage({ currentUser }) {
  const location = useLocation();
  const profileOfUser = location.state.showProfileOfUser;
  const [openEditBio, setOpenEditBio] = useState(false);
  const [changeInitiated, setChangeInitiated] = useState(false);
  const [charRemaining, setCharacterRemaining] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [coverPic, setCoverPic] = useState();
  const [profilePic, setProfilePic] = useState();
  const [friends, setFriends] = useState([]);
  const [userIsFriend, setUserIsFrined] = useState("not_friend");
  const [friendsReqReceived, setFriendsReqReceived] = useState([]);
  const [friendsReqSent, setFriendsReqSent] = useState([]);
  const refToEditBio = useRef();
  const [newBio, setNewBio] = useState();
  const [userBio, setUserBio] = useState(userDetails?.bio);
  //userIsFriend=> isFriend,not_friend,request_sent,received_request

  const coverPictureRef = storage
    .ref()
    .child(`Cover Pictures/${profileOfUser.email}`);
  const profilePictureRef = storage
    .ref()
    .child(`Profile Pictures/${profileOfUser.email}`);

  useEffect(() => {
    axios
      .get(`user/${profileOfUser.email}`)
      .then((res) => {
        setUserDetails(res.data[0]);
        setNewBio(res.data[0].bio);
      })
      .catch((err) => console.log(err));
  }, [profileOfUser]);

  // getting all friends
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`user/${"friends"}/${currentUser.email}`)
        .then((res) => setFriends(res.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [currentUser]);

  //getting all friend requests received
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`user/${"friendReqReceived"}/${currentUser.email}`)
        .then((res) => setFriendsReqReceived(res.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [currentUser]);

  //getting all friend requests sent
  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`user/${"friendReqSent"}/${currentUser.email}`)
        .then((res) => setFriendsReqSent(res.data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const userFound = friends.find(
      (frnd) => frnd.friendsEmail === profileOfUser.email
    );
    const friendReqSent = friendsReqSent.find(
      (req) => req.sentTo === profileOfUser.email
    );
    const friendReqReceived = friendsReqReceived.find(
      (req) => req.receivedFrom === profileOfUser.email
    );
    setUserIsFrined(
      userFound !== undefined
        ? "isFriend"
        : friendReqReceived !== undefined
        ? "received_request"
        : friendReqSent !== undefined
        ? "request_sent"
        : "not_friend"
    );
  }, [friends, friendsReqReceived, friendsReqSent, profileOfUser.email]);

  useEffect(() => {
    if (userDetails?.bio !== undefined) {
      setUserBio(userDetails?.bio);
      setCharacterRemaining(
        `${100 - userDetails?.bio?.length} characters remaining`
      );
    }
  }, [userDetails]);

  const handleBioUpdate = async () => {
    await axios
      .put(`user/${userDetails.email}/update/bio`, {
        field: userBio,
      })
      .then((res) => {
        setNewBio(userBio);
        setOpenEditBio(false);
        console.log("bio", res);
      })
      .catch((err) => console.log(err));
  };

  async function handleCancel() {
    await axios
      .get(`user/${profileOfUser.email}`)
      .then((res) => setUserDetails(res.data[0]))
      .catch((err) => console.log(err));

    console.warn(userDetails?.bio);
    setUserBio(userDetails?.bio);
    setCharacterRemaining(
      `${100 - userDetails?.bio.length} characters remaining`
    );
    setOpenEditBio(false);
    setChangeInitiated(false);
  }

  function handleNewBio(e) {
    setChangeInitiated(TextareaAutosize);
    console.log(userBio.length);
    if (userBio.length <= 100) {
      setUserBio(e.target.value);
      setCharacterRemaining(
        `${100 - e.target.value.length} characters remaining`
      );
    } else {
      setCharacterRemaining("bio cant exceed 100 character");
    }
  }

  useEffect(() => {
    async function fetchPictures() {
      await axios
        .get(`user/${profileOfUser.email}`)
        .then((res) => {
          setCoverPic(res.data[0].coverPicture);
          setProfilePic(res.data[0].profilePicture);
        })
        .catch((err) => console.log(err));
    }
    fetchPictures();
  }, [profileOfUser]);

  async function handleAddOrRemoveFriend(userIsFriend) {
    let Err = "";
    if (userIsFriend === "not_friend") {
      await axios
        .put(`user/sendFriendReqs`, {
          sentTo: profileOfUser.email,
          userMail: currentUser.email,
          pushToReciever: "true",
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));
      await axios
        .put(`user/sendFriendReqs`, {
          sentTo: profileOfUser.email,
          userMail: currentUser.email,
          pushToReciever: "false",
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));

      if (Err) {
        console.log(Err);
      } else {
        setUserIsFrined("request_sent");
      }
    } else if (userIsFriend === "received_request") {
      await axios
        .put(`user/addFriend`, {
          sentBy: profileOfUser.email,
          userMail: currentUser.email,
          updateInSender: "true",
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));
      await axios
        .put(`user/addFriend`, {
          sentBy: profileOfUser.email,
          userMail: currentUser.email,
          updateInSender: "false",
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));

      if (Err) {
        console.log(Err);
      } else {
        setUserIsFrined("isFriend");
      }
    } else if (userIsFriend === "isFriend") {
      await axios
        .put(`user/removeFriend`, {
          removeUser: profileOfUser.email,
          userMail: currentUser.email,
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));
      await axios
        .put(`user/removeFriend`, {
          removeUser: currentUser.email,
          userMail: profileOfUser.email,
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));
      if (Err) {
        console.log(Err);
      } else {
        setUserIsFrined("not_friend");
      }
    } else if (userIsFriend === "request_sent") {
      await axios
        .put(`user/cancelFriendReq`, {
          sentTo: profileOfUser.email,
          userMail: currentUser.email,
          updateInSender: "true",
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));
      await axios
        .put(`user/cancelFriendReq`, {
          sentTo: profileOfUser.email,
          userMail: currentUser.email,
          updateInSender: "false",
        })
        .then((res) => console.log(res))
        .catch((err) => (Err = err));
      if (Err) {
        console.log(Err);
      } else {
        setUserIsFrined("not_friend");
      }
    }
  }

  async function handleCoverUpload(e) {
    let file = e.target.files[0];
    await coverPictureRef.put(file).then(() => {
      coverPictureRef.getDownloadURL().then((res) => {
        setCoverPic(res);
        axios.put(`user/${userDetails.email}/update/coverPicture`, {
          field: res,
        });
      });
    });
  }

  async function handleProfilePicUpdate(e) {
    let file = e.target.files[0];
    await profilePictureRef.put(file).then(() =>
      profilePictureRef.getDownloadURL().then((res) => {
        setProfilePic(res);

        axios.put(`user/${userDetails.email}/update/profilePicture`, {
          field: res,
        });
      })
    );
  }

  function updateBio() {
    refToEditBio.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setOpenEditBio(true);
  }

  return (
    <div className="Profilepage__container">
      <div className="Profilepage__profile__container">
        <div className="profile__top__container">
          <div
            className="image__conatainer"
            style={{
              background: `${coverPic ? `url(${coverPic})` : "aliceblue"}`,
            }}
          >
            <div className="profile__picture__container">
              <div
                className="profile__picture"
                style={{
                  background: `${profilePic ? `url(${profilePic})` : "grey"}`,
                }}
              >
                {currentUser.email === profileOfUser.email && (
                  <div className="profile__picture__uploader">
                    <label
                      htmlFor="input__profile__picture"
                      style={{ cursor: "pointer" }}
                    >
                      <CameraAltIcon
                        style={{ color: "white", fontSize: "25px" }}
                      />
                    </label>
                    <input
                      id="input__profile__picture"
                      type="file"
                      onChange={handleProfilePicUpdate}
                    />
                  </div>
                )}
              </div>
            </div>
            {currentUser.email === profileOfUser.email && (
              <div className="cover__picture__uploader">
                <label htmlFor="input__cover__picture">
                  <div className="flexor">
                    <CameraAltIcon
                      style={{ fontSize: "25px", marginTop: "3px" }}
                    />
                    <p>Edit Cover Photo</p>
                  </div>
                </label>

                <input
                  type="file"
                  id="input__cover__picture"
                  onChange={handleCoverUpload}
                />
              </div>
            )}
          </div>
        </div>
        <div className="profile__bottom__container" ref={refToEditBio}>
          <div className="userName">{userDetails?.userName}</div>
          <div className="userBio">{!openEditBio && userBio}</div>
          {currentUser.email === profileOfUser.email ? (
            <>
              <div className="edit__field">
                {!openEditBio ? (
                  <p
                    className="edit"
                    onClick={() => setOpenEditBio(!openEditBio)}
                  >
                    Edit
                  </p>
                ) : (
                  <div className="edit__userBio">
                    <TextField
                      multiline={true}
                      defaultValue={userBio}
                      fullWidth={true}
                      onChange={(e) => handleNewBio(e)}
                    />
                    <div className="characters__available">{charRemaining}</div>
                    <div className="edit__userBio__buttons">
                      <div className="public__field">
                        <PublicIcon />
                        <div style={{ marginLeft: "5px" }}>Public</div>
                      </div>
                      <button
                        className="update__bio__bottons show__button__background"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className={`update__bio__bottons ${
                          changeInitiated && "show__button__background"
                        } ${!changeInitiated && "button__disabled"}`}
                        style={{ marginLeft: "15px" }}
                        disabled={changeInitiated ? false : true}
                        onClick={handleBioUpdate}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="add__friend__container">
              <button
                className="add__friend__button"
                disabled={profileOfUser.email === "admin@gmail.com"}
                onClick={() => handleAddOrRemoveFriend(userIsFriend)}
              >
                {userIsFriend === "not_friend" ? (
                  <>
                    <PersonAddIcon style={{ color: "#f3f3f3" }} />
                    &nbsp; Add Friend
                  </>
                ) : userIsFriend === "isFriend" ? (
                  <>
                    <PersonAddDisabledIcon style={{ color: "#f3f3f3" }} />
                    &nbsp; Unfriend
                  </>
                ) : userIsFriend === "request_sent" ? (
                  <>
                    <PersonAddDisabledIcon style={{ color: "#f3f3f3" }} />
                    &nbsp; Cancel Request
                  </>
                ) : (
                  userIsFriend === "received_request" && (
                    <>
                      <PersonAddDisabledIcon style={{ color: "#f3f3f3" }} />
                      &nbsp; Confirm
                    </>
                  )
                )}
              </button>
              <button className="messanger__button">
                Messanger&nbsp;
                <SendRoundedIcon style={{ color: "#f3f3f3" }} />
              </button>
            </div>
          )}
          <div className="profile__button__container__footer">
            <div className="list__items__group">
              <div className="list__items">Posts</div>
              <div className="list__items">About</div>
              <div className="list__items">Friends</div>
              <div className="list__items hide__items">Photos</div>
              <div className="list__items hide__items">Story Archieve</div>
              <div className="list__items" style={{ marginRight: "15px" }}>
                More
                <ArrowDropDownIcon style={{ marginTop: "5px" }} />
              </div>
            </div>
            <div className="list__items list__button blue__button">
              <AddCircleOutlinedIcon style={{ marginRight: "3px" }} /> Add to
              Story
            </div>
            <div className="list__items list__button grey__button">
              <CreateOutlinedIcon
                style={{ marginRight: "3px", fontSize: "20px" }}
              />
              Edit Profile
            </div>
            <div className="list__items list__button more__button">
              <MoreHorizOutlinedIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="Profilepage__main__body__container">
        <div className="profile_page_sidebar_container">
          <ProfilePageSideContainer
            userBio={newBio}
            updateBio={updateBio}
            currentUser={currentUser}
          />
        </div>
        <div className="profile_page_post_container">
          <ProfilePagePostContainer
            profilePic={profilePic}
            profileOfUser={profileOfUser}
          />
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
