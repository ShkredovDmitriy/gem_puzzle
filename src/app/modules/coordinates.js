export const getComponentPosition = (size, i, j) => {
  const width = 500 / size - 6;
  const xStart = i * width + 3 + i * 6;
  const yStart = j * width + 3 + j * 6;
  const xEnd = i * width + 3 + i * 6 + width;
  const yEnd = j * width + 3 + j * 6 + width;
  const xText = xStart + width / 2;
  const yText = yStart + width / 2;
  return { width, xStart, yStart, xEnd, yEnd, xText, yText }
}

export const getCursorPosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  const fix = 500 / document.getElementById("canvas").offsetWidth;
  const mouseX = (event.clientX - rect.left) * fix;
  const mouseY = (event.clientY - rect.top) * fix;
  return { mouseX, mouseY}
}

export const deepEqual = (arr1, arr2) => {
  let isEqueal = true;
  arr1.forEach((arr, i) => {
    arr.forEach((obj, j) => {
      if(obj.n !== arr2[i][j].n) isEqueal = false;
      if(obj.x !== arr2[i][j].x) isEqueal = false;
      if(obj.y !== arr2[i][j].y) isEqueal = false;
    })
  })
  return isEqueal
}