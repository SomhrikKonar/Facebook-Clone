import React, { useEffect, useState } from "react";
import handleDeleteUser from "../functions/handleDeleteUser";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import "../css/delete__user.css";
import { auth, emailAuth } from "../firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneIcon from "@material-ui/icons/Done";

function DeleteUser({ setShowDelete }) {
  //   const userDetails = useContext(UserContext);
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [del, setDel] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (deleted) {
      setTimeout(handleDelete, 3000);
    }
    function handleDelete() {
      auth.currentUser.delete();
    }
  }, [deleted]);

  function reauthenticate() {
    if (email && password) {
      const credential = emailAuth.credential(email, password);
      user
        .reauthenticateWithCredential(credential)
        .then((res) => {
          handleDeleteUser(email, setDeleted);
          setDel(true);
          setErr("");
        })
        .catch(() => {
          setErr("Please check your credentials");
        });
    } else {
      setErr("Error- Blank Credential");
    }
  }

  return (
    <>
      <div className="background__overlay__delete" />
      <div className="delete__user__container">
        <div className="delete__header">
          <div className="delete__title">DELETE</div>
          <div className="close__icon" onClick={() => setShowDelete(false)}>
            <CancelRoundedIcon />
          </div>
        </div>
        <div className="delete__bottom__container">
          <div className="disclaimer">
            By clicking DELETE you are agreeing to delete your account
            permanantly.
            <br></br>
            <br></br>
            Enter the following details :
          </div>
          <form
            className="delete__profile__form"
            onSubmit={(e) => {
              e.preventDefault();
              reauthenticate();
            }}
          >
            <div className="email__field">
              <div className="labels">
                <label htmlFor="email">Email :</label>
              </div>
              <input
                className="email__input__field"
                id="email"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password__field">
              <div className="labels">
                <label htmlFor="password">Password :</label>
              </div>
              <input
                className="password__input__field"
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="err__message">{err}</div>
            <button className="delete__action__button" type="submit">
              DELETE
            </button>
          </form>
        </div>
        {del && (
          <div className="deleting__overlay">
            {deleted ? (
              <DoneIcon color="secondary" style={{ fontSize: "40px" }} />
            ) : (
              <CircularProgress />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DeleteUser;
