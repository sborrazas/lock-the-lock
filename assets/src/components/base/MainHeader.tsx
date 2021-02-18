import React from "react";
import { Link } from "react-router-dom";

import { cssClasses } from "../../helpers/css";

import { Content as LayoutContent } from "./Layout";

import "./MainHeader.scss";

type MainHeaderProps = {
  title: string;
  logoSrc: string;
  children: React.ReactNode;
};

const MainHeader = ({ title, logoSrc, children }: MainHeaderProps) => {
  return (
    <header className="MainHeader">
      <LayoutContent>
        <div className="MainHeader-innerContent">
          <Link to="/" className="MainHeader-item MainHeader-item--logo">
            <img className="MainHeader-logo" src={logoSrc} alt={title} />
          </Link>
          <h1 className="MainHeader-item MainHeader-item--title">{title}</h1>

          {children}
        </div>
      </LayoutContent>
    </header>
  );
};

type NavProps = {
  children: React.ReactNode;
};

const Nav = ({ children }: NavProps) => {
  return (
    <nav className="MainHeader-item MainHeader-nav">
      {children}
    </nav>
  );
};

type NavItemProps = {
  children: React.ReactNode;
  separate?: boolean;
};

const NavItem = ({ children, separate }: NavItemProps) => {
  const className = cssClasses({
    "MainHeader-navItem": true,
    "MainHeader-navItem--separate": !!separate
  });

  return (
    <div className={className}>
      {children}
    </div>
  );
};

export { Nav, NavItem };
export default MainHeader;
