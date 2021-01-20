import React from "react";

import Layout, {
  Header as LayoutHeader,
  Body as LayoutBody,
  Footer as LayoutFooter
} from "../base/Layout";
import MainHeader, {
  Nav as MainHeaderNav,
  NavItem as MainHeaderNavItem
} from "../base/MainHeader";
import {
  InlineImage,
  Link
} from "../base/Text";
import Button from "../base/Button";
import Badge from "../base/Badge";

type Props = {
  title: string;
  children: React.ReactNode;
  isLanding?: boolean;
  modal?: React.ReactNode;
  onModalClose?: () => void;
};

export default ({ title, children, modal, onModalClose, isLanding = false }: Props) => {
  return (
    <Layout isLanding={isLanding} modal={modal} onModalClose={onModalClose}>
      <LayoutHeader isLanding={isLanding}>
        <MainHeader logoSrc="/lock-the-lock.svg" title={title}>
          <MainHeaderNav>
            <MainHeaderNavItem>
              <Button to="/create">
                Create new lock
              </Button>
            </MainHeaderNavItem>
            <MainHeaderNavItem>
              <Badge onClick={() => alert("hello")} colorNumber={(0 | Math.random() * 60) + 1}>sborrazas</Badge>
            </MainHeaderNavItem>
          </MainHeaderNav>
        </MainHeader>
      </LayoutHeader>
      <LayoutBody isLanding={isLanding}>{children}</LayoutBody>
      <LayoutFooter>
        Made by
        <Link title="Form & Function" href="https://fandf.io/" external>
          <InlineImage src="/images/fandf.png" alt="Form & Function" />
        </Link>
        with
        <Link title="Elixir" href="https://elixir-lang.org/" external>
          <InlineImage src="/images/elixir.png" alt="Elixir" />
        </Link>
      </LayoutFooter>
    </Layout>
  );
};
