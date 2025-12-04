import { test, expect } from '@playwright/test';
import { loginstanduser } from './helpers/auth';
import { LoginPage } from './pages/LoginPage';

test.describe('sacudemo 로그인&로그아웃', () => {
  // 공통 메인 페이지 이동
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    console.log('>>> 메인 페이지 이동');
  });

  // 로그인 성공 테스트
  test('로그인 성공(LoginPage 사용)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('로그인 페이지 이동', async () => {
      await loginPage.goto();
    });

    await test.step('유효한 계정으로 로그인', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('정상 로그인 확인', async () => {
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.getByText('Products')).toBeVisible();
      console.log('>> 로그인 성공 확인 완료');
    });
  });

  // 로그인 실패 케이스 (비번 입력 실패)
  test('로그인 실패', async ({ page }) => {
    await test.step('아이디/비밀번호(오류 입력)', async () => {
      await page.getByPlaceholder('Username').fill('standard_user');
      await page.getByPlaceholder('Password').fill('1111');
    });

    await test.step('로그인 버튼 클릭', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('로그인 실패 확인', async () => {
      await expect(
        page.getByText('Epic sadface: Username and password do not match any user in this service')
      ).toBeVisible();
      await expect(page).not.toHaveURL(/inventory\.html/);
      console.log('>> 로그인 실패 확인 완료');
    });
  });
});

test.describe('로그아웃/장바구니/장바구니 검증', () => {
  test.describe.configure({ mode: 'serial'});
  test.beforeEach(async ({ page }) => {
    await test.step('사전조건: 로그인 완료 상태 만들기', async () => {
      await page.goto('/');
      await loginstanduser(page);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(page.locator('.title')).toHaveText('Products');
    });
  });

  test('로그아웃 확인', async ({ page }) => {
    await test.step('사이드 메뉴 열기', async () => {
      await page.getByRole('button', { name: 'Open Menu' }).click();
    });

    await test.step('Logout 클릭', async () => {
      await page.getByText('Logout').click();
    });

    await test.step('로그아웃 성공 확인(URL)', async () => {
      await expect(page).toHaveURL('https://www.saucedemo.com/');
    });
  });

  test('장바구니 추가', async ({ page }) => {
    await test.step('첫 상품 Add to cart 클릭', async () => {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    });

    await test.step('Remove 버튼 표시로 담김 확인', async () => {
      await expect(page.getByRole('button', { name: 'Remove' }).first()).toBeVisible();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });
  });

  test('장바구니 상품 업데이트 확인(상품명/가격 일치)', async ({ page }) => {
    let invName = '';
    let invPrice = '';

    await test.step('Inventory 첫 상품명/가격 저장', async () => {
      console.log('NOW URL', page.url());
      invName = await page.locator('.inventory_item_name').first().innerText();
      invPrice = await page.locator('.inventory_item_price').first().innerText();
    });

    await test.step('첫 상품 장바구니 담기', async () => {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
      await expect(page.getByRole('button', { name: 'Remove' }).first()).toBeVisible();
    });

    await test.step('장바구니 페이지로 이동', async () => {
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL(/cart\.html/);
    });

    await test.step('장바구니 상품명/가격이 inventory와 동일한지 검증', async () => {
      await expect(page.locator('.inventory_item_name').first()).toHaveText(invName);
      await expect(page.locator('.inventory_item_price').first()).toHaveText(invPrice);
    });
  });

  test('정보 입력 화면 노출 및 구매 완료', async ({ page }) => {
    console.log('NOW URL', page.url());

    await test.step('장바구니 페이지 이동 및 정보 입력 화면 진입', async () => {
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL(/cart\.html/);

      await page.getByRole('button', { name: 'Checkout' }).click();
      await expect(page).toHaveURL(/checkout-step-one\.html/); // ✅ 이거 정규식으로
    });
  });
});