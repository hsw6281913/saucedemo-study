    import { test, expect } from '@playwright/test';
    import { loginstanduser } from './helpers/auth';


    test.describe('sacudemo 로그인&로그아웃',() =>{
        //로그인 저장된 상태 사용안함
        test.use ({storageState : undefined});

        //공통 메인 페이지 이동
        test.beforeEach(async ({page}) => {
            await page.goto('/');
            console.log('>>> 메인 페이지 이동')
        });
        
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
    })


    test.describe('로그아웃/장바구니 추가 기능 묶기',() => {
        test.beforeEach(async ({page}) => {
            await loginstanduser(page);
            await expect(page).toHaveURL(/inventory\.html/);
            console.log('>>로그인 성공')
        });
        // 로그아웃 확인
        test('로그아웃 확인', async ({page}) => {
            await page.getByRole('button', { name: 'Open Menu' }).click();
            console.log('>>> 메뉴 선택 완료');
            await page.getByText('Logout').click();
            console.log('>>> 로그아웃 선택완료');
            await expect(page).toHaveURL('https://www.saucedemo.com/');
            console.log('>>> 로그아웃 성공');
        });
        // 장바구니 추가
        test('장바구니 추가', async ({page}) => {
            await page.getByRole('button', { name: 'Add to cart'}).first().click();
            await expect(page.getByRole('button',{name : 'Remove'}).first()).toBeVisible();
            console.log ('>> 장바구니 담기 성공');
        });
        
        test ('장바구니 상품 업데이트 확인', async ({page}) => {
            //장바구니 상품리스트 상품명/가격 저장
            const inventoryfirstname = await page.locator('.inventory_item_name').first().innerText();
            const inventoryfirstprice = await page.locator('.inventory_item_price').first().innerText();
            console.log('상품명:',inventoryfirstname);
            console.log('상품가격:',inventoryfirstprice);

            //장바구니 담기
            await page.getByRole('button', { name: 'Add to cart'}).first().click();
            await expect(page.getByRole('button',{name : 'Remove'}).first()).toBeVisible();

            //장바구니 숫자 1 업데이트 확인
            const cartBadge =  page.locator('.shopping_cart_badge');
            await expect(cartBadge).toHaveText('1');
            console.log('>> 장바구니 숫자 1 확인');

            //장바구니 페이지 이동
            const cartlink = page.locator('.shopping_cart_link');
            await cartlink.click();
            await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
            console.log('>>> 장바구니 페이지 이동 확인')
            
            //장바구니 담은 상품명/가격 저장
            const cartfirstname = await page.locator('.inventory_item_name').first().innerText();
            const cartfirstprice = await page.locator('.inventory_item_price').first().innerText();
            console.log('장바구니 상품명:',cartfirstname);

            //상품명/가격 으로 장바구니 상품 확인
            expect(inventoryfirstname).toBe(cartfirstname);
            console.log('>> 상품명 비교 장바구니 담기 확인')
            expect(inventoryfirstprice).toBe(cartfirstprice);
            console.log('>> 상품가격 비교 장바구니 담기 확인')

        });
    });

        
