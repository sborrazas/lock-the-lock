import React from "react";

import Layout, {
  Header as LayoutHeader,
  Footer as LayoutFooter
} from "../base/Layout";
import {
  InlineImage,
  Link
} from "../base/Text";

type Props = {
  children: React.ReactNode;
  isLanding: boolean;
};

export default ({ children, isLanding }: Props) => {
  return (
    <Layout isLanding={ isLanding }>
      {
        !isLanding &&
          <LayoutHeader title="Lock The Lock">aa</LayoutHeader>
      }
      {children}
      <LayoutFooter>
        Made by
        <Link href="https://fandf.io/" external>
          <InlineImage src="/images/fandf.png" alt="Form & Function" />
        </Link>
        with
        <Link href="https://elixir-lang.org/" external>
          <InlineImage src="/images/elixir.png" alt="Elixir" />
        </Link>
      </LayoutFooter>
    </Layout>
  );
};
