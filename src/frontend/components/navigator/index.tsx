import { faCar, faColumns, faRoad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { getData } from "../../modules/auth";
import "./navigator.scss";

export default () => {
  const { user } = getData();
  return (
    <div className="navigator-root">
      <div className="header">
        <img
          className="profile-image"
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
          alt="Discord user profile"
        ></img>
        <div className="data">
          <p>{user.username}</p>
          <i>id: {user.id}</i>
        </div>
      </div>
      <div className="links">
        <Link to="/dashboard" className="link">
          <button>
            <div className="icon">
              <FontAwesomeIcon icon={faColumns}></FontAwesomeIcon>
            </div>
            <p>Panel</p>
          </button>
        </Link>
        <Link to="/tracks" className="link">
          <button>
            <div className="icon">
              <FontAwesomeIcon icon={faRoad}></FontAwesomeIcon>
            </div>
            <p>Tracks</p>
          </button>
        </Link>
        <Link to="/dashboard" className="link">
          <button>
            <div className="icon">
              <FontAwesomeIcon icon={faCar}></FontAwesomeIcon>
            </div>
            <p>Cars</p>
          </button>
        </Link>
      </div>
    </div>
  );
};
