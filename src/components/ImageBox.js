import React, { useState } from "react";
import "../css/image_box.css";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CancelIcon from "@material-ui/icons/Cancel";
import CircularProgress from "@material-ui/core/CircularProgress";
function ImageBox({ images, closeShowImages }) {
  const [index, setIndex] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  function handleIndex(action) {
    if (action === "back") {
      index - 1 >= 0 && setIndex(index - 1);
      index - 1 >= 0 && setShowLoading(true);
    }
    if (action === "forward") {
      index + 1 < images.length && setIndex(index + 1);
      index + 1 < images.length && setShowLoading(true);
    }
  }
  return (
    <div className="image__box__container flex__container__image__box">
      {showLoading && (
        <>
          <div className="background__loader" />
          <div className="loader__container">
            <CircularProgress />
          </div>
        </>
      )}
      <div
        className="close__button flex__container__image__box"
        onClick={closeShowImages}
      >
        <CancelIcon style={{ fontSize: "35px" }} />
      </div>
      <div
        className="arrow__container"
        onClick={() => {
          handleIndex("back");
        }}
      >
        <ArrowBackIosIcon style={{ marginLeft: "5px" }} />
      </div>
      <div className="contain__images">
        <img
          src={images[index].url}
          onLoad={() => setShowLoading(false)}
          height="auto"
          width="100%"
          alt="image__showcase"
        />
      </div>
      <div
        className="arrow__container"
        onClick={() => {
          handleIndex("forward");
        }}
      >
        <ArrowForwardIosIcon />
      </div>
    </div>
  );
}

export default ImageBox;
