import axios from "../axios";
import { storage } from "../firebase";
function handleDeleteUser(user, setDeleted) {
  const coverPictureRef = storage.ref().child(`Cover Pictures/${user}`);
  const profilePictureRef = storage.ref().child(`Profile Pictures/${user}`);

  getAllPost();

  async function getAllPost() {
    axios
      .get(`post/${user}`)
      .then((res) => {
        getPosts(res.data);
        axios
          .get(`user/${user}`)
          .then((res) => deleteFriedns(res.data[0]))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  function deleteFriedns(userDetails) {
    const friends = userDetails.friends;
    const friendReqSent = userDetails.friendReqSent;
    const friendReqReceived = userDetails.friendReqReceived;

    //removing me from others friend list
    friends?.map((friend) => {
      axios
        .put(`user/removeFriend`, {
          removeUser: user,
          userMail: friend.friendsEmail,
        })
        .catch((err) => console.log(err));
    });

    //removing my friend reqs from their friendReqReceived
    friendReqSent?.map((friend) => {
      axios
        .put(`user/removeFriendReq`, {
          receivedFrom: user,
          userMail: friend.sentTo,
          updateInMe: true,
        })
        .catch((err) => console.log(err));
    });

    //removimg the reqs sent to me from others
    friendReqReceived?.map((friend) => {
      axios
        .put(`user/cancelFriendReq`, {
          sentTo: user,
          user: friend.receivedFrom,
          updateInSender: false,
        })
        .catch((err) => console.log(err));
    });
  }

  function getPosts(posts) {
    posts?.map((post) => deletePostImages(post));
    if (coverPictureRef) coverPictureRef.delete();
    if (profilePictureRef) profilePictureRef.delete();
    axios
      .delete(`notification/delete/${user}`)
      .catch((err) => console.log(err));
    axios
      .delete(`user/delete/${user}`)
      .then(() => setDeleted(true))
      .catch((err) => console.log(err));
  }

  function deletePostImages(post) {
    post.postData?.map((data) => {
      const dataRef = storage
        .ref()
        .child(`Posts/${user}/${post._id}/${data.name}`);
      dataRef.delete();
    });

    axios
      .delete(`post/${post._id}/deletePost`)
      .then()
      .catch((err) => console.log(err));
  }

  console.log(user);
}
export default handleDeleteUser;
