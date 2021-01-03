import React from "react";

import "./Teleprompter.scss";

type TeleprompterProps = {
  itemsCount: number;
  children: React.ReactNode;
};

type TeleprompterState = {
  pendingItemsCount: number;
  interval?: number;
};

class Teleprompter extends React.Component<TeleprompterProps, TeleprompterState> {
  constructor(props: TeleprompterProps) {
    super(props);

    this.state = { pendingItemsCount: 0 };
  }

  render() {
    const { children } = this.props;

    return (
      <div className="Teleprompter">
        <div className="Teleprompter-shadowPre" />
        <ul className="Teleprompter-list">
          {children}
        </ul>
        <div className="Teleprompter-shadowPost" />
      </div>
    );
  }

  componentDidUpdate({ itemsCount: prevCount }: TeleprompterProps) {
    const { itemsCount } = this.props;

    if (itemsCount > prevCount) {
      const { pendingItemsCount } = this.state;
      const newPendingItemsCount = pendingItemsCount + itemsCount - prevCount;
      const newState: TeleprompterState = { pendingItemsCount: newPendingItemsCount };

      if (pendingItemsCount === 0) {
        newState.interval = window.setInterval(() => {
          const { pendingItemsCount, interval } = this.state;
          const newPendingItemsCount = pendingItemsCount - 0.1;

          if (newPendingItemsCount === 0) {
            window.clearInterval(interval);
          }

          this.setState({ pendingItemsCount: newPendingItemsCount });
        }, 1000);
      }

      this.setState(newState);
    }
  }
};

type ItemProps = {
  children: React.ReactNode;
};

const Item = ({ children }: ItemProps) => {
  return (
    <li className="Teleprompter-item">
      {children}
    </li>
  );
};

export default Teleprompter;
export { Item };
