import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

async function captureScreenshots() {
  console.log('🎬 开始截图流程...');
  
  // 清理旧进程
  try {
    const { execSync } = await import('child_process');
    execSync('pkill -f "astro dev" 2>/dev/null || true');
  } catch (e) {}
  
  // 启动服务器
  console.log('🚀 启动开发服务器...');
  const server = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true
  });
  
  // 等待服务器完全启动
  await new Promise(resolve => {
    const checkServer = setInterval(async () => {
      try {
        const { execSync } = await import('child_process');
        const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/ 2>/dev/null || echo "000"', { encoding: 'utf8' }).trim();
        if (result === '200') {
          clearInterval(checkServer);
          console.log('✅ 服务器已就绪 (HTTP 200)');
          resolve();
        }
      } catch (e) {}
    }, 1000);
    
    // 超时
    setTimeout(() => {
      clearInterval(checkServer);
      console.log('⚠️  服务器启动超时，继续尝试...');
      resolve();
    }, 15000);
  });
  
  // 额外等待
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 访问首页...');
    
    // 桌面端截图
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('http://localhost:4321/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    console.log(`📊 响应状态: ${response?.status()}`);
    
    if (response && response.ok()) {
      // 等待关键元素
      await page.waitForSelector('.heading-1', { timeout: 10000 }).catch(() => {
        console.log('⚠️  未找到 .heading-1，继续...');
      });
      
      // 桌面端全页
      console.log('📸 截取桌面端全页...');
      await page.screenshot({
        path: 'wirecutter-home-desktop-full.png',
        fullPage: true,
        quality: 85
      });
      
      // 桌面端首屏
      console.log('📸 截取桌面端首屏...');
      await page.screenshot({
        path: 'wirecutter-home-desktop-fold.png',
        quality: 85
      });
      
      // 移动端
      console.log('📱 截取移动端...');
      await page.setViewportSize({ width: 375, height: 667 });
      await page.screenshot({
        path: 'wirecutter-home-mobile-full.png',
        fullPage: true,
        quality: 85
      });
      
      // 分类页面
      console.log('📂 截取分类页面...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('http://localhost:4321/category/electronics/', {
        waitUntil: 'networkidle',
        timeout: 15000
      });
      
      await page.screenshot({
        path: 'wirecutter-category-electronics.png',
        fullPage: true,
        quality: 85
      });
      
      console.log('✅ 所有截图完成！');
      console.log('📁 生成的文件：');
      const files = [
        'wirecutter-home-desktop-full.png',
        'wirecutter-home-desktop-fold.png', 
        'wirecutter-home-mobile-full.png',
        'wirecutter-category-electronics.png'
      ];
      
      for (const file of files) {
        if (existsSync(file)) {
          const fs = await import('fs');
          const stats = fs.statSync(file);
          console.log(`   ${file} - ${(stats.size / 1024).toFixed(1)} KB`);
        }
      }
      
    } else {
      throw new Error(`页面加载失败: ${response?.status()}`);
    }
    
  } catch (error) {
    console.error('❌ 截图失败:', error.message);
    
    // 尝试截取当前状态
    try {
      await page.screenshot({
        path: 'error-state.png',
        fullPage: true
      });
      console.log('⚠️  已保存错误状态截图: error-state.png');
    } catch (e) {
      console.error('无法保存错误截图:', e.message);
    }
    
  } finally {
    // 清理
    await browser.close();
    
    // 停止服务器
    server.kill();
    try {
      const { execSync } = await import('child_process');
      execSync('pkill -f "astro dev" 2>/dev/null || true');
    } catch (e) {}
    
    console.log('🛑 服务器已停止');
    console.log('🎬 截图流程结束');
  }
}

// 执行
captureScreenshots().catch(console.error);