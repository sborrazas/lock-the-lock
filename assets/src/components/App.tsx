import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  Switch,
  Route,
  RouteComponentProps
} from "react-router-dom";
import { ConnectedRouter, ConnectedRouterProps } from "connected-react-router";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import NewLock from "./pages/NewLock";
import Lock from "./pages/Lock";

import { RootState } from "../resources/reducer";

const connector = connect((state: RootState) => {
  return {};
}, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & ConnectedRouterProps & {
};

const isValid = (lockId: string) => true;

type FallbackRouteParams = { lockId: string };

const FallbackRoute = ({ match, ...props }: RouteComponentProps<FallbackRouteParams>) => {
  const { params: { lockId } } = match;

  if (isValid(lockId)) {
    return (<Lock match={match} {...props} />);
  }
  else {
    return (<NotFound />);
  }
};

const App = ({ history }: Props) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create" component={NewLock} />
        <Route exact path="/:lockId" component={FallbackRoute} />
      </Switch>
    </ConnectedRouter>
  );
};

export default connector(App);
