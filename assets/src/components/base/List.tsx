import React from "react";

import "./List.scss";

type InstructionProps = {
  children: React.ReactNode;
};

const List = ({ children }: InstructionProps) => {
  return (<ul className="List">{ children }</ul>);
};

type ItemProps = {
  children: React.ReactNode;
};

const Item = ({ children }: ItemProps) => {
  return (<li className="List-item">{ children }</li>);
};

type StrongProps = {
  children: React.ReactNode;
};

const Strong = ({ children }: StrongProps) => {
  return (<strong className="List-strong">{ children }</strong>);
};

export { Item, Strong };
export default List;
