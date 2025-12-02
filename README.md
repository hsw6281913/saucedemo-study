# SauceDemo Playwright E2E Automation (Study)

SauceDemo(https://www.saucedemo.com/) 사이트를 대상으로 **Playwright Test(JavaScript)** 로 작성한 UI E2E 자동화 학습 프로젝트입니다.  
공통 로그인 헬퍼를 분리하고, 로그인/로그아웃/장바구니 주요 플로우를 **성공/실패 케이스**로 검증합니다.

---

## Tech Stack
- Playwright Test (JavaScript)
- Node.js / npm

---

## Test Coverage

### 1) 로그인 (성공/실패)
- **로그인 성공**
  - 공통 로그인 함수(`loginstanduser`)로 로그인
  - `/inventory.html` 진입 확인
  - `Products` 텍스트 노출 확인
- **로그인 실패 (비밀번호 오류)**
  - 오류 메시지 노출 확인:  
    `Epic sadface: Username and password do not match any user in this service`
  - inventory 페이지로 이동하지 않는 것 확인

### 2) 로그아웃
- 햄버거 메뉴(Open Menu) 클릭 → Logout 클릭
- 메인 URL(`https://www.saucedemo.com/`)로 복귀 확인

### 3) 장바구니
- 상품 1개 추가(Add to cart) 후 `Remove` 버튼 노출 확인
- 장바구니 뱃지 숫자 `1` 업데이트 확인 (`.shopping_cart_badge`)

---

## Project Structure
├─ .github/
├─ tests/
│ ├─ helpers/
│ │ └─ auth.js # 공통 로그인 함수(loginstanduser)
│ └─ study.test.js # 로그인/로그아웃/장바구니 테스트
│ └─ checkoute2e.test.js #장바구니 1개 담고/로그아웃 테스트
├─ playwright.config.js
├─ package.json
├─ package-lock.json
└─ .gitignore
