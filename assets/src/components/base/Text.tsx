import React from "react";

import "./Text.scss";

type StrongProps = {
  children: React.ReactNode;
};

const Strong = ({ children }: StrongProps) => {
  return (<strong className="Text-strong">{children}</strong>);
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
