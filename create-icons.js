// 使用 jimp 创建有效的 PNG 图标
const Jimp = require('jimp-compact');
const fs = require('fs');
const path = require('path');

async function createIcons() {
  const assetsDir = path.join(__dirname, 'src', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 创建 1024x1024 紫色图片
  const image = await Jimp.create(1024, 1024, 0x6C63FF);
  
  // 保存为 icon.png 和 adaptive-icon.png
  await image.writeAsync(path.join(assetsDir, 'icon.png'));
  await image.writeAsync(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('Created: icon.png, adaptive-icon.png');

  // 创建 splash (2048x2048)
  const splash = await Jimp.create(2048, 2048, 0x6C63FF);
  await splash.writeAsync(path.join(assetsDir, 'splash.png'));
  console.log('Created: splash.png');

  // 创建 favicon (32x32)
  const favicon = await Jimp.create(32, 32, 0x6C63FF);
  await favicon.writeAsync(path.join(assetsDir, 'favicon.png'));
  console.log('Created: favicon.png');

  console.log('✅ 所有图标文件创建完成');
}

createIcons().catch(console.error);
