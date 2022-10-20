export const coordinates = (size, i, j) => {
  const width = 500 / size - 6;
  const xStart = i * width + 3 + i * 6;
  const yStart = j * width + 3 + j * 6;
  const xEnd = i * width + 3 + i * 6 + width;
  const yEnd = j * width + 3 + j * 6 + width;
  const xText = xStart + width / 2;
  const yText = yStart + width / 2;
  return { width, xStart, yStart, xEnd, yEnd, xText, yText }
}
