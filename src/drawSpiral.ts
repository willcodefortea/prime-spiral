import { unstable_shouldYield } from "scheduler";

export const drawSpiral = function* (
  ctx: CanvasRenderingContext2D,
  width: number,
  tileSize: number,
  shouldDraw: (cellIdx: number) => boolean,
  cellColour: (cellIdx: number) => string = () => "#fff"
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = -tileSize;

  const numCells = Math.pow(width / tileSize, 2);

  const midX = width / 2;
  const midY = width / 2;

  for (let i = 0; i < numCells; i++) {
    if (-width / 2 < x && x <= width / 2 && -width / 2 < y && y <= width / 2) {
      if (shouldDraw(i)) {
        ctx.fillStyle = cellColour(i);
        ctx.fillRect(midX + x, midY + y, tileSize, tileSize);
      }
    }

    if (x === y || (x < 0 && x === -y) || (x > 0 && x === tileSize - y)) {
      [dx, dy] = [-dy, dx];
    }

    x += dx;
    y += dy;

    if (unstable_shouldYield()) yield;
  }
};
