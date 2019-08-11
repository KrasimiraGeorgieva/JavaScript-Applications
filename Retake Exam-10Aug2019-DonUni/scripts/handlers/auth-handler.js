handlers.registerUser = function (ctx) {
     const username = ctx.params.username;
     const password = ctx.params.password;
     const rePassword = ctx.params.rePassword;

    if (password.length === 0 || username === 0) {
        notify.showError('Fields must be non-empty!');
     } else if (password !== rePassword) {
        notify.showError('Both passwords must match!')
     } else {
    auth.register(username, password)
        .then((userData) => {
            auth.saveSession(userData)
            notify.showInfo('User registration successful.')
            ctx.redirect('#/homeLogged')
        })
        .catch(notify.handleError)
    }
};

handlers.logout = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear()
            notify.showInfo('Logout successful.')
            ctx.redirect('#/home')
        })
};

handlers.loginUser = function (ctx) {
    let {username, password} = ctx.params;
    if (username === '' || password === '') {
        notify.showError('All fields should be non-empty!');
    } else {
    auth.login(username, password)
        .then((userData) => {
            auth.saveSession(userData)
            notify.showInfo('Login successful.')
            ctx.redirect('#/homeLogged')
        })
        .catch(notify.handleError)
    }
};