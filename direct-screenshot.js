import { chromium } from 'playwright';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('🎯 直接截图方案');
  
  // 先确保没有其他服务器运行
  try {
    await execAsync('pkill -f "astro dev" 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (e) {}
  
  // 启动服务器
  console.log('🚀 启动服务器...');
  const serverProcess = exec('npm run dev', {
    cwd: process.cwd()
  });
  
  // 等待服务器启动
  console.log('⏳ 等待服务器启动...');
  await new Promise(resolve => setTimeout(resolve, 12000));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // 测试连接
    console.log('🔗 测试连接...');
    const response = await page.goto('http://localhost:4321/', {
      waitUntil: 'load',
      timeout: 15000
    });
    
    console.log(`📄 页面状态: ${response?.status() || '未知'}`);
    
    if (response && response.ok()) {
      console.log('✅ 页面加载成功，开始截图...');
      
      // 桌面端
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.screenshot({
        path: 'home-desktop.png',
        fullPage: true
      });
      console.log('📸 桌面端截图保存: home-desktop.png');
      
      // 移动端
      await page.setViewportSize({ width: 375, height: 667 });
      await page.screenshot({
        path: 'home-mobile.png',
        fullPage: true
      });
      console.log('📱 移动端截图保存: home-mobile.png');
      
      // 获取页面标题验证
      const title = await page.title();
      console.log(`🏷️  页面标题: ${title}`);
      
      // 检查关键元素
      const heroExists = await page.locator('.heading-1').count() > 0;
      const tableExists = await page.locator('.product-table').count() > 0;
      console.log(`🔍 关键元素检查: Hero=${heroExists}, 产品表格=${tableExists}`);
      
    } else {
      console.log('❌ 页面加载失败');
      // 截取当前状态
      await page.screenshot({ path: 'failed-page.png' });
    }
    
  } catch (error) {
    console.error('💥 错误:', error.message);
  } finally {
    // 清理
    await browser.close();
    
    // 停止服务器
    serverProcess.kill();
    try {
      await execAsync('pkill -f "astro dev" 2>/dev/null || true');
    } catch (e) {}
    
    console.log('🛑 清理完成');
  }
}

main().catch(console.error);