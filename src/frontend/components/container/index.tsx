import { useState } from "react";
import "./container.scss";
import Nav from "../navigator";

export default (props) => {
  const portrait = window.matchMedia("(orientation:portrait)");
  const [isPhone, setIsPhone] = useState(portrait.matches);
  portrait.onchange = (e: MediaQueryListEvent) => {
    const query = e.target as MediaQueryList;
    setIsPhone(query.matches);
  };
  if (isPhone) {
    return (
      <div className="acm-container">
        <div className="acm-top"></div>
        <div className="acm-left"></div>
        <div className="acm-body"></div>
      </div>
    );
  }
  return (
    <div className="acm-container">
      <div className="acm-top"></div>
      <div className="acm-left">
        <Nav />
      </div>
      <div className="acm-body">{props.children}</div>
    </div>
  );
};
