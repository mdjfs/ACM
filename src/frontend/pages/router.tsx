import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./home";
import Panel from "./panel";
import Tracks from "./track";

export default function ACMRouter() {
  const isLogged = !!sessionStorage.getItem("session");
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {isLogged ? <Redirect to="/dashboard" /> : <Home />}
        </Route>
        {isLogged && (
          <Route exact path="/dashboard">
            <Panel />
          </Route>
        )}
        {isLogged && (
          <Route exact path="/tracks">
            <Tracks />
          </Route>
        )}

        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}
