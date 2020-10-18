import React from "react";
import { connect, ConnectedProps } from "react-redux";
// import logo from './logo.svg';
import './App.scss';

import { RootState } from "./resources/reducer";
import { locks } from "./resources/selectors";
import { createLock } from "./resources/locks/actions";

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
    <div className="App" style={{ backgroundColor }}>
      <header className="App-header">
        <p>
          { name }
        </p>
        <a
          onClick={(e) => { e.preventDefault(); createLock("blah"); }}
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default connector(App);
