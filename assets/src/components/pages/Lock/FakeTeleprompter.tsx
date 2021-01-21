import React from "react";

import Teleprompter, {
  Item as TeleprompterItem
} from "../../base/Teleprompter";
import {
  Strong
} from "../../base/Text";

export default () => {
  return (
    <Teleprompter itemsCount={3}>
      <TeleprompterItem>
        <Strong colorNumber={54}>john.doe</Strong> released the lock after <Strong>5 seconds</Strong>
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>john.doe</Strong> acquired the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> joined the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> left the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> left the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> left the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> left the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> left the lock
      </TeleprompterItem>
      <TeleprompterItem>
        <Strong>pepe</Strong> left the lock
      </TeleprompterItem>
    </Teleprompter>
  );
};
