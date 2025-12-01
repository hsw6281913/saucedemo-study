import {test, expect} from '@playwright/test';


test.describe('saucedemo 자동화 상품1개 담고 로그아웃',()=>{
    test('상품한개 담고 로그아웃',async({page}) =>{
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(/inventory\.html/);
        console.log('URL:', page.url());
        console.log('cookies:', await page.context().cookies());
        await page.screenshot({ path: 'debug.png', fullPage: true });

        await expect(page.getByText('Products')).toBeVisible();

        //상품/이름 가격 저장
        const firstname = await page.locator('.inventory_item_name').first().innerText();
        console.log(firstname);
        const firstprice = await page.locator('.inventory_item_price').first().innerText();
        console.log(firstprice);

        //첫번째 상품 장바구니에 담기
        await page.getByRole('button',{name : 'add to cart'}).first().click();
        await expect(page.getByRole('button',{name : 'Remove'})).first().toBeVisible();

        //장바구니 페이지 이동
        await page.locator('.shopping_cart_link').click();
        await expect.toHaveURL('https://www.saucedemo.com/cart.html');
        

        //장바구니 1 증가 확인
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

        //장바구니 상품비교 (상품명,가격)
        const cartName = await page.locator('.inventory_item_name').first().innerText();
        expect(cartName).toBe(firstname);
        const cartPrice = await page.locator('.inventory-item-price').first().innerText();
        expect(cartPrice).toBe(firstprice);
    })
});