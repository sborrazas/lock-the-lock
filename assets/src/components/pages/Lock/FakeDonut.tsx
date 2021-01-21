import React from "react";

import Donut from "../../base/Donut";

const users = [
  { id: 1, colorNumber: 1, label: "aalice" },
  { id: 2, colorNumber: 39, label: "bbob" },
  { id: 3, colorNumber: 22, label: "mark" },
  { id: 4, colorNumber: 54, label: "john.doe" },
  { id: 5, colorNumber: 50, label: "pepe" },
  { id: 6, colorNumber: 8, label: "pepe" },
  { id: 7, colorNumber: 15, label: "pepe" }
];

const selectedId = 4;

export default () => {
  return (
    <Donut items={users} selectedId={selectedId} />
  );
};
