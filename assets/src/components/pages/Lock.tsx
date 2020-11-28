import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  RouteComponentProps
} from "react-router-dom";

import Layout from "./Layout";
import { Landing as LayoutLanding } from "../base/Layout";
import List, {
  Item as ListItem
} from "../base/List";
import {
  Strong
} from "../base/Text";
import Button from "../base/Button";
import Donut from "../base/Donut";
import Teleprompter from "../base/Teleprompter";

import { RootState } from "../../resources/reducer";
import { createLock } from "../../resources/locks/actions";

const connector = connect((state: RootState) => { return {}; }, { createLock });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & RouteComponentProps<{ lockId: string }> & {};

const users = [ // Hard-coded data for now
  { id: 1, colorNumber: 1, label: "aalice" },
  { id: 21, colorNumber: 39, label: "bbob" },
  { id: 35, colorNumber: 22, label: "mark" },
  { id: 54, colorNumber: 54, label: "john.doe" },
  { id: 52, colorNumber: 50, label: "pepe" },
  { id: 52, colorNumber: 8, label: "pepe" },
  { id: 52, colorNumber: 15, label: "pepe" }
];

const selectedId = 1;

const Home = ({ createLock, match: { params: { lockId } } }: Props) => {
  return (
    <Layout title={`Lock ${lockId}`}>
      <Donut items={users} selectedId={selectedId} />
      <Teleprompter>
      </Teleprompter>
    </Layout>
  );
};

export default connector(Home);
