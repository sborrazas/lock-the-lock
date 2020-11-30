import { create } from "./range";

type ObjWithId = {
  id: number;
};

type Arc<T extends ObjWithId> = {
  arc: string;
  rotate: number;
  item: T;
};

type Point = {
  x: number;
  y: number;
};

const PI2 = Math.PI * 2;

export const computeArcs = <T extends ObjWithId>(items: Array<T>,
                                                 selectedIndex: number,
                                                 radius: number): Array<Arc<T>> => {
  const total = items.length;
  const partitionAngle = PI2 / total;
  const bezel = 4 / 3 * Math.tan(partitionAngle / 4);
  const arcs = create(0, total).map((index) => {
    const angle = partitionAngle * index;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return { cos, sin, x: cos * radius, y: sin * radius };
  });

  return items.map((item, index) => {
    const start = arcs[index];
    const end = arcs[(index + 1) % total];
    const rotate = 360 * index / total;

    const bezelStart = {
      x: (start.cos - (bezel * start.sin)) * radius,
      y: (start.sin + (bezel * start.cos)) * radius
    };
    const bezelEnd = {
      x: (end.cos + (bezel * end.sin)) * radius,
      y: (end.sin - (bezel * end.cos)) * radius
    };

    const arc = `M${start.x},${start.y} ` +
          `C${bezelStart.x},${bezelStart.y} ` +
          ` ${bezelEnd.x},${bezelEnd.y} ` +
          ` ${end.x},${end.y} `;

    return { arc, item, rotate };
  });
};
