import React from "react";
import { MouseEvent } from "react";

import { computeArcs } from "../../helpers/donut";
import { cssClasses } from "../../helpers/css";

import "./Donut.scss";

type DonutItem = {
  id: number;
  colorNumber: number;
  label: string;
};

type DonutProps = {
  label: string;
  items: Array<DonutItem>;
  selectedId: number | null;
  onClick: () => void;
};

const RADIUS = 30;
const PERIMETER = Math.PI * 2 * RADIUS;

class Donut extends React.Component<DonutProps> {
  constructor(props: DonutProps) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  render() {
    const { items, selectedId, label } = this.props;
    const total = items.length;
    const offset = PERIMETER * (total - 1) / total;
    const selectedIndex = selectedId ? items.findIndex(i => i.id === selectedId) : -1;
    const selectedItem = selectedId ? items.find(i => i.id === selectedId) : null;
    const arcs = computeArcs(items, selectedIndex, RADIUS);
    const globalRotate = selectedIndex === -1 ? 0 : (360 * (selectedIndex - 0.5) / total);
    const innerCircleClasses: Record<string, boolean> = {
      "Donut-innerCircle": true,
      "Donut-innerCircle--selected": !! selectedItem
    };

    if (selectedItem) {
      innerCircleClasses[`Donut-innerCircle--color${selectedItem.colorNumber}`] = true;
    }

    return (
      <div className="Donut">
        <svg className="Donut-svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin">
          <g transform={`rotate(${globalRotate}, 50, 50)translate(50, 50)`}>
            {
              arcs.map(({ item: { id, colorNumber }, rotate }, index) => {
                const className = cssClasses({
                  "Donut-arc": true,
                  [`Donut-arc--color${colorNumber}`]: true
                });

                const strokeWidth = index === selectedIndex ? 21 : 16;

                return (
                    <circle key={id.toString()}
                            className={className}
                            cx="0"
                            cy="0"
                            r={RADIUS}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={PERIMETER}
                            strokeDashoffset={offset}
                            transform={`rotate(${rotate}, 0, 0)`} />
                );
              })
            }
            {
              arcs.map(({ arc, item: { colorNumber } }, index) => {
                return (
                  <path id={`arc-${index}`}
                        key={index.toString()}
                        d={arc}
                        fill="transparent" />
                );
              })
            }
            {
              arcs.map(({ item: { id, label } }, index) => {
                return (
                  <text key={id.toString()} className="Donut-label" textAnchor="middle">
                    <textPath alignmentBaseline="middle" xlinkHref={`#arc-${index}`} startOffset="50%">
                      {label}
                    </textPath>
                  </text>
                );
              })
            }
          </g>
        </svg>
        <div className={cssClasses(innerCircleClasses)}>
          <div className="Donut-innerCircleOverlay" onClick={this._onClick}>
            <span className="Donut-innerCircleLabel">{label}</span>
          </div>
        </div>
      </div>
    );
  }
  _onClick(ev: MouseEvent<HTMLDivElement>) {
    const { onClick } = this.props;

    ev.preventDefault();

    onClick();
  }
};
          // <g transform="translate(50, 50)">
          //   <circle className={cssClasses(innerCircleClasses)} cx="0" cy="0" r="20" />
          //   <g x="-20" y="-20" width="40" height="40" fill="red">
          //     <textArea className="Donut-centerLabel"
          //           x="0"
          //           y="0"
          //           dominantBaseline="middle"
          //           textAnchor="middle">
          //       {label}
          //     </textArea>
          //   </g>
          //   <circle className="Donut-innerCircleOverlay" cx="0" cy="0" r="20" onClick={this._onClick} />
          // </g>
          // <rect x="-20" y="-20" width="40" height="40" fill="red" />

export default Donut;
