import React from "react";
import { MouseEvent } from "react";

import { cssClasses } from "../../helpers/css";

import "./Lock.scss";

type LockItem = {
  id: number;
  colorNumber: number;
  label: string;
};

type LockProps = {
  label: string;
  items: Array<LockItem>;
  selectedId: number | null;
  onClick: () => void;
  lockUrl: string;
};

class Lock extends React.Component<LockProps> {
  constructor(props: LockProps) {
    super(props);

    this._onClick = this._onClick.bind(this);
    this._onCopyUrlClick = this._onCopyUrlClick.bind(this);
  }

  render() {
    const { items, selectedId, label } = this.props;
    const selectedItem = selectedId ? items.find(i => i.id === selectedId) : null;
    const topPathClasses: Record<string, boolean> = {
      "Lock-topPath": true,
      "Lock-topPath--locked": !!selectedItem
    };
    const bottomPathClasses: Record<string, boolean> = {
      "Lock-bottomPath": true
    };

    if (selectedItem) {
      topPathClasses[`Lock-topPath--color${selectedItem.colorNumber}`] = true;
      bottomPathClasses[`Lock-bottomPath--color${selectedItem.colorNumber}`] = true;
    }

    return (
      <div className="Lock">
        <svg className="Lock-svg"
             height="100%"
             viewBox="0 0 97 97"
             width="100%">

          <g className="Lock-pathGroup" fill="none">
            <path className={cssClasses(topPathClasses)} d="M68,36.6104651 L68,28.5 C68,16.1162791 60.8837209,7 48.5,7 C36.1162791,7 29,16.1162791 29,28.5 L29,36.6104651" strokeWidth="14" strokeLinecap="round"></path>
            <path className={cssClasses(bottomPathClasses)} d="M74.8366013,36 L22.5620915,36 C15.4705882,36.6078431 10,42.4836601 10,49.7777778 L10,82.8039216 C10,90.503268 16.1797386,96.6830065 23.879085,96.6830065 L73.620915,96.6830065 C81.3202614,96.6830065 87.5,90.503268 87.5,82.8039216 L87.5,49.7777778 C87.5,42.4836601 81.9281046,36.6078431 74.8366013,36 Z M54.7777778,78.3464052 C54.9803922,79.3594771 54.2712418,80.2712418 53.2581699,80.2712418 L44.0392157,80.2712418 C43.0261438,80.2712418 42.3169935,79.3594771 42.5196078,78.3464052 L45.5588235,66.3921569 C43.0261438,65.2777778 41.2026144,62.745098 41.2026144,59.7058824 C41.2026144,55.6535948 44.5457516,52.3104575 48.5980392,52.3104575 C52.6503268,52.3104575 55.9934641,55.6535948 55.9934641,59.7058824 C55.9934641,62.6437908 54.1699346,65.1764706 51.6372549,66.3921569 L54.7777778,78.3464052 Z"></path>
          </g>
        </svg>
        <nav className="Lock-nav">
          <span className="Lock-navItem">
            <span className="Lock-label" onClick={this._onClick}>
              {label}
            </span>
          </span>
          <span className="Lock-navItem">
            <span className="Lock-share" onClick={this._onCopyUrlClick}>
              Copy Lock URL
            </span>
          </span>
        </nav>
        <ul className="Lock-users">
          {
            items.map(({ id, colorNumber, label }) => {
              const usersUserClassNames: Record<string, boolean> = {
                "Lock-usersUser": true,
                "Lock-usersUser--selected": id === selectedId,
                [`Lock-usersUser--color${colorNumber}`]: true
              };

              return (
                <li className={cssClasses(usersUserClassNames)} key={id}>{label}</li>
              );
            })
          }
        </ul>
      </div>
    );
  }
  _onClick(ev: MouseEvent<HTMLSpanElement>) {
    const { onClick } = this.props;

    ev.preventDefault();

    onClick();
  }
  _onCopyUrlClick(ev: MouseEvent<HTMLSpanElement>) {
    const { lockUrl } = this.props;

    navigator.clipboard.writeText(lockUrl);
  }

};

export default Lock;
