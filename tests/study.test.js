import { test, expect } from '@playwright/test';
test('SauceDemo 로그인 성공', async ({page}) => {
    //사이트 메인 이동
    await page.goto('/');

    //아이디 입력란 찾고, 유저입력
    await page.getByPlaceholder('Username').fill('standard_user');

    //비밀번호 입력
    await page.getByPlaceholder('Password').fill('secret_sauce');

    //로그인 버튼 클릭
    await page.getByRole('button',{ name : 'Login'}).click();

    //URL 변화 확인
    await expect(page).toHaveURL(/inventory\.html/);

    //화면에 'Products' 문구 노출 확인
    await expect(page.getByText('Products')).toBeVisible();

});