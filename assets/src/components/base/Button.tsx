import React from "react";
import { Link } from "react-router-dom";

import { cssClasses } from "../../helpers/css";

import "./Button.scss";

type ButtonProps = {
  children: React.ReactNode;
  cta?: boolean;
  onClick?: () => void;
  to?: string;
};

const Button = ({ children, cta = false, to, onClick }: ButtonProps) => {
  const className = cssClasses({
    "Button": true,
    "Button--cta": cta
  });

  if (to) {
    return (<Link className={className} to={to}>{children}</Link>);
  }
  else if (onClick) {
    return (
      <div className={className} onClick={(e) => { e.preventDefault(); onClick(); }}>
        {children}
      </div>
    );
  }
  else {
    return (<button className={className}>{children}</button>);
  }
};

export default Button;
