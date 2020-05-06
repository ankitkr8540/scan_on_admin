import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Authenticated from "./Components/Authenticated";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        {/* <Authenticated> */}
        <Dashboard />
        {/* </Authenticated> */}
      </Route>
      <Route exact path="/login">
        <Authenticated nonAuthenticated={true}>
          <Login />
        </Authenticated>
      </Route>
      <Route path="*" render={() => "404 Not found"} />
    </Switch>
  );
}

export default App;
