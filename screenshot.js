import { chromium } from 'playwright';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function takeScreenshot() {
  let astroProcess = null;
  
  try {
    console.log('🚀 启动 Astro 开发服务器...');
    
    // 启动 Astro 开发服务器
    astroProcess = exec('npm run dev', {
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    
    // 等待服务器启动
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🌐 启动浏览器...');
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    console.log('📸 访问首页并截图...');
    
    // 访问首页
    await page.goto('http://localhost:4321/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // 等待内容加载
    await page.waitForSelector('.heading-1', { timeout: 10000 });
    
    // 截图整个页面
    console.log('📱 截取桌面端视图...');
    await page.screenshot({ 
      path: 'screenshot-desktop.png',
      fullPage: true 
    });
    
    // 截取移动端视图
    console.log('📱 截取移动端视图...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'screenshot-mobile.png',
      fullPage: true 
    });
    
    // 截取关键部分
    console.log('🎯 截取关键组件...');
    
    // Hero 区域
    const hero = await page.locator('section.bg-gradient-to-r');
    if (await hero.count() > 0) {
      await hero.first().screenshot({ path: 'screenshot-hero.png' });
    }
    
    // 产品表格
    const table = await page.locator('.product-table');
    if (await table.count() > 0) {
      await table.first().screenshot({ path: 'screenshot-table.png' });
    }
    
    // 分类网格
    const categories = await page.locator('#categories');
    if (await categories.count() > 0) {
      await categories.screenshot({ path: 'screenshot-categories.png' });
    }
    
    console.log('✅ 截图完成！');
    console.log('📁 生成的截图文件：');
    console.log('  - screenshot-desktop.png (桌面端全页)');
    console.log('  - screenshot-mobile.png (移动端全页)');
    console.log('  - screenshot-hero.png (Hero区域)');
    console.log('  - screenshot-table.png (产品表格)');
    console.log('  - screenshot-categories.png (分类网格)');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ 截图失败:', error.message);
  } finally {
    // 清理进程
    if (astroProcess) {
      astroProcess.kill();
    }
    
    // 确保所有进程都被清理
    try {
      await execAsync('pkill -f "astro dev" 2>/dev/null || true');
    } catch (e) {
      // 忽略错误
    }
    
    process.exit(0);
  }
}

takeScreenshot();