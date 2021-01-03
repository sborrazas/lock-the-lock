import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./components/base/index.scss";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import createStore, { history } from "./store";

import { fetchToken } from "./resources/token/actions";
import { ActionTypes } from "./resources/actions";

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById("root")
);

store.dispatch<ActionTypes>(fetchToken());

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
