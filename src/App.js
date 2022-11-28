import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import Login from "./Login";
import Home from "./views/Home";
import Scan from "./views/Scan";
import Download from "./views/Download";
import Upload from "./views/Upload";
import { getAuthentication } from "./utils/auth";
import ProvideAuth from "./auth/ProvideAuth";

function App() {
  return (
    <>
      <ProvideAuth>
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/download">
              <Download />
            </Route>
            <Route path="/scan">
              <Scan />
            </Route>
            <Route path="/upload">
              <Upload />
            </Route>
            <PrivateRoute path="/">
              <Home />
            </PrivateRoute>
          </Switch>
        </Router>
      </ProvideAuth>
    </>
  );
}

function PrivateRoute({ children, ...rest }) {
  console.log(getAuthentication());
  const hasAuthenticated = getAuthentication() === "1";
  return (
    <Route
      {...rest}
      render={({ location }) =>
        hasAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export default App;
