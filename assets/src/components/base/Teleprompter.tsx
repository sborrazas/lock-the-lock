import React from "react";

import { cssClasses } from "../../helpers/css";

import "./Teleprompter.scss";

type TeleprompterProps = {
  children: React.ReactNode;
};

const Teleprompter = ({ children }: TeleprompterProps) => {
  return (
    <section className="Teleprompter">
      {children}
    </section>
  );
};

export default Teleprompter;
