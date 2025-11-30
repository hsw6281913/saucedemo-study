const { chromium } = require('@playwright/test');

module.exports = async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    //URL 접속 대기
    await page.waitForURL(/inventory\.html/);

    //로그인 상태 저장
    await context.storageState({ path : 'storageState.json'});

    await browser.close();

};