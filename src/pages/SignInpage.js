import React, { useState } from "react";
import "../css/signinpage.css";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Signuppage from "../pages/Signuppage";
import { auth } from "../firebase";
function SignInpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignInPage, setShowSignInPage] = useState(true);

  function handleShowSignPage() {
    setShowSignInPage(!showSignInPage);
  }
  async function handleSignin() {
    await auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => setError(error.code));
  }
  return (
    <div className="container">
      <div className="flex__container flex__column__container signinpage__container ">
        <div className="left__container">
          <div className="fb__header">facebook</div>
          <div className="fb__paragraph">
            Facebook helps you connect and share with the people in your life
          </div>
        </div>
        <div className="right__container">
          <div className="signin__form">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignin();
              }}
            >
              <div className="outlined-input">
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                  label="Email"
                  variant="outlined"
                />
              </div>
              <div className="outlined-input">
                <TextField
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                  value={password}
                  label="Password"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {password && !showPassword ? (
                          <div
                            className="visibility__button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <VisibilityIcon />
                          </div>
                        ) : (
                          password && (
                            <div
                              className="visibility__button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <VisibilityOffIcon />
                            </div>
                          )
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="error__message">
                {error.slice(5, error.length)}
              </div>
              <div className="signin__button__container">
                <button className="signin__button" type="submit">
                  Log in
                </button>
              </div>
              <div className="no__bottom__border signup__button__container">
                <button
                  className="signup__button"
                  type="button"
                  onClick={handleShowSignPage}
                >
                  Create New Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {!showSignInPage && (
        <Signuppage handleShowSignPage={handleShowSignPage} />
      )}
    </div>
  );
}

export default SignInpage;
