import React, { useRef, useState, useEffect } from "react";
import axios from "../axios";
import CancelIcon from "@material-ui/icons/Cancel";
import "../css/create__post.css";
import { Avatar } from "@material-ui/core";
import PublicIcon from "@material-ui/icons/Public";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PeopleIcon from "@material-ui/icons/People";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import PeopleAltTwoToneIcon from "@material-ui/icons/PeopleAltTwoTone";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { storage } from "../firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

function CreatePostModal({ closePostCreation, forceUpdate, userDetails }) {
  const [postDesc, setPostDesc] = useState("");
  const [upload, setUpload] = useState([]);
  const videoRef = useRef([]);
  const [playVideo, setPlayVideo] = useState({ index: 0, play: false });
  const [largeImg, setLargeImg] = useState(false);
  const [selectAudience, setSelectAudience] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState("Public");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [type, setType] = useState("");
  const storageRef = storage.ref();
  const [initiateUpload, setInitiateUpload] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalByte, setTotalByte] = useState(0);
  const [totalProgress, setTotalProgress] = useState([
    {
      index: 0,
      progress: 0,
    },
  ]);
  const [metadata, setMetadata] = useState();

  // ------handle checking input files------
  function checkInputFileType(e, TypeOf) {
    const fileList = e.target.files;
    let filesData = [];
    let files = [];
    let Tbyte = 0;
    setLargeImg(false);
    setType(TypeOf);
    setMetadata({ contentType: fileList[0].type });
    //changing filelist items to array elements
    for (let i = 0; i < fileList.length; i++) {
      const posOfSlash = fileList[i].type.indexOf("/");
      Tbyte = Tbyte + fileList[i].size;

      console.log(totalByte + fileList[i].size);
      if (fileList[i].type.substr(0, posOfSlash) === TypeOf) {
        filesData.push(fileList[i]);
        files.push(URL.createObjectURL(fileList[i]));
      }
    }
    setTotalByte(Tbyte);

    // chceking the dimensions of the first element

    if (TypeOf === "image") {
      let img = new Image();
      files.map((image, index) => {
        if (index === 0) {
          img.src = files[index];
          img.onload = () => {
            console.log(img.height, img.width);
            img.height > img.width && setLargeImg(true);
          };
        }
        return largeImg;
      });
    }
    setUpload(files);
    setUploadFiles(filesData);
  }

  const setReq = upload.length > 0 ? false : true;

  useEffect(() => {
    console.log(playVideo);
    console.log(videoRef);
    function fetch() {
      videoRef.current.map((item, index) =>
        index !== playVideo.index
          ? videoRef.current[index]?.pause()
          : playVideo.play
          ? PLAY()
          : PAUSE()
      );
    }
    function PAUSE() {
      console.log("pause");
      videoRef.current[playVideo.index]?.pause();
    }
    function PLAY() {
      console.log("play");
      videoRef.current[playVideo.index]?.play();
    }
    fetch();
  }, [playVideo]);

  //handle video preview

  function handlePlay(index) {
    setPlayVideo({ index: index, play: videoRef.current[index].paused });
  }

  // ------ handle post creation ------

  async function handlePostCreation() {
    setInitiateUpload(true);
    await axios
      .post("post/add", {
        postCreator: userDetails.email,
        userName: userDetails.userName,
        postDescription: postDesc,
        visibility: selectedAudience,
      })
      .then((res) => {
        if (type === "") {
          setInitiateUpload(false);
          closePostCreation();
          forceUpdate();
        } else {
          uploadPostImagesInStorage(res.data._id);
        }
      })
      .catch((err) => console.log(err));
  }

  //------handle post image upload in storage------
  let downloadUrls = [];
  async function uploadPostImagesInStorage(_id) {
    const postRef = storageRef.child(`Posts/${userDetails.email}/${_id}`);
    // const metadata={
    //   contentType:
    // }
    uploadFiles.forEach((img, index) => {
      const imgRef = postRef.child(`${img.name}`);
      const uploadTask = imgRef.put(img);
      uploadTask.on(
        "state_changed",
        function progress(snapshot) {
          let prg = totalProgress;
          prg[index] = snapshot.bytesTransferred;
          setTotalProgress(prg);
          let tprg = 0;
          prg.map((item) => (tprg = tprg + item));
          setUploadProgress((tprg / totalByte) * 100);
        },
        function error(err) {
          console.log(err);
        },
        function complete() {
          handleGettingImageDownloadUrl(imgRef, _id, img.name);
        }
      );
    });
  }

  //------getting the post image download url------

  async function handleGettingImageDownloadUrl(imgRef, _id, imgName) {
    imgRef.updateMetadata(metadata).catch((err) => console.log(err));
    await imgRef
      .getDownloadURL()
      .then((res) => {
        console.log(res);
        downloadUrls.push({ url: res, name: imgName });
      })
      .catch((errr) => console.log(errr));
    handleUploadImgDownloadUrl(_id, imgName);
  }

  //------uploading img download urls in server-----

  async function handleUploadImgDownloadUrl(_id, imgName) {
    await axios
      .put(`post/${_id}/updatePostImage`, {
        data: downloadUrls,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    if (downloadUrls.length === uploadFiles.length) {
      setInitiateUpload(false);
      closePostCreation();
      forceUpdate();
    }
  }

  return (
    <div>
      <div
        className="overlay__background"
        onClick={() => !initiateUpload && closePostCreation()}
      />
      <div
        className="post__modal"
        style={{ maxHeight: `${selectAudience ? "400px" : "500px"}` }}
      >
        {!selectAudience ? (
          <>
            <div className="post__modal__top">
              <div
                className="post__modal__header"
                style={{ marginLeft: "0px" }}
              >
                Create post
              </div>
              <div className="cancel__logo" onClick={closePostCreation}>
                <CancelIcon style={{ fontSize: "40px", marginRight: "10px" }} />
              </div>
            </div>
            <div className="post__modal__form ">
              <div className="post__modal__form__header _flex">
                <div className="form__avatar">
                  <Avatar
                    src={userDetails?.profilePicture}
                    style={{ fontSize: "40px" }}
                  />
                </div>
                <div className="modal__header__right">
                  <div className="modal__user">{userDetails?.userName}</div>
                  <div className="post__visibility _flex">
                    <div
                      className="_flex post__visibility__child "
                      onClick={() => setSelectAudience(true)}
                    >
                      <div className="public__logo">
                        <PublicIcon
                          style={{
                            fontSize: "15px",
                            marginTop: "1px",
                            marginRight: "3px",
                          }}
                        />
                      </div>
                      <div
                        className="visibility"
                        style={{
                          marginTop: "-2px",
                        }}
                      >
                        {selectedAudience}
                      </div>
                      <div className="down__arrow">
                        <ArrowDropDownIcon
                          style={{
                            fontSize: "20px",
                            marginTop: "3px",
                            marginLeft: "-1px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form
                className="create__post__form__component"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePostCreation();
                }}
              >
                <div className="post__contents">
                  <div className="post__description _flex">
                    <textarea
                      style={{ cursor: "text" }}
                      required={setReq}
                      onChange={(e) => setPostDesc(e.target.value)}
                      type="text"
                      placeholder={`What's on your mind, ${userDetails?.userName.substr(
                        0,
                        userDetails?.userName.indexOf(" ")
                      )}?`}
                    />
                  </div>
                  <div
                    className={`${
                      upload.length === 0 && "hidden__container"
                    } file__container _flex grid__container ${
                      upload.length > 2 &&
                      !largeImg &&
                      type !== "video" &&
                      "set__template__row"
                    } ${largeImg && upload.length <= 3 && "set__row__auto"} ${
                      largeImg && upload.length > 3 && "set_max_grid"
                    }`}
                  >
                    {upload.map((item, index) =>
                      index <= 3 ? (
                        <div
                          key={index}
                          className="image__container"
                          style={{
                            gridArea: `${
                              upload.length > 2 && index === 0
                                ? largeImg
                                  ? `1/1/${
                                      upload.length <= 4 ? upload.length : 4
                                    }/2`
                                  : `1/1/2/${
                                      upload.length <= 4 ? upload.length : 4
                                    }`
                                : largeImg
                                ? `${index}/2/${index + 1}/3`
                                : `2/${index}/3/${index + 1}`
                            }`,
                            height: `${
                              (upload.length > 2 ||
                                (upload.length >= 2 && largeImg)) &&
                              "100%"
                            }`,
                          }}
                        >
                          {type === "image" ? (
                            <img
                              src={item}
                              alt="preview"
                              width="100%"
                              height="100%"
                              style={{ objectFit: "cover" }}
                              key={index}
                            />
                          ) : (
                            type === "video" && (
                              <div className="video__container">
                                <video
                                  ref={(e) => (videoRef.current[index] = e)}
                                  src={item}
                                  width="100%"
                                  height="100%"
                                  style={{ objectFit: "cover" }}
                                  controls
                                />
                                <div
                                  className="video__overlay"
                                  onClick={() => handlePlay(index)}
                                />
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div
                          className="image__container__extras"
                          style={{
                            height: "100%",
                            width: "100%",
                            zIndex: "100",
                            backgroundColor: "#111",
                            opacity: "0.8",
                            gridArea: `${largeImg ? `3/2/4/3` : `2/3/3/4`}`,
                          }}
                        >
                          +{upload.length - 4}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="upload__and__submit">
                  <div className="upload__file__field _flex">
                    <div className="upload__header">Add to your post</div>

                    <div
                      className="upload__button__container _flex"
                      style={{ display: `` }}
                    >
                      <label htmlFor="upload__image__folder">
                        <PhotoLibraryIcon
                          style={{ color: "#45bd62", marginTop: "3px" }}
                        />
                      </label>
                      <input
                        onChange={(e) => checkInputFileType(e, "image")}
                        id="upload__image__folder"
                        className="input__files"
                        type="file"
                        accept="image/*"
                        multiple
                      />
                    </div>
                    <div
                      className="upload__button__container _flex"
                      style={{ padding: "1px 4px" }}
                    >
                      <label htmlFor="upload__video__folder">
                        <PlayArrowIcon
                          style={{
                            color: "#6023dc",
                            marginTop: "3px",
                            fontSize: "30px",
                          }}
                        />
                      </label>
                      <input
                        onChange={(e) => checkInputFileType(e, "video")}
                        id="upload__video__folder"
                        className="input__files"
                        type="file"
                        accept="video/*"
                        multiple
                      />
                    </div>
                  </div>

                  <div className="post__button__container _flex">
                    <button className="post__button" type="submit">
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="top__container__audience__selection">
              <div
                className="back__logo"
                onClick={() => setSelectAudience(false)}
              >
                <div className="back__container">
                  <ArrowBackIcon style={{ fontSize: "30px" }} />
                </div>
              </div>
              <div
                className="audience__container__header"
                style={{ marginLeft: "0px" }}
              >
                Select audience
              </div>
            </div>
            <div className="bottom__contaienr__audience__selection">
              <div className="description__audience__container">
                <h3 style={{ fontSize: "18px" }}>Who can see your post ?</h3>
                <p style={{ fontSize: "14px", marginTop: "3px" }}>
                  Your post will appear in News Feed, on your profile and in
                  search results
                </p>
              </div>
              <div className="audience__options">
                <ul>
                  <li
                    className={`audience__opt ${
                      selectedAudience === "Public"
                        ? "List_is_active"
                        : "List_is_inactive"
                    }`}
                    onClick={() => {
                      setSelectedAudience("Public");
                      setSelectAudience(false);
                    }}
                  >
                    <div
                      className="audience__logo__container"
                      style={{
                        backgroundColor: `${
                          selectedAudience === "Public" ? "#3b4550" : "#3a3b3c"
                        }`,
                      }}
                    >
                      <PublicIcon style={{ fontSize: "30px" }} />
                    </div>
                    <div className="audience__body__container">
                      <h4>Public</h4>
                      <p>Anyone on or off Facebook</p>
                    </div>
                    <input
                      type="radio"
                      style={{ height: "20px", width: "20px" }}
                      checked={selectedAudience === "Public" && true}
                    ></input>
                  </li>

                  <li
                    className={`audience__opt ${
                      selectedAudience === "Friends"
                        ? "List_is_active"
                        : "List_is_inactive"
                    }`}
                    onClick={() => {
                      setSelectedAudience("Friends");
                      setSelectAudience(false);
                    }}
                  >
                    <div
                      className="audience__logo__container"
                      style={{
                        backgroundColor: `${
                          selectedAudience === "Friends" ? "#3b4550" : "#3a3b3c"
                        }`,
                      }}
                    >
                      <PeopleIcon style={{ fontSize: "30px" }} />
                    </div>
                    <div className="audience__body__container">
                      <h4>Friends</h4>
                      <p>Your friends on Facebook</p>
                    </div>
                    <input
                      type="radio"
                      style={{ height: "20px", width: "20px" }}
                      checked={selectedAudience === "Friends" && true}
                    ></input>
                  </li>

                  <li
                    className={`audience__opt ${
                      selectedAudience === "friends__except"
                        ? "List_is_active"
                        : "List_is_inactive"
                    }`}
                  >
                    <div
                      className="audience__logo__container"
                      style={{
                        backgroundColor: `${
                          selectedAudience === "friends__except"
                            ? "#3b4550"
                            : "#3a3b3c"
                        }`,
                      }}
                    >
                      <PeopleAltTwoToneIcon style={{ fontSize: "30px" }} />
                    </div>
                    <div className="audience__body__container">
                      <h4>Friends except....</h4>
                      <p>Don't show to some friends</p>
                    </div>
                    <ChevronRightIcon />
                  </li>

                  <li
                    className={`audience__opt ${
                      selectedAudience === "friends__specefic"
                        ? "List_is_active"
                        : "List_is_inactive"
                    }`}
                  >
                    <div
                      className="audience__logo__container"
                      style={{
                        backgroundColor: `${
                          selectedAudience === "friends__specefic"
                            ? "#3b4550"
                            : "#3a3b3c"
                        }`,
                      }}
                    >
                      <PersonIcon style={{ fontSize: "30px" }} />
                    </div>
                    <div className="audience__body__container">
                      <h4>Specific friends</h4>
                      <p>Only show to some friends</p>
                    </div>
                    <ChevronRightIcon />
                  </li>

                  <li
                    className={`audience__opt ${
                      selectedAudience === "Only me"
                        ? "List_is_active"
                        : "List_is_inactive"
                    }`}
                    onClick={() => {
                      setSelectedAudience("Only me");
                      setSelectAudience(false);
                    }}
                  >
                    <div
                      className="audience__logo__container"
                      style={{
                        backgroundColor: `${
                          selectedAudience === "Only me" ? "#3b4550" : "#3a3b3c"
                        }`,
                      }}
                    >
                      <LockIcon style={{ fontSize: "30px" }} />
                    </div>
                    <div className="audience__body__container">
                      <h4>Only me</h4>
                    </div>
                    <input
                      type="radio"
                      style={{ height: "20px", width: "20px" }}
                      checked={selectedAudience === "Only me" && true}
                    ></input>
                  </li>

                  <li
                    className={`audience__opt ${
                      selectedAudience === "custom"
                        ? "List_is_active"
                        : "List_is_inactive"
                    }`}
                  >
                    <div
                      className="audience__logo__container"
                      style={{
                        backgroundColor: `${
                          selectedAudience === "custom" ? "#3b4550" : "#3a3b3c"
                        }`,
                      }}
                    >
                      <SettingsIcon style={{ fontSize: "30px" }} />
                    </div>
                    <div className="audience__body__container">
                      <h4>Custom</h4>
                      <p>Include and exclude friends and lists</p>
                    </div>
                    <ChevronRightIcon />
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
        {initiateUpload && (
          <div className="video__upload__loader__container">
            <CircularProgress
              variant={uploadProgress < 100 ? "determinate" : "indeterminate"}
              color="secondary"
              style={{ height: "60px", width: "60px" }}
              value={uploadProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePostModal;
