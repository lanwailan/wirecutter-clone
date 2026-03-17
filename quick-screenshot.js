import { chromium } from 'playwright';

async function captureScreenshot() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // 设置桌面端视图
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('🌐 访问 http://localhost:4321/ ...');
  
  try {
    // 访问页面，增加超时时间
    await page.goto('http://localhost:4321/', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // 等待页面内容
    await page.waitForTimeout(3000);
    
    console.log('📸 截取桌面端全页...');
    await page.screenshot({ 
      path: 'wirecutter-home-desktop.png',
      fullPage: true,
      quality: 90
    });
    
    console.log('📱 截取移动端视图...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'wirecutter-home-mobile.png',
      fullPage: true,
      quality: 90
    });
    
    console.log('✅ 截图完成！');
    console.log('📁 文件已保存：');
    console.log('   - wirecutter-home-desktop.png');
    console.log('   - wirecutter-home-mobile.png');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    
    // 尝试截取当前状态
    await page.screenshot({ 
      path: 'error-state.png',
      fullPage: true 
    });
    console.log('⚠️  已保存错误状态截图: error-state.png');
  }
  
  await browser.close();
}

captureScreenshot();