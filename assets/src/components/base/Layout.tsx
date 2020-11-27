import React from "react";
// import logo from './logo.svg';
// import { ReactComponent as Logo }
import { cssClasses } from "../../helpers/css";

import "./Layout.scss";

type LayoutProps = {
  children: React.ReactNode;
  isLanding: boolean
};

const Layout = ({ children, isLanding }: LayoutProps) => {
  const className = cssClasses({
    "Layout": true,
    "Layout--landing": isLanding
  });

  return (
    <div className={ className }>
      {children}
    </div>
  );
};

type LayoutContentProps = {
  children: React.ReactNode;
};

const LayoutContent = ({ children }: LayoutContentProps) => {
  return (<div className="Layout-content">{children}</div>);
};

type HeaderProps = {
  children: React.ReactNode;
  title: string;
};

const Header = ({ children, title }: HeaderProps) => {
  return (
    <header className="Layout-header">
      <LayoutContent>
        <h1 className="Layout-headerTitle">{title}</h1>

        {children}
      </LayoutContent>
    </header>
  );
};

type LandingProps = {
  children: React.ReactNode;
  title: string;
};

const Landing = ({ children, title }: LandingProps) => {
  return (
    <div className="Layout-landing">
      <header className="Layout-landingHeader">
        <h1>{title}</h1>
      </header>
      <LayoutContent>
        <img className="Layout-landingLogo" src="/lock-the-lock.svg" alt="Lock The Lock" />
        <main className="Layout-landingBody">
          {children}
        </main>
      </LayoutContent>
    </div>
  );
};

type BodyProps = {
  children: React.ReactNode;
};

const Body = ({ children }: BodyProps) => {
  return (
    <main className="Layout-body">
      <LayoutContent>
        {children}
      </LayoutContent>
    </main>
  );
};

type FooterProps = {
  children: React.ReactNode;
};

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="Layout-footer">
      <LayoutContent>
        {children}
      </LayoutContent>
    </footer>
  );
};

export { Header, Landing, Body, Footer };
export default Layout;
