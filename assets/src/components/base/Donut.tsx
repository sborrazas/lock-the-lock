import React from "react";

import { computeArcs } from "../../helpers/donut";
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

const INNER_RADIUS = 100;
const OUTER_RADIUS = 200;
const SELECTED_OUTER_RADIUS = 220;
const SELECTED_INNER_RADIUS = 80;

const Donut = ({ items }: DonutProps) => {
  const arcs = computeArcs(items, OUTER_RADIUS, INNER_RADIUS);

        // <g transform="translate(285,292.5)rotate(177.5)">
  return (
    <section className="Donut">
      <svg width="100%" height="100%" viewBox="0 0 440 440" preserveAspectRatio="xMinYMin">
        <g transform="translate(220,220)rotate(0)">
          {
            arcs.map(({ arc, item: { id, colorNumber, label } }, index) => {
              const className = cssClasses({
                "Donut-path": true,
                [`Donut-path--color${colorNumber}`]: true
              });
              return (<path key={id.toString()} className={className} d={arc} />);
            })
          }
        </g>
        <g>
          <circle cx={SELECTED_OUTER_RADIUS} cy={SELECTED_OUTER_RADIUS} r={SELECTED_INNER_RADIUS} />
        </g>
      </svg>
    </section>
  );
};

export default Donut;
