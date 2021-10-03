import axios from "../axios";
function handleNotification(change, userDetails, len) {
  let friends, notice, updateCreator, postId, isFriend;
  fetchData();
  console.log("change", change);
  console.log("len", len);

  // getting user of friends
  async function fetchData() {
    await axios
      .get(`user/${userDetails.email}`)
      .then((res) => {
        friends = res.data[0].friends;
        decidingNotice();
      })
      .catch((err) => console.log(err));
  }

  function decidingNotice() {
    isFriend = friends.filter(
      (frnd) => frnd.friendsEmail === userDetails.email
    );
    //changes in collection post
    if (change.ns.coll === "posts") {
      postId = change.fullDocument._id;

      if (change.operationType === "insert") {
        notice = "created a new post.";
        // postId = change.fullDocument._id;
        updateNotification();
      } else if (change.operationType === "update") {
        //length of postreacts[]
        let index = change.fullDocument.postReacts.length - 1;

        let updatedField = change.updateDescription.updatedFields;
        console.log(updatedField);
        const pReact = `postReacts?.${index}`;
        // const pReactedBy = `postReacts.${index}.reactedBy`;
        // console.log("pReactedBy", pReactedBy);
        // const firstReact = updatedField?.postReacts[0];
        // console.log(
        //   "updatedField.postComments.length",
        //   updatedField.postComments.length
        // );
        if (
          updatedField?.postComments &&
          updatedField.postComments.length > len &&
          isFriend
        ) {
          console.log("commenting", len, updatedField?.postComments.length);
          notice = "commented on your post.";
          updateCreator = updatedField.postComments[0].commentedBy;
          updateNotification();
        } else if (updatedField[pReact]) {
          console.log("reacting");
          notice = "reacted on your post.";
          updateCreator = change.fullDocument.postReacts[index].reactedBy;
          updateNotification();
        } else if (updatedField?.postReacts) {
          console.log("reacting to 1st reaction");
          notice = "reacted on your post.";
          updateCreator = change.fullDocument.postReacts[index].reactedBy;
          updateNotification();
        }
      }
    } else if (change.ns.coll === "users") {
      console.log("change", change);
      //chnages in collection users

      let index = change.fullDocument.friendReqReceived.length - 1;

      //when it is the first req user received
      let reqReceivedfield =
        change.updateDescription.updatedFields.friendReqReceived;

      //when it is not the first req user received
      let prop = `friendReqReceived.${index}`;
      let notFirstReqReceived = change.updateDescription.updatedFields[prop];

      // let reqSentfield=change.updateDescription.updatedField.friendReqSent;

      let reqAcceptedfield = change.updateDescription.updatedFields.friends;
      let firstReqAccpt = "friends.1";
      let firstAcctReqField =
        change.updateDescription.updatedFields[firstReqAccpt];

      console.log(
        "reqReceivedfield",
        reqReceivedfield,
        "notFirstReqReceived",
        notFirstReqReceived,
        "reqAcceptedfield",
        reqAcceptedfield,
        "firstAcctReqField",
        firstAcctReqField
      );

      let response;
      // checking if the user document changed is my account and if i sent any frnd req
      if (change.fullDocument.email !== userDetails.email) {
        if (reqReceivedfield[0]) {
          response = {
            creatorEmail: reqReceivedfield[0].receivedFrom,
            notice: "sent you friend request",
          };
        } else if (notFirstReqReceived) {
          response = {
            creatorEmail: notFirstReqReceived.receivedFrom,
            notice: "sent you friend request",
          };
        }

        if (response && userDetails.email === response.creatorEmail) {
          axios
            .put(`notification/addNotification/${change.fullDocument.email}`, {
              notificationDetails: response,
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      } else if (
        change.fullDocument.email === userDetails.email &&
        (reqReceivedfield || notFirstReqReceived)
      ) {
        console.log("change", change);
        console.log("reqAcceptedfield", reqAcceptedfield);
        console.log("reqReceivedfield", reqReceivedfield);
        console.log("firstAcctReqField", firstAcctReqField);
        response = {
          creatorEmail: change.fullDocument.email,
          notice: "accepted your friend request",
        };
        if (firstAcctReqField) {
          console.log(firstAcctReqField);
          axios
            .put(
              `notification/addNotification/${firstAcctReqField.friendsEmail}`,
              { notificationDetails: response }
            )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        } else if (reqAcceptedfield) {
          axios
            .put(
              `notification/addNotification/${reqAcceptedfield[0].friendsEmail}`,
              { notificationDetails: response }
            )
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      }
    }
  }

  //updating notififcation
  function updateNotification() {
    console.log("updatedBY", updateCreator);

    //allowing further work if im not the post creator
    change.operationType === "insert"
      ? userDetails.email === change.fullDocument.postCreator && testUpdate()
      : change.operationType === "update" &&
        userDetails.email !== change.fullDocument.postCreator &&
        userDetails.email === updateCreator &&
        testUpdate2();
  }

  function testUpdate() {
    let putRes = {
      creatorEmail: userDetails.email,
      notice: notice,
      postId: postId,
    };
    friends.map((friend) =>
      axios
        .put(`notification/addNotification/${friend.friendsEmail}`, {
          notificationDetails: putRes,
        })
        .then((res) => console.log("res working", res))
        .catch((err) => console.log(err))
    );
  }

  function testUpdate2() {
    let putRes = {
      creatorEmail: userDetails.email,
      notice: notice,
      postId: postId,
    };

    console.log("entering", change);
    axios
      .put(`notification/addNotification/${change.fullDocument.postCreator}`, {
        notificationDetails: putRes,
      })
      .then((res) => console.log("res", res))
      .catch((err) => console.log(err));
  }
}
export default handleNotification;
