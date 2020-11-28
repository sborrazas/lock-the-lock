export type Arc = {
  startX: number;
  startY: number;
  bezelStartX: number;
  bezelStartY: number;
  endX: number;
  endY: number;
  bezelEndX: number;
  bezelEndY: number;
};

const PI2 = Math.PI * 2;

export const computeArc = (index: number, total: number, radius: number): Arc => {
  const partitionAngle = PI2 / total;
  const bezel = 4 / 3 * Math.tan(partitionAngle / 4);

  const angle = partitionAngle * index;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  const angleNext = partitionAngle * (index + 1);
  const sinNext = Math.sin(angleNext);
  const cosNext = Math.cos(angleNext);

  return {
    startX: cos * radius,
    startY: sin * radius,
    bezelStartX: (cos - (bezel * sin)) * radius,
    bezelStartY: (sin + (bezel * cos)) * radius,
    endX: cosNext * radius,
    endY: sinNext * radius,
    bezelEndX: (cosNext + (bezel * sinNext)) * radius,
    bezelEndY: (sinNext - (bezel * cosNext)) * radius
  };
};
