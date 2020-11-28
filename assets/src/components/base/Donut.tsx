import React from "react";

import { computeArc, Arc } from "../../helpers/donut";
import { cssClasses } from "../../helpers/css";

import "./Donut.scss";

type DonutItem = {
  id: number,
  colorNumber: number,
  label: string
};

type DonutProps = {
  items: Array<DonutItem>;
  selectedId: number;
};

const RADIUS = 200;

const Donut = ({ items }: DonutProps) => {
  const count = items.length;

  return (
    <section className="Donut">
      <svg width="100%" height="100%" viewBox="0 0 585 585" preserveAspectRatio="xMinYMin">
        <g transform="translate(285,292.5)rotate(177.5)">
          {
            items.map(({ id, colorNumber }, index) => {
              const arc = computeArc(index, count, RADIUS);
              const { startX, startY, bezelStartX, bezelStartY, endX, endY, bezelEndX, bezelEndY } = arc;
              const className = cssClasses({
                "Donut-path": true,
                [`Donut-path--color${colorNumber}`]: true
              });
              const d = "M0,0 " +
                    `L${startX},${startY} ` +
                    `C${bezelStartX},${bezelStartY} ` +
                    ` ${bezelEndX},${bezelEndY} ` +
                    ` ${endX},${endY} ` +
                    "L0,0 " +
                    "Z"
              console.log(index, arc, d);
              return (<path key={id.toString()} className={className} d={d} />);
            })
          }
        </g>
      </svg>
    </section>
  );
};

export default Donut;
