import React, { useEffect, useState } from "react";
import Homepage from "./pages/Homepage";
import Profilepage from "./pages/Profilepage";
import FriendReqsPage from "./pages/FriendReqsPage";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInpage from "./pages/SignInpage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "./axios";
import Header from "./components/Header";
import UserContext from "./UserContext";
import PagesToBeBuilt from "./pages/PagesToBeBuilt";
import PostIdForSinglePostShow from "./PostIdContext";
import NotificationsPage from "./pages/NotificationsPage";
import CommentLengthContext from "./CommentLenContext";
import Pages from "./pages/Pages";
import { CircularProgress } from "@material-ui/core";
function App() {
  const [user] = useAuthState(auth);
  const [userDetails, setUserDetails] = useState();
  const [postId, setPostId] = useState(0);
  const [len, setLen] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (user !== null && !userDetails) {
      setTimeout(fetchData, 2000);
      function fetchData() {
        let detail = {};
        axios
          .get(`user/${user?.email}`)
          .then((res) => {
            detail = res.data[0];
            setUserDetails(res.data[0]);
            console.log("userDetails", res.data[0]);
          })
          .catch((err) => console.log(err));

        if (!userDetails) {
          setUserDetails(detail);
        }
      }
    }
  }, [user, userDetails]);

  function setPostIdForSinglePost(Id) {
    console.log("function working", Id);
    setPostId(Id);
  }

  function setCommentLength(l) {
    console.log("function working", l);
    setLen(l);
  }

  return (
    <div className="App">
      <UserContext.Provider value={userDetails}>
        <PostIdForSinglePostShow.Provider value={setPostIdForSinglePost}>
          <CommentLengthContext.Provider value={setCommentLength}>
            {user !== null ? (
              userDetails !== undefined ? (
                <Router>
                  <Header
                    userDetails={userDetails}
                    len={len}
                    setReload={setReload}
                    reload={reload}
                  />
                  <Switch>
                    <Route
                      path="/"
                      exact
                      render={() => (
                        <Homepage
                          userDetails={userDetails}
                          showSinglePostByID={postId}
                          reload={reload}
                        />
                      )}
                    />
                    <Route
                      path="/:userName/Profile"
                      render={() => <Profilepage currentUser={user} />}
                    />
                    <Route
                      path="/:userName/FriendReqs"
                      render={() => <FriendReqsPage currentUser={user} />}
                    />
                    <Route path="/videos" render={() => <PagesToBeBuilt />} />
                    <Route
                      path="/marketplace"
                      render={() => <PagesToBeBuilt />}
                    />
                    <Route
                      path="/notifications"
                      render={() => <NotificationsPage />}
                    />
                    <Route path="/page" render={() => <Pages />} />
                  </Switch>
                </Router>
              ) : (
                <div
                  className="show__loading__screen"
                  style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#00b2ff",
                  }}
                >
                  <CircularProgress
                    style={{
                      height: "80px",
                      width: "80px",
                      color: "#ff002ddb",
                    }}
                  />
                </div>
              )
            ) : (
              <SignInpage />
            )}
          </CommentLengthContext.Provider>
        </PostIdForSinglePostShow.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
