import React from "react";

import { computeArcs } from "../../helpers/donut";
import { cssClasses } from "../../helpers/css";

import "./Donut.scss";

type DonutItem = {
  id: number;
  colorNumber: number;
  label: string;
};

type DonutProps = {
  items: Array<DonutItem>;
  selectedId: number | null;
};

const RADIUS = 30;
const PERIMETER = Math.PI * 2 * RADIUS;

const Donut = ({ items, selectedId }: DonutProps) => {
  const total = items.length;
  const offset = PERIMETER * (total - 1) / total;
  const selectedIndex = selectedId ? items.findIndex(i => i.id === selectedId) : -1;
  const arcs = computeArcs(items, selectedIndex, RADIUS);
  const globalRotate = selectedIndex === -1 ? 0 : (360 * (selectedIndex + 0.5) / total);

  return (
    <svg className="Donut" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin">
      <g transform={`rotate(${globalRotate}, 50, 50)translate(50, 50)`}>
        {
          arcs.map(({ item: { id, colorNumber }, rotate }, index) => {
            const className = cssClasses({
              "Donut-arc": true,
              [`Donut-arc--color${colorNumber}`]: true
            });

            const strokeWidth = index === selectedIndex ? 20 : 16;

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
      <g transform="translate(50, 50)">
         <circle className="Donut-innerCircle" cx="0" cy="0" r="20" />
      </g>
    </svg>
  );
};

export default Donut;
