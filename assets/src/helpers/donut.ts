import { create } from "./range";

type Arc<T> = {
  arc: string;
  item: T;
};

type Point = {
  x: number;
  y: number;
};

const PI2 = Math.PI * 2;

export const computeArcs = <T>(items: Array<T>, outerRadius: number, innerRadius: number): Array<Arc<T>> => {
  const partitionAngle = PI2 / items.length;
  const bezel = 4 / 3 * Math.tan(partitionAngle / 4);
  const arcs = create(0, items.length).map((index) => {
    const angle = partitionAngle * index;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return {
      inner: { cos, sin, x: cos * innerRadius, y: sin * innerRadius },
      outer: { cos, sin, x: cos * outerRadius, y: sin * outerRadius }
    };
  });

  return items.map((item, index) => {
    const { inner: startInner, outer: startOuter } = arcs[index];
    const { inner: endInner, outer: endOuter } = arcs[(index + 1) % items.length];

    const bezelStartInner = {
      x: (startInner.cos - (bezel * startInner.sin)) * innerRadius,
      y: (startInner.sin + (bezel * startInner.cos)) * innerRadius
    };
    const bezelStartOuter = {
      x: (startOuter.cos - (bezel * startOuter.sin)) * outerRadius,
      y: (startOuter.sin + (bezel * startOuter.cos)) * outerRadius
    };
    const bezelEndInner = {
      x: (endInner.cos + (bezel * endInner.sin)) * innerRadius,
      y: (endInner.sin - (bezel * endInner.cos)) * innerRadius
    };
    const bezelEndOuter = {
      x: (endOuter.cos + (bezel * endOuter.sin)) * outerRadius,
      y: (endOuter.sin - (bezel * endOuter.cos)) * outerRadius
    };

    const arc = `M${startInner.x},${startInner.y} ` +
          `C${bezelStartInner.x},${bezelStartInner.y} ` +
          ` ${bezelEndInner.x},${bezelEndInner.y} ` +
          ` ${endInner.x},${endInner.y} ` +
          `L${endOuter.x},${endOuter.y} ` +
          `C${bezelEndOuter.x},${bezelEndOuter.y} ` +
          ` ${bezelStartOuter.x},${bezelStartOuter.y} ` +
          ` ${startOuter.x},${startOuter.y} ` +
          `L${startInner.x},${startInner.y} ` +
          "Z";

    return { arc, item };
  });
};
