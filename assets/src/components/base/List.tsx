import React from "react";

import "./List.scss";

type ListProps = {
  children: React.ReactNode;
};

const List = ({ children }: ListProps) => {
  return (<ul className="List">{children}</ul>);
};

type ItemProps = {
  children: React.ReactNode;
};

const Item = ({ children }: ItemProps) => {
  return (<li className="List-item">{children}</li>);
};

export { Item };
export default List;
