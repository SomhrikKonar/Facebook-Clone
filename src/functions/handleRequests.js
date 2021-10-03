import axios from "../axios";
export default async function handleAddOrRemoveFriend(
  userIsFriend,
  profileOfUser,
  currentUser
) {
  console.log(userIsFriend);
  console.log(profileOfUser.email);
  console.log(currentUser.email);

  let Err = "";
  if (userIsFriend === "not_friend" || userIsFriend === "suggestions") {
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
      return "successfull";
    }
  } else if (userIsFriend === "friendReqReceived") {
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
      return "successfull";
    }
  } else if (userIsFriend === "friends") {
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
      return "successfull";
    }
  } else if (userIsFriend === "request_sent") {
    await axios
      .put(`user/removeFriendReq`, {
        receivedFrom: profileOfUser.email,
        userMail: currentUser.email,
        updateInMe: "true",
      })
      .then((res) => console.log(res))
      .catch((err) => (Err = err));
    await axios
      .put(`user/removeFriendReq`, {
        receivedFrom: profileOfUser.email,
        userMail: currentUser.email,
        updateInMe: "false",
      })
      .then((res) => console.log(res))
      .catch((err) => (Err = err));
    if (Err) {
      console.log(Err);
    } else {
      return "successfull";
    }
  } else if (userIsFriend === "friendReqSent") {
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
      return "successfull";
    }
  }
}
