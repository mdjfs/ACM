import ReactDOM from "react-dom";
import "./index.scss";
import ACMRouter from "./pages/router";

function render() {
  ReactDOM.render(<ACMRouter />, document.getElementById("root"));
}

const session = sessionStorage.getItem("session");
if (!session) {
  fetch("/discord-auth").then(async (response) => {
    if (response.status === 200) {
      const json = await response.json();
      sessionStorage.setItem("session", JSON.stringify(json));
    }
    render();
  });
} else {
  render();
}
