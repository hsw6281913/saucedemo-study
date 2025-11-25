import { test, expect } from '@playwright/test';

test.describe('sacudemo 로그인&로그아웃',() =>{
    //공통 메인 페이지 이동
    test.beforeEach(async ({page}) => {
        await page.goto('/');
        console.log('>>> 메인 페이지 이동')
    });
    //공통 로그인 함수 만들기
    async function loginstanduser(page) {
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', {name : 'Login'}).click();
        console.log('>> 공통 로그인 성공');
    };

    //로그인 성공 테스트
    test('로그인 성공', async ({page}) => {
        await loginstanduser(page);
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.getByText('Products')).toBeVisible();
    });

    //로그인 실패 케이스 (비번 입력 실패)
    test('로그인 실패', async ({page}) => {
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('1111');
        await page.getByRole('button', {name : 'Login'}).click();
        await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
        await expect(page).not.toHaveURL(/inventory\.html/);
        console.log('>> 로그인 실패');
    });
    // 로그아웃 확인
    test('로그아웃 확인', async ({page}) => {
        await loginstanduser(page);
        await expect(page).toHaveURL(/inventory\.html/);
        console.log('>>로그인 성공')
        await page.getByRole('button', { name: 'Open Menu' }).click();
        console.log('>>> 메뉴 선택 완료');
        await page.getByText('Logout').click();
        console.log('>>> 로그아웃 선택완료');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        console.log('>>> 로그아웃 성공');
    });
    // 장바구니 추가
    test('장바구니 추가', async ({page}) => {
        await loginstanduser(page);
        await expect(page).toHaveURL(/inventory\.html/);
        console.log ('>> 로그인 성공');
        await page.getByRole('button', { name: 'Add to cart'}).first().click();
        await expect(page.getByRole('button',{name : 'Remove'}).first()).toBeVisible();
        console.log ('>> 장바구니 담기 성공');
    })
})