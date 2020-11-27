import React from "react";

import { cssClasses } from "../../helpers/css";

import "./Badge.scss";

type BadgeProps = {
  children: React.ReactNode;
  colorNumber: number;
  onClick: () => void;
};

const Badge = ({ colorNumber, children, onClick }: BadgeProps) => {
  const colorClassName = `Badge-label--color${colorNumber}`;
  const labelClassName = cssClasses({
    "Badge-label": true,
    [colorClassName]: true
  });

  return (
    <span className="Badge" onClick={(e) => { e.preventDefault(); onClick(); }}>
      <span className={labelClassName}></span>
      {children}
    </span>
  );
};

export default Badge;
