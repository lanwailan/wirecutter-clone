import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { existsSync, unlinkSync } from 'fs';

// 要测试的页面列表
const pagesToTest = [
  { 
    name: '首页', 
    path: '/', 
    description: 'Wirecutter Clone 首页 - 特色评测和产品对比' 
  },
  { 
    name: '电子产品分类页', 
    path: '/category/electronics/', 
    description: '电子产品分类 - 包含子分类和筛选功能' 
  },
  { 
    name: '家居园艺分类页', 
    path: '/category/home-garden/', 
    description: '家居园艺分类页面' 
  },
  { 
    name: '厨房分类页', 
    path: '/category/kitchen/', 
    description: '厨房用品分类页面' 
  },
  { 
    name: '睡眠分类页', 
    path: '/category/sleep/', 
    description: '睡眠产品分类页面' 
  },
  { 
    name: '健康健身分类页', 
    path: '/category/health-fitness/', 
    description: '健康健身分类页面' 
  }
];

async function testAllPages() {
  console.log('🚀 开始全面页面测试...');
  
  // 清理旧截图
  console.log('🧹 清理旧截图文件...');
  const oldFiles = [
    'test-home-desktop.png', 'test-home-mobile.png',
    'test-electronics-desktop.png', 'test-electronics-mobile.png',
    'test-homegarden-desktop.png', 'test-homegarden-mobile.png',
    'test-kitchen-desktop.png', 'test-kitchen-mobile.png',
    'test-sleep-desktop.png', 'test-sleep-mobile.png',
    'test-health-desktop.png', 'test-health-mobile.png'
  ];
  
  oldFiles.forEach(file => {
    try {
      if (existsSync(file)) unlinkSync(file);
    } catch (e) {}
  });
  
  // 启动服务器
  console.log('🌐 启动开发服务器...');
  const server = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true
  });
  
  // 等待服务器启动
  console.log('⏳ 等待服务器启动...');
  await new Promise(resolve => setTimeout(resolve, 12000));
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  
  try {
    for (const pageInfo of pagesToTest) {
      console.log(`\n📄 测试页面: ${pageInfo.name}`);
      console.log(`  路径: ${pageInfo.path}`);
      
      const url = `http://localhost:4321${pageInfo.path}`;
      
      try {
        // 访问页面
        console.log(`  访问: ${url}`);
        const response = await page.goto(url, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        const status = response?.status() || 0;
        console.log(`  状态码: ${status}`);
        
        if (status === 200) {
          // 等待内容加载
          await page.waitForTimeout(2000);
          
          // 检查关键元素
          const hasContent = await page.locator('body').count() > 0;
          const hasNavigation = await page.locator('header').count() > 0;
          const hasFooter = await page.locator('footer').count() > 0;
          
          console.log(`  内容检查: body=${hasContent}, header=${hasNavigation}, footer=${hasFooter}`);
          
          // 桌面端截图
          console.log('  📸 截取桌面端...');
          await page.setViewportSize({ width: 1920, height: 1080 });
          const desktopFile = `test-${pageInfo.name.replace(' ', '').toLowerCase()}-desktop.png`;
          await page.screenshot({
            path: desktopFile,
            fullPage: true
          });
          
          // 移动端截图
          console.log('  📱 截取移动端...');
          await page.setViewportSize({ width: 375, height: 667 });
          const mobileFile = `test-${pageInfo.name.replace(' ', '').toLowerCase()}-mobile.png`;
          await page.screenshot({
            path: mobileFile,
            fullPage: true
          });
          
          results.push({
            name: pageInfo.name,
            path: pageInfo.path,
            status: '✅ 成功',
            desktopFile,
            mobileFile,
            description: pageInfo.description
          });
          
          console.log(`  ✅ ${pageInfo.name} 测试完成`);
          
        } else {
          console.log(`  ❌ 页面加载失败: HTTP ${status}`);
          results.push({
            name: pageInfo.name,
            path: pageInfo.path,
            status: `❌ 失败 (HTTP ${status})`,
            error: `HTTP ${status}`
          });
        }
        
      } catch (error) {
        console.log(`  💥 访问错误: ${error.message}`);
        results.push({
          name: pageInfo.name,
          path: pageInfo.path,
          status: `💥 错误`,
          error: error.message
        });
      }
      
      // 页面间短暂等待
      await page.waitForTimeout(1000);
    }
    
    // 输出测试结果
    console.log('\n📊 测试结果汇总:');
    console.log('='.repeat(50));
    
    results.forEach(result => {
      console.log(`${result.status} ${result.name}`);
      if (result.desktopFile) {
        console.log(`   桌面端: ${result.desktopFile}`);
        console.log(`   移动端: ${result.mobileFile}`);
      }
      if (result.error) {
        console.log(`   错误: ${result.error}`);
      }
      console.log('');
    });
    
    console.log(`✅ 完成 ${results.filter(r => r.status.includes('✅')).length}/${pagesToTest.length} 个页面`);
    
  } catch (error) {
    console.error('💥 测试流程错误:', error.message);
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
    
    // 返回结果用于发送截图
    return results;
  }
}

// 执行测试
const testResults = await testAllPages().catch(console.error);

// 导出结果用于后续发送
if (testResults && Array.isArray(testResults)) {
  console.log('\n📤 准备发送截图到 Telegram...');
  
  // 这里可以添加发送逻辑
  // 由于需要逐个发送，我们将在外部处理
  
  // 保存结果到文件以便外部脚本使用
  const fs = await import('fs');
  fs.writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
  console.log('💾 测试结果已保存到 test-results.json');
  
  // 输出发送指令
  console.log('\n📋 发送截图命令:');
  testResults.forEach(result => {
    if (result.desktopFile && result.mobileFile) {
      console.log(`# ${result.name}`);
      console.log(`# 桌面端: ${result.desktopFile}`);
      console.log(`# 移动端: ${result.mobileFile}`);
    }
  });
}