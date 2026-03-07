console.log('使用抖音开发者工具开发过程中可以参考以下文档:');
console.log(
  'https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/guide/minigame/introduction',
);

let systemInfo = tt.getSystemInfoSync();
let canvas = tt.createCanvas(),
  ctx = canvas.getContext('2d');
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;

function draw() {
  ctx.fillStyle = '#E5EBF6';
  ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

  ctx.fillStyle = '#000000';
  ctx.font = `${parseInt(systemInfo.windowWidth / 20)}px Arial`;
  ctx.fillText('抖音小游戏空白模板', 110, 200);
  const image = tt.createImage();
  image.src = 'icon.png';
  image.onload = () => {
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      (systemInfo.windowWidth - 100) / 2,
      60,
      100,
      100,
    );
  };
}

draw();
