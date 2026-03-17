const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');

async function takeScreenshot() {
  console.log('📱 使用 Playwright 截图 Wirecutter 首页...');
  
  // 先清理可能存在的旧进程
  try {
    require('child_process').execSync('pkill -f "astro dev" 2>/dev/null || true');
  } catch (e) {}
  
  // 启动服务器
  console.log('🚀 启动开发服务器...');
  const server = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'pipe',
    detached: true
  });
  
  // 等待服务器启动
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // 桌面端截图
    console.log('🖥️  截取桌面端视图 (1920x1080)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const response = await page.goto('http://localhost:4321/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    if (response && response.ok()) {
      // 等待内容加载
      await page.waitForTimeout(2000);
      
      // 截取全页
      await page.screenshot({
        path: 'wirecutter-desktop-full.png',
        fullPage: true,
        quality: 80
      });
      
      // 截取首屏
      await page.screenshot({
        path: 'wirecutter-desktop-above-fold.png',
        quality: 80
      });
      
      console.log('✅ 桌面端截图完成');
    } else {
      throw new Error('页面加载失败');
    }
    
    // 移动端截图
    console.log('📱 截取移动端视图 (375x667)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    await page.screenshot({
      path: 'wirecutter-mobile-full.png',
      fullPage: true,
      quality: 80
    });
    
    console.log('✅ 移动端截图完成');
    
    // 检查文件
    const files = ['wirecutter-desktop-full.png', 'wirecutter-desktop-above-fold.png', 'wirecutter-mobile-full.png'];
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`📄 ${file}: ${(stats.size / 1024).toFixed(1)} KB`);
      }
    });
    
  } catch (error) {
    console.error('❌ 截图失败:', error.message);
    
    // 尝试截取错误页面
    try {
      await page.screenshot({
        path: 'error-screenshot.png',
        fullPage: true
      });
      console.log('⚠️  已保存错误页面截图');
    } catch (e) {}
    
  } finally {
    // 清理
    await browser.close();
    
    // 停止服务器
    server.kill();
    try {
      process.kill(-server.pid);
    } catch (e) {}
    
    console.log('🛑 服务器已停止');
    console.log('🎯 截图流程完成');
  }
}

// 运行
takeScreenshot().catch(console.error);