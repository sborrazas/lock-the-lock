import React from "react";

import { cssClasses } from "../../helpers/css";

import "./Text.scss";

type StrongProps = {
  children: React.ReactNode;
  colorNumber?: number;
};

const Strong = ({ children, colorNumber }: StrongProps) => {
  const className = cssClasses({
    "Text-strong": true,
    [`Text-strong--color${colorNumber}`]: !! colorNumber
  });

  return (<strong className={className}>{children}</strong>);
};

type InlineImageProps = {
  src: string;
  alt: string;
};

const InlineImage = ({ src, alt }: InlineImageProps) => {
  return (<img className="Text-inlineImage" src={src} alt={alt} />);
};

type LinkProps = {
  title: string;
  children: React.ReactNode;
  href: string;
  external: boolean;
};

const Link = ({ title, children, href, external }: LinkProps) => {
  return (
    <a className="Text-link" title={title} href={href} target={external ? "_blank" : ""}>
      {children}
    </a>
  );
};

export { Strong, InlineImage, Link };
