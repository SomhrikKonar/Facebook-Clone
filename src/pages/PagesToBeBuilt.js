import React from "react";
import "../css/new_pages.css";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
function PagesToBeBuilt() {
  return (
    <div className="pages__to__be__built__container flex_content">
      <ErrorOutlineIcon
        style={{ height: "50%", width: "50%", color: "#3a3b3c" }}
      />
      <p className="to_be_built_msg">This page is yet to be build</p>
    </div>
  );
}

export default PagesToBeBuilt;
