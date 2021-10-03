import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../axios";
import "../css/notifications__page.css";
import UserContext from "../UserContext";
import Notice from "../components/Notice";
import { CircularProgress } from "@material-ui/core";
function NotificationsPage() {
  const userDetails = useContext(UserContext);
  const updateSeen = useLocation().data.updateSeen;

  const [notices, setNotices] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      await axios
        .get(`notification/getUserByMail/${userDetails?.email}`)
        .then((res) => {
          let Notices = res.data.notifications;
          setNotices(Notices);
          setLoading(false);
        });
    }
    fetchData();
    return () => {
      updateSeen();
    };
  }, [updateSeen, userDetails]);

  return (
    <div className="notifications__page__conatainer">
      {loading ? (
        <div className="show__loading">
          <CircularProgress
            style={{ color: "#bc1ff3", height: "50px", width: "50px" }}
          />
        </div>
      ) : (
        <>
          {notices?.map((notification) => (
            <Notice notice={notification} key={notification._id} />
          ))}
        </>
      )}
    </div>
  );
}

export default NotificationsPage;
