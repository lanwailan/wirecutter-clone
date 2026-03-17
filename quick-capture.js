import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function quickCapture() {
  console.log('⚡ 快速截图...');
  
  // 清理
  try {
    const { execSync } = await import('child_process');
    execSync('pkill -f "astro dev" 2>/dev/null || true');
  } catch (e) {}
  
  // 启动服务器
  console.log('启动服务器...');
  const server = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true
  });
  
  // 等待
  await new Promise(resolve => setTimeout(resolve, 12000));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // 桌面端
    console.log('截取桌面端...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:4321/', { waitUntil: 'load' });
    await page.screenshot({ path: 'desktop.png', fullPage: true });
    
    // 移动端
    console.log('截取移动端...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: 'mobile.png', fullPage: true });
    
    console.log('✅ 截图完成！');
    console.log('📁 desktop.png - 桌面端全页');
    console.log('📁 mobile.png - 移动端全页');
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await browser.close();
    
    // 停止服务器
    server.kill();
    try {
      const { execSync } = await import('child_process');
      execSync('pkill -f "astro dev" 2>/dev/null || true');
    } catch (e) {}
  }
}

quickCapture().catch(console.error);