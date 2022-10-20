export const createRandomSet = (size) => {
  const ord = [];
  const length = size * size;
  while(ord.length < length) {
    let num = Math.floor(Math.random() * length);
    if(num == 0) num = 'free'
    if(!ord.includes(num)) ord.push(num)
  }
  return ord;
}

export const createSet = (size) => {
  const length = size * size;
  const arr = new Array(length).fill(1).map((n, i) => n + i);
  arr[length - 1] = 'free';
  return arr;
}

export const createMatrix = (size, set) => {
  const arr = set(size);
  let res = [];
  let n = 0;
  for(let i = 0; i < size; i++) {
    let row = [];
    for(let j = 0; j < size; j++) {
      row.push({x: j, y: i, n: arr[n]})
      n += 1;
    }
    res.push(row);
  }
  return res;
}