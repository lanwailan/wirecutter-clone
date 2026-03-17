import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

async function main() {
  console.log('🚀 启动开发服务器...');
  
  // 启动 Astro 开发服务器
  const astro = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true
  });
  
  // 记录输出
  astro.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('ready in')) {
      console.log('✅ 服务器已启动');
    }
  });
  
  astro.stderr.on('data', (data) => {
    console.error('服务器错误:', data.toString());
  });
  
  // 等待服务器启动
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  console.log('🌐 启动浏览器截图...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // 桌面端截图
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('访问首页...');
    
    const response = await page.goto('http://localhost:4321/', { 
      waitUntil: 'networkidle',
      timeout: 20000 
    });
    
    if (!response || !response.ok()) {
      throw new Error(`页面加载失败: ${response ? response.status() : '无响应'}`);
    }
    
    console.log('📸 截取桌面端...');
    await page.screenshot({ 
      path: 'homepage-desktop.png',
      fullPage: true,
      quality: 85
    });
    
    // 移动端截图
    console.log('📱 截取移动端...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'homepage-mobile.png',
      fullPage: true,
      quality: 85
    });
    
    // 截取分类页面
    console.log('📂 截取分类页面...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:4321/category/electronics/', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    await page.screenshot({
      path: 'category-electronics.png',
      fullPage: true,
      quality: 85
    });
    
    console.log('✅ 所有截图完成！');
    console.log('📁 生成的文件：');
    console.log('   homepage-desktop.png - 首页桌面端');
    console.log('   homepage-mobile.png  - 首页移动端');
    console.log('   category-electronics.png - 电子产品分类页');
    
  } catch (error) {
    console.error('❌ 截图失败:', error.message);
    
    // 尝试截取当前页面状态
    try {
      await page.screenshot({ 
        path: 'error-capture.png',
        fullPage: true 
      });
      console.log('⚠️  已保存错误状态截图');
    } catch (e) {
      console.error('无法保存错误截图:', e.message);
    }
  } finally {
    // 清理
    await browser.close();
    
    // 停止服务器
    astro.kill();
    process.kill(-astro.pid);
    
    console.log('🛑 服务器已停止');
  }
}

main().catch(console.error);