const a = new Audio();

export const audio = () => {
  a.src = './audio/sound.mp3';
  a.currentTime = 0;
  return a;
}