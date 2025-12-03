export class LoginPage{
    constructor(page){
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button',{name : 'Login'});
    };
    async goto() {
        await this.page.goto('/');
    };
    async login(id,pw){
        await this.usernameInput.fill(id);
        await this.passwordInput.fill(pw);
        await this.loginButton.click();
    };
}
