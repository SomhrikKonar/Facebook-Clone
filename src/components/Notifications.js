import axios from "../axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import Notice from "./Notice";
import "../css/notification.css";
import { CircularProgress } from "@material-ui/core";
function Notifications({ updateSeen }) {
  const userDetails = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      axios
        .get(`notification/getUserByMail/${userDetails?.email}`)
        .then((res) => {
          setNotifications(res.data.notifications);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
    fetchData();

    return () => {
      updateSeen();
    };
  }, [userDetails?.email, updateSeen]);
  return (
    <div className="parent__notification__container">
      <div className="header">Notifications</div>
      {loading ? (
        <div className="show__loading__notification">
          <CircularProgress
            style={{ color: "#bc1ff3", height: "50px", width: "50px" }}
          />
        </div>
      ) : (
        <>
          {notifications?.length > 0 ? (
            notifications?.map((notice) => (
              <Notice notice={notice} key={notice._id} />
            ))
          ) : (
            <div className="no__notification">
              Sorry, no notifications to show
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notifications;
