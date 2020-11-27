import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

import "./App.scss";
import { RootState } from "../resources/reducer";
import { locks } from "../resources/selectors";
import { createLock } from "../resources/locks/actions";

const connector = connect((state: RootState) => {
  return {
    name: locks.selectLock(state)
  };
}, { createLock });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  backgroundColor: string
};

const App = ({ name, backgroundColor, createLock }: Props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default connector(App);
