import React, { useEffect, useState } from "react";
import "../css/signuppage.css";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { InputAdornment, Radio } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import axios from "../axios";
import { auth } from "../firebase";

function Signuppage({ handleShowSignPage }) {
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [showVerticalNav, setShowVerticalNav] = useState("");
  const [listDay, setListDay] = useState([]);
  const [listYears, setListYears] = useState([]);
  const [gender, setGender] = useState("female");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const today = new Date();
    setDay(today.getDate());
    setMonth(today?.getMonth());
    setYear(today?.getFullYear());
  }, []);

  useEffect(() => {
    let days = [];
    if (days.length === 0) {
      for (let i = 1; i < 32; i++) {
        days.push(i);
      }
      setListDay(days);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    let years = [];
    if (years.length === 0) {
      for (let i = today?.getFullYear(); i >= 1905; i--) {
        years.push(i);
      }
      setListYears(years);
    }
  }, []);

  async function handleSignup() {
    console.log("name:", firstName + lastName);
    console.log("email:", email);
    console.log("password:", password);
    console.log("dob:", day, "/", months[month], "/", year);
    console.log("gender:", gender);

    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(() =>
        axios
          .post("user/add", {
            userName: firstName.trim() + " " + lastName.trim(),
            email: email,
            dob: day + "/" + months[month] + "/" + year,
            gender: gender,
          })
          .then((res) => addInNotification(res))
          .catch((err) => console.log)
      )
      .catch((err) => console.log(err));
  }

  async function addInNotification() {
    await axios
      .post(`notification/addUser/${email}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div
        className="translucent__background"
        onClick={() => setShowVerticalNav("")}
      />
      <div className="signuppage__container">
        <div className="container__header">
          <div className="signup__header__left">
            <h1 className="title">Sign Up</h1>
            <p className="below__title">It's quick and easy.</p>
          </div>
          <div
            className="container__header__right"
            onClick={handleShowSignPage}
          >
            <CloseIcon style={{ fontSize: "35px" }} />
          </div>
        </div>
        <div className="container__form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <div className="field__name">
              <div className="first__name">
                <TextField
                  required
                  size="small"
                  className="name__textfield"
                  label="First name"
                  variant="outlined"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="last__name">
                <TextField
                  required
                  size="small"
                  className="name__textfield"
                  label="Last name"
                  variant="outlined"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="field__email">
              <TextField
                required
                size="small"
                className="email__textfield"
                label="Email address"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field__password">
              <TextField
                required
                size="small"
                className="password__textfield"
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {password && !showPassword ? (
                        <div
                          className="visibility__button"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <VisibilityIcon />
                        </div>
                      ) : (
                        <div
                          className="visibility__button"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <VisibilityOffIcon />
                        </div>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="field__birthday">
              <p className="birthday__header">Date of birthday</p>
              <div className="date__picker">
                <div
                  className="date__selector"
                  onClick={() =>
                    showVerticalNav !== "day"
                      ? setShowVerticalNav("day")
                      : setShowVerticalNav("")
                  }
                >
                  <p>{day}</p>
                  <span className="arrow__logo">
                    <ExpandMoreIcon style={{ paddingTop: "6px" }} />
                  </span>
                  {showVerticalNav === "day" && (
                    <div className="list__container">
                      {listDay.map((day) => {
                        return (
                          <p
                            className="list__item"
                            onClick={() => setDay(day)}
                            key={day}
                          >
                            {day}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div
                  className="date__selector selector__month"
                  onClick={() =>
                    showVerticalNav !== "month"
                      ? setShowVerticalNav("month")
                      : setShowVerticalNav("")
                  }
                >
                  <p>{months[month]}</p>
                  <span className="arrow__logo">
                    <ExpandMoreIcon style={{ paddingTop: "6px" }} />
                  </span>
                  {showVerticalNav === "month" && (
                    <div className="list__container">
                      {months.map((month, index) => {
                        return (
                          <p
                            className="list__item"
                            onClick={() => setMonth(index)}
                            key={month}
                          >
                            {month}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div
                  className="date__selector"
                  onClick={() =>
                    showVerticalNav !== "year"
                      ? setShowVerticalNav("year")
                      : setShowVerticalNav("")
                  }
                >
                  <p>{year}</p>
                  <span className="arrow__logo">
                    <ExpandMoreIcon style={{ paddingTop: "6px" }} />
                  </span>
                  {showVerticalNav === "year" && (
                    <div className="list__container">
                      {listYears.map((year) => {
                        return (
                          <p
                            className="list__item"
                            onClick={() => setYear(year)}
                            key={year}
                          >
                            {year}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="field__gender">
              <p className="gender__header">Gender</p>
              <div className="gender__picker">
                <div
                  className="gender__selector"
                  onClick={() => setGender("female")}
                >
                  <p className="gender">Female</p>
                  <Radio
                    size={"small"}
                    checked={gender === "female"}
                    style={{
                      color: `${gender !== "female" ? "grey" : "#0075ff"}`,
                    }}
                  />
                </div>
                <div
                  className="gender__selector"
                  onClick={() => setGender("male")}
                >
                  <p className="gender">Male</p>
                  <Radio
                    size={"small"}
                    checked={gender === "male"}
                    style={{
                      color: `${gender !== "male" ? "grey" : "#0075ff"}`,
                    }}
                  />
                </div>
                <div
                  className="gender__selector"
                  onClick={() => setGender("Custom")}
                >
                  <p className="gender">Custom</p>
                  <Radio
                    size={"small"}
                    checked={gender === "Custom"}
                    style={{
                      color: `${gender !== "Custom" ? "grey" : "#0075ff"}`,
                    }}
                  />
                </div>
              </div>
            </div>
            <p className="field__para">
              By clicking Sign Up, you agree to our&nbsp;
              <span className="para__links">Terms</span>,&nbsp;
              <span className="para__links">Data policy</span>&nbsp;and&nbsp;
              <span className="para__links">Cookie policy</span>. You may
              receive SMS notifications from us and can opt out at any time.
            </p>
            <div className="signup__button__container">
              <button
                className="signuppage__signup__button"
                type="submit
              "
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signuppage;
