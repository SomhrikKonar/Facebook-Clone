import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../UserContext";
import "../css/profile__page__sidebar.css";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import SchoolIcon from "@material-ui/icons/School";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteIcon from "@material-ui/icons/Favorite";
import WorkIcon from "@material-ui/icons/Work";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import axios from "../axios";
import { useLocation } from "react-router-dom";
function ProfilePageSideContainer({ updateBio, userBio }) {
  const userDetails = useContext(UserContext);
  const location = useLocation();
  const profileOfUser = location.state.showProfileOfUser;
  const [showDetails, setShowDetails] = useState(false);
  const [edit, setEdit] = useState("");
  const [edited, setEdited] = useState(false);
  const [details, setDetails] = useState({
    work: { company: "", position: "" },
    primary_school: "",
    high_school: "",
    university: "",
    relationship: "",
    birth_place: "",
    current_place: "",
  });
  const btmDiv = useRef();
  const [originalDetails, setOriginalDetails] = useState();
  const [showLoading, setShowLoading] = useState();
  const [Err, setErr] = useState();
  useEffect(() => {
    axios
      .get(`user/${profileOfUser.email}`)
      .then((res) => {
        setOriginalDetails(res.data[0].details);
        setDetails(res.data[0].details);
      })
      .catch((err) => console.log(err));
  }, [profileOfUser.email, edited]);

  useEffect(() => {
    console.log(btmDiv.current);
    btmDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, [edit]);

  async function handleUpdateDetails() {
    setShowLoading(true);
    setEdit("");
    await axios
      .put(`user/${profileOfUser.email}/update/details`, {
        field: details,
      })
      .then(() => {
        setEdited(!edited);
        setShowLoading(false);
        setShowDetails(false);
      })
      .catch((err) => setErr(err));
  }

  return (
    <div className="sidebar__profile__parent">
      <div className="intro__container">
        <h3 className="intro__header">Intro</h3>
        <div className="intro__bio__container">
          <div className="bio"> {userBio}</div>
          {profileOfUser.email === userDetails?.email && (
            <div className="edit__intro__buttons" onClick={updateBio}>
              Edit Bio
            </div>
          )}
        </div>
        <div className="intro__details__container">
          <div className="social__details">
            {originalDetails?.work?.company && (
              <div className="detail__field flex__field">
                <WorkIcon
                  style={{
                    marginRight: "10px",
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                Works at {originalDetails?.work.company}
              </div>
            )}
            {originalDetails?.university && (
              <div className="detail__field flex__field">
                <SchoolIcon
                  style={{
                    marginRight: "10px",
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                {details?.work ? "Went to" : "Studied at"}&nbsp;
                {originalDetails?.university}
              </div>
            )}
            {originalDetails?.college && (
              <div className="detail__field flex__field">
                <SchoolIcon
                  style={{
                    marginRight: "10px",
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                {details?.university || details?.work
                  ? "Went to"
                  : "Studied at"}
                &nbsp;
                {originalDetails?.college}
              </div>
            )}
            {originalDetails?.high_school && (
              <div className="detail__field flex__field">
                <SchoolIcon
                  style={{
                    marginRight: "10px",
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                {details?.college ? "Went to" : "Studied at"}
                &nbsp;
                {originalDetails?.high_school}
              </div>
            )}
            {originalDetails?.primary_school && (
              <div className="detail__field flex__field">
                <SchoolIcon
                  style={{
                    marginRight: "10px",
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                {details?.high_school ? "Went to" : "Studied at"}
                &nbsp;
                {originalDetails?.primary_school}
              </div>
            )}
            {originalDetails?.current_place && (
              <div className="detail__field flex__field">
                <LocationOnIcon
                  style={{
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                &nbsp;&nbsp;Lives in&nbsp;
                {originalDetails?.current_place}
              </div>
            )}
            {originalDetails?.birth_place && (
              <div className="detail__field flex__field">
                <HomeIcon
                  style={{
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                &nbsp;&nbsp;Born in&nbsp;
                {originalDetails?.birth_place}
              </div>
            )}
            {originalDetails?.relationship && (
              <div className="detail__field flex__field">
                <FavoriteIcon
                  style={{
                    color: "#8c939d",
                    fontSize: "18px",
                  }}
                />
                &nbsp;&nbsp;
                {originalDetails?.relationship}
              </div>
            )}
          </div>
          {userDetails.email === profileOfUser.email && (
            <div
              className="edit__intro__buttons edit__details__button"
              onClick={() => setShowDetails(true)}
            >
              Edit Details
            </div>
          )}
          {showDetails && (
            <>
              <div
                className="background__layout"
                onClick={() => {
                  setShowDetails(false);
                  setEdit("");
                }}
              />
              {showLoading && (
                <>
                  <div className="loading__screen__details__update" />
                  <div className="loader">
                    <CircularProgress />
                  </div>
                </>
              )}
              <div className="details__updater__container">
                <div className="details__header">
                  Edit details
                  <div
                    style={{
                      float: "right",
                      borderRadius: "50%",
                      backgroundColor: "#4e4f50",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "5px",
                      marginTop: "-2px",
                    }}
                  >
                    <CloseIcon
                      onClick={() => {
                        setShowDetails(false);
                      }}
                      style={{
                        cursor: "pointer",
                        fontSize: "25px",
                        color: "#b0b3b6",
                      }}
                    />
                  </div>
                </div>
                <div className="details__description">
                  <h3 style={{ color: "#e4e6eb" }}>Customise your Intro</h3>
                  <p style={{ color: "#b0b3b8" }}>
                    Details that you select will be public and won't be posted
                    to News Feed.
                  </p>
                </div>
                <div className="err__msg">{Err}</div>
                <div className="details__fields">
                  <div className="field__work">
                    <h5>Work</h5>
                    <div className="add__field__data flex__field">
                      {originalDetails?.work.company ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            Works at {originalDetails?.work.company}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "work" ? setEdit("") : setEdit("work")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "work" ? setEdit("") : setEdit("work")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "work" ? setEdit("") : setEdit("work");
                              console.log(details);
                            }}
                          >
                            Add a workplace
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "work" && (
                      <div className="upload__data">
                        <TextField
                          label="Company"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              work: {
                                company: e.target.value,
                                position: details?.work.position,
                              },
                            });
                            console.log(details);
                          }}
                          value={details?.work?.company}
                        />
                        <TextField
                          label="Position"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              work: {
                                company: details.work.company,
                                position: e.target.value,
                              },
                            });
                            console.log(details);
                          }}
                          value={details?.work?.position}
                        />
                      </div>
                    )}
                  </div>
                  <div className="field__work">
                    <h5>Education</h5>
                    <div className="add__field__data flex__field">
                      {originalDetails?.primary_school ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            {details?.high_school ? "Went to" : "Studied at"}
                            &nbsp;
                            {originalDetails?.primary_school}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "primarySchool"
                                ? setEdit("")
                                : setEdit("primarySchool")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "primarySchool"
                                ? setEdit("")
                                : setEdit("primarySchool")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "primarySchool"
                                ? setEdit("")
                                : setEdit("primarySchool");
                            }}
                          >
                            Add a Primary School
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "primarySchool" && (
                      <div className="upload__data">
                        <TextField
                          label="Primary School"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              primary_school: e.target.value,
                            });
                            console.log(details);
                          }}
                          value={details.primary_school}
                        />
                      </div>
                    )}

                    <div
                      className="college"
                      ref={edit === "college" ? btmDiv : null}
                      style={{
                        display: `${edit === "college" ? "block" : "none"}`,
                      }}
                    />
                    <div
                      className="university"
                      ref={edit === "university" ? btmDiv : null}
                      style={{
                        display: `${edit === "university" ? "block" : "none"}`,
                      }}
                    />
                    <div className="add__field__data flex__field">
                      {originalDetails?.high_school ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            {details?.college ? "Went to" : "Studied at"}
                            &nbsp;
                            {originalDetails?.high_school}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "highSchool"
                                ? setEdit("")
                                : setEdit("highSchool")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "highSchool"
                                ? setEdit("")
                                : setEdit("highSchool")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "highSchool"
                                ? setEdit("")
                                : setEdit("highSchool");
                            }}
                          >
                            Add a High School
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "highSchool" && (
                      <div className="upload__data">
                        <TextField
                          label="High School"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              high_school: e.target.value,
                            });
                          }}
                          value={details.high_school}
                        />
                      </div>
                    )}

                    <div className="add__field__data flex__field">
                      {originalDetails?.college ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            {details?.university || details?.work
                              ? "Went to"
                              : "Studied at"}
                            &nbsp;
                            {originalDetails?.college}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "college"
                                ? setEdit("")
                                : setEdit("college")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "college"
                                ? setEdit("")
                                : setEdit("college")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "college"
                                ? setEdit("")
                                : setEdit("college");
                              console.log(details);
                            }}
                          >
                            Add a College
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "college" && (
                      <div className="upload__data">
                        <TextField
                          label="College"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              college: e.target.value,
                            });
                          }}
                          value={details.college}
                        />
                      </div>
                    )}

                    <div className="add__field__data flex__field">
                      {originalDetails?.university ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            {details?.work ? "Went to" : "Studied at"}
                            &nbsp;
                            {originalDetails?.university}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "university"
                                ? setEdit("")
                                : setEdit("university")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "university"
                                ? setEdit("")
                                : setEdit("university")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "university"
                                ? setEdit("")
                                : setEdit("university");
                            }}
                          >
                            Add a University
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "university" && (
                      <div className="upload__data">
                        <TextField
                          label="University"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              university: e.target.value,
                            });
                          }}
                          value={details.university}
                        />
                      </div>
                    )}
                  </div>
                  <div className="field__work">
                    <h5>Current town/city</h5>
                    <div className="add__field__data flex__field">
                      {originalDetails?.current_place ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            Lives in &nbsp;
                            {originalDetails?.current_place}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "currentTown/City"
                                ? setEdit("")
                                : setEdit("currentTown/City")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "currentTown/City"
                                ? setEdit("")
                                : setEdit("currentTown/City")
                            }
                          />

                          <p
                            onClick={() => {
                              edit === "currentTown/City"
                                ? setEdit("")
                                : setEdit("currentTown/City");
                            }}
                          >
                            Add current town/city
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "currentTown/City" && (
                      <div className="upload__data">
                        <TextField
                          label="Current Town/City"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              current_place: e.target.value,
                            });
                          }}
                          value={details.current_place}
                        />
                      </div>
                    )}
                    <div
                      className="currentTown/City"
                      ref={edit === "currentTown/City" ? btmDiv : null}
                      style={{
                        display: `${
                          edit === "currentTown/City" ? "block" : "none"
                        }`,
                      }}
                    />
                  </div>
                  <div className="field__work">
                    <h5>Home town</h5>
                    <div className="add__field__data flex__field">
                      {originalDetails?.birth_place ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            Born in &nbsp;
                            {originalDetails?.birth_place}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "homeTown"
                                ? setEdit("")
                                : setEdit("homeTown")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "homeTown"
                                ? setEdit("")
                                : setEdit("homeTown")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "homeTown"
                                ? setEdit("")
                                : setEdit("homeTown");
                            }}
                          >
                            Add home town
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "homeTown" && (
                      <div className="upload__data">
                        <TextField
                          label="Home town"
                          variant="filled"
                          style={{ width: "100%", marginBottom: "15px" }}
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              birth_place: e.target.value,
                            });
                          }}
                          value={details.birth_place}
                        />
                      </div>
                    )}
                    <div
                      className="homeTown"
                      ref={edit === "homeTown" ? btmDiv : null}
                      style={{
                        display: `${edit === "homeTown" ? "block" : "none"}`,
                      }}
                    />
                  </div>
                  <div className="field__work">
                    <h5>Relationship</h5>
                    <div className="add__field__data flex__field">
                      {originalDetails?.relationship ? (
                        <div className="edit__details__existing__field flex__field">
                          <div className="details__data">
                            {originalDetails?.relationship === "Single" ||
                            originalDetails?.relationship === "Is Married"
                              ? "Relationship status : "
                              : originalDetails?.relationship ===
                                  "In Relationship" && "Is"}
                            &nbsp;
                            {originalDetails?.relationship}
                          </div>
                          <EditIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "relationship"
                                ? setEdit("")
                                : setEdit("relationship")
                            }
                          />
                        </div>
                      ) : (
                        <>
                          <AddCircleOutlineOutlinedIcon
                            style={{
                              color: "#2e89ff",
                              fontSize: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              edit === "relationship"
                                ? setEdit("")
                                : setEdit("relationship")
                            }
                          />
                          <p
                            onClick={() => {
                              edit === "relationship"
                                ? setEdit("")
                                : setEdit("relationship");
                            }}
                          >
                            Add Relationship Status
                          </p>
                        </>
                      )}
                    </div>
                    {edit === "relationship" && (
                      <div className="upload__data__radio flex__field">
                        <div
                          className="input__field flex__field"
                          onClick={() => {
                            setDetails({
                              ...details,
                              relationship: "Single",
                            });
                          }}
                        >
                          <input
                            type="radio"
                            name="relationshipStat"
                            id="single"
                            value="Single"
                            defaultChecked={details.relationship === "Single"}
                          />
                           <label htmlFor="single">Single</label>
                        </div>
                        <div
                          className="input__field flex__field"
                          onClick={() => {
                            setDetails({
                              ...details,
                              relationship: "In Relationship",
                            });
                          }}
                        >
                          <input
                            type="radio"
                            name="relationshipStat"
                            id="in relationship"
                            // value="Single"
                            defaultChecked={
                              details.relationship === "In Relationship"
                            }
                          />
                           
                          <label htmlFor="in relationship">
                            In Relationship
                          </label>
                        </div>
                        <div
                          className="input__field flex__field"
                          onClick={() => {
                            setDetails({
                              ...details,
                              relationship: "Is Married",
                            });
                          }}
                        >
                          <input
                            type="radio"
                            name="relationshipStat"
                            id="Is married"
                            value="Is married"
                            defaultChecked={
                              details.relationship === "Is Married"
                            }
                          />
                            <label htmlFor="Is married">Is married</label>
                        </div>
                      </div>
                    )}
                    <div
                      className="relationship"
                      ref={edit === "relationship" ? btmDiv : null}
                      style={{
                        display: `${
                          edit === "relationship" ? "block" : "none"
                        }`,
                      }}
                    />
                  </div>
                </div>
                <div className="details__footer flex__field">
                  <div className="update__details">Update your information</div>
                  <div className="save__cancel__Button  flex__field">
                    <div
                      className="details__button cancel__button "
                      onClick={() => {
                        setDetails(originalDetails);
                        setShowDetails(false);
                      }}
                    >
                      Cancel
                    </div>
                    <div
                      className="details__button save__button"
                      onClick={handleUpdateDetails}
                    >
                      Save
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePageSideContainer;
