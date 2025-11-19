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
//수동으로 로그인 실패 케이스 만들어 보기
test ('로그인 실패 케이스', async ({page}) => {
    await page.goto ('/');
    //아이디 입력란 찾고, 입력란 넣기
    await page.getByPlaceholder('Username').fill('standard_user');

    //비밀번호 입력란 찾고, 비밀번호 입력
    await page.getByPlaceholder('Password').fill('standard_user');

    //로그인 버튼 클릭
    await page.getByRole('button',{name : 'Login'}).click();

    //로그인 오류에 대한 alert 메세지 확인
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();

    //로그인 후 URL 변화 실패
    await expect(page).not.toHaveURL(/inventory\.html/);
    console.log ('>>> 로그인 실패');
})


test ('로그아웃 시키기',async ({page})=>{
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole ('button',{name : 'Login'}).click();
    await page.getByRole('button', {name : 'Open Menu'}).click();
    console.log ('>>> 메뉴 선택 완료');
    await page.getByText('Logout').click();
    console.log ('>>> 로그아웃 선택완료');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    console.log ('>>> 로그아웃 성공');
})