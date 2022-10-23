import { getComponentPosition } from './coordinates';

function component(ctx, size, obj, isGreen) {
  const { width, xStart, yStart, xText, yText} = getComponentPosition(size, obj.x, obj.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#df4f29";
  if(isGreen) ctx.strokeStyle = "#388f2c";
  ctx.roundRect(xStart, yStart, width, width, { upperLeft: 8, upperRight: 8, lowerLeft: 8, lowerRight: 8 });
  ctx.font = '40px serif';
  ctx.fillStyle = "#df4f29";
  if(isGreen) ctx.fillStyle = "#388f2c";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(obj.n, xText, yText);
}

export default component;