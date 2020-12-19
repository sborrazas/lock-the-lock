import React from "react";

import { cssClasses } from "../../helpers/css";

import "./Button.scss";

type ButtonProps = {
  children: React.ReactNode;
  cta?: boolean;
  onClick?: () => void
};

const Button = ({ children, cta = false, onClick }: ButtonProps) => {
  const className = cssClasses({
    "Button": true,
    "Button--cta": cta
  });

  if (onClick) {
    return (
      <div className={className} onClick={(e) => { e.preventDefault(); onClick(); }}>
        {children}
      </div>
    );
  }
  else {
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
};

export default Button;
