import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../css/homepage.css";
import MainComponent from "../components/MainComponent";
import Contacts from "../components/Contacts";
import axios from "../axios";
function Homepage({ userDetails, showSinglePostByID, reload }) {
  const [post, setPost] = useState();
  useEffect(() => {
    console.log("useEffect", showSinglePostByID);
    function fetchData() {
      console.log("fetching data");
      axios
        .get(`post/getPostById/${showSinglePostByID}`)
        .then((res) => {
          setPost(res.data[0]);
        })
        .catch((err) => console.log(err));
    }
    if (showSinglePostByID !== undefined) {
      fetchData();
    } else {
      setPost(undefined);
    }
  }, [showSinglePostByID]);

  return (
    <div className="Homepage">
      <div className="Homepage__body">
        <Sidebar userDetails={userDetails} />
        <MainComponent
          userDetails={userDetails}
          singlePost={post}
          reload={reload}
        />
        <Contacts />
      </div>
    </div>
  );
}

export default Homepage;
