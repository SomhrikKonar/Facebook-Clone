import axios from "axios";

const instance = axios.create({
  baseURL: "https://facebook-clone-project3.herokuapp.com/",
  // baseURL: "http://localhost:5000",
});

export default instance;
