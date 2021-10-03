import React from "react";
import { Avatar } from "@material-ui/core";
import covid19_logo from "../images/covid19information.png";
import events_logo from "../images/events.png";
import friends_logo from "../images/friends.png";
import groups_logo from "../images/groups.png";
import marketplace_logo from "../images/marketplace.png";
import memories_logo from "../images/memories.png";
import pages_logo from "../images/pages.png";
import saved_logo from "../images/saved.png";
import watch_logo from "../images/watch.png";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../css/sidebar.css";
import { Link } from "react-router-dom";

function Sidebar({ userDetails }) {
  return (
    <div className="sidebar__container">
      <ul className="sidebar__list">
        <Link
          to={{
            pathname: `/${userDetails?.userName}/Profile`,
            state: { showProfileOfUser: userDetails },
          }}
          style={{ textDecoration: "none" }}
        >
          <li className="sidebar__list__item">
            <div className="list__logo user__avatar">
              <Avatar src={userDetails.profilePicture} />
            </div>
            <div className="list__title" style={{ color: "#e4e6eb" }}>
              {userDetails?.userName}
            </div>
          </li>
        </Link>
        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={covid19_logo} alt="covid19_logo" />
          </div>
          <div className="list__title">COVID-19 Information Center</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={friends_logo} alt="friends_logo" />
          </div>
          <div className="list__title">Friends</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={groups_logo} alt="groups_logo" />
          </div>
          <div className="list__title">Groups</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={marketplace_logo} alt="marketplace_logo" />
          </div>
          <div className="list__title">Marketplace</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={watch_logo} alt="watch_logo" />
          </div>
          <div className="list__title">Watch</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={events_logo} alt="events_logo" />
          </div>
          <div className="list__title">Events</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={memories_logo} alt="memories_logo" />
          </div>
          <div className="list__title">Memories</div>
        </li>

        <li className="sidebar__list__item">
          <div className="list__logo">
            <img height="30px" src={saved_logo} alt="saved_logo" />
          </div>
          <div className="list__title">Saved</div>
        </li>
        <Link to="/page" style={{ textDecoration: "none", color: "#e4e6eb" }}>
          <li className="sidebar__list__item">
            <div className="list__logo">
              <img height="30px" src={pages_logo} alt="pages_logo" />
            </div>
            <div className="list__title">Pages</div>
          </li>
        </Link>
        <li className="sidebar__list__item">
          <div className="list__logo ">
            <div className="see__more__button ">
              <ExpandMoreIcon />
            </div>
          </div>
          <div className="list__title">See more</div>
        </li>
        <hr></hr>
      </ul>
    </div>
  );
}

export default Sidebar;
