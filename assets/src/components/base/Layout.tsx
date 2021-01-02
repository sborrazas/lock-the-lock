import React from "react";
import { MouseEvent } from "react";
import { cssClasses } from "../../helpers/css";
import { isInside } from "../../helpers/dom";

import "./Layout.scss";

type LayoutProps = {
  children: React.ReactNode;
  isLanding: boolean;
  modal?: React.ReactNode;
  onModalClose?: () => void;
};

class Layout extends React.Component<LayoutProps, string, string> {
  private modalRef = React.createRef<HTMLDivElement>();

  constructor(props: LayoutProps) {
    super(props);

    this._onModalClose = this._onModalClose.bind(this);
  }

  render() {
    const { children, isLanding, modal } = this.props;
    const className = cssClasses({
      "Layout": true,
      "Layout--landing": isLanding,
      "Layout--withModal": !! modal
    });
    const overlayClassName = cssClasses({
      "Layout-modalOverlay": true,
      "Layout-modalOverlay--active": !! modal
    });

    return (
      <div className={className}>
        {
          modal &&
            (
              <div className={overlayClassName} onClick={this._onModalClose}>
                <section ref={this.modalRef} className="Layout-modal">{modal}</section>
              </div>
            )
        }
      {children}
      </div>
    );
  }

  _onModalClose(e: MouseEvent<HTMLDivElement>) {
    const { onModalClose } = this.props;
    const currentModal = this.modalRef.current;
    const relatedTarget = e.target as HTMLElement;

    if (onModalClose && currentModal && relatedTarget) {
      if (!isInside(relatedTarget, currentModal)) {
        onModalClose();
      }
    }
  }
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
