import React from "react";
import "./Loader.css"; 

const Loader = () => {
  return (
    <div className="dental-loader-container">
      <div className="dental-loader">
        <div className="tooth tooth-1"></div>
        <div className="tooth tooth-2"></div>
        <div className="tooth tooth-3"></div>
        <div className="tooth tooth-4"></div>
      </div>
      <p className="loader-text">Creating your perfect smile...</p>
    </div>
  );
};

export default Loader;