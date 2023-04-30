describe('My Login application', () => {
  const username = `tomsmith-${Date.now()}`;
  const badPassword = '123456';
  const password = 'SuperSecretPassword!123';

  it('should signup with valid credentials', async () => {
    await browser.url(`http://localhost:8080/pages/signup.html`);
    await $('#username').setValue(username);

    await $('#password').setValue(badPassword);
    await $('#submit').click();
    await expect($('#status')).toBeExisting();
    await expect($('#status')).toHaveTextContaining(/password length must be longer/);

    await $('#password').setValue(password);
    await $('#submit').click();
    await expect($('#loginLabel')).toBeExisting();
    await expect($('#loginLabel')).toHaveTextContaining(/You are logged in/);
  });

  it('should fail signup on same username', async () => {
    await browser.url(`http://localhost:8080/pages/signup.html`);

    await $('#username').setValue(username);
    await $('#password').setValue(password);
    await $('#submit').click();

    await expect($('#status')).toBeExisting();
    await expect($('#status')).toHaveTextContaining(/username already exist/);
  });

  it('should fail login with wrong credentials', async () => {
    await browser.url(`http://localhost:8080/pages/login.html`);

    await $('#username').setValue(username);
    await $('#password').setValue(badPassword);
    await $('#submit').click();

    await expect($('#status')).toBeExisting();
    await expect($('#status')).toHaveTextContaining(/Invalid username/);
  });

  it('should login with registered credentials', async () => {
    await browser.url(`http://localhost:8080/pages/login.html`);

    await $('#username').setValue(username);
    await $('#password').setValue(password);
    await $('#submit').click();

    await expect($('#loginLabel')).toBeExisting();
    await expect($('#loginLabel')).toHaveTextContaining(/You are logged in/);
  });
});
