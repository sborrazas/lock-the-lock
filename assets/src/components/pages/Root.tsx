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

type User = {
  username: string;
  colorNumber: number;
};

type Props = {
  title: string;
  children: React.ReactNode;
  isLanding?: boolean;
  modal?: React.ReactNode;
  onModalClose?: () => void;
  user?: User;
};

export default ({ title, children, modal, onModalClose, isLanding = false, user }: Props) => {
  let userNavItem;

  if (user) {
    userNavItem = (
      <MainHeaderNavItem>
        <Badge onClick={() => alert("hello")} colorNumber={user.colorNumber}>{user.username}</Badge>
      </MainHeaderNavItem>
    );
  }

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
            {userNavItem}
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
