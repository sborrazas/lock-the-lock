import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps
} from "react-router-dom";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Lock from "./pages/Lock";

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

const isValid = (lockId: string) => true;

type FallbackRouteParams = { lockId: string };

const FallbackRoute = ({ match, ...props }: RouteComponentProps<FallbackRouteParams>) => {
  // const { params } = match;
  const { params: { lockId } } = match;

  if (isValid(lockId)) {
    return (<Lock match={match} {...props}/>);
  }
  else {
    return (<NotFound />);
  }
};

const App = ({ name, backgroundColor, createLock }: Props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:lockId" component={FallbackRoute} />
      </Switch>
    </Router>
  );
};

export default connector(App);
