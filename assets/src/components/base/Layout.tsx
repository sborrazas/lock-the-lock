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

  return (<div className={className}>{children}</div>);
};

type ContentProps = {
  children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
  return (<div className="Layout-content">{children}</div>);
};

type HeaderProps = {
  children: React.ReactNode;
  isLanding: boolean;
};

const Header = ({ isLanding, children }: HeaderProps) => {
  const className = cssClasses({
    "Layout-header": true,
    "Layout-header--landing": isLanding
  });

  return (
    <div className={className}>
      {children}
    </div>
  );
};

type LandingProps = {
  children: React.ReactNode;
};

const Landing = ({ children }: LandingProps) => {
  return (
    <div className="Layout-landing">
      <img className="Layout-landingLogo" src="/lock-the-lock.svg" alt="Lock The Lock" />
      <main className="Layout-landingBody">
        {children}
      </main>
    </div>
  );
};

type BodyProps = {
  children: React.ReactNode;
  isLanding: boolean;
};

const Body = ({ isLanding, children }: BodyProps) => {
  return (
    <main className="Layout-body">
      <Content>
        <div className="Layout-innerBody">
          {children}
        </div>
      </Content>
    </main>
  );
};

type FooterProps = {
  children: React.ReactNode;
};

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="Layout-footer">
      <Content>
        {children}
      </Content>
    </footer>
  );
};

type SectionProps = {
  children: React.ReactNode;
};

const Section = ({ children }: SectionProps) => {
  return (
    <section className="Layout-section">
      {children}
    </section>
  );
};

type AsideProps = {
  children: React.ReactNode;
};

const Aside = ({ children }: AsideProps) => {
  return (
    <aside className="Layout-aside">
      {children}
    </aside>
  );
};

export { Header, Landing, Body, Footer, Content, Section, Aside };
export default Layout;
