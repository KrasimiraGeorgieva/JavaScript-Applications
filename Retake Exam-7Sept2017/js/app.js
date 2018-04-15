$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        // Login page
        this.get('#/login', getWelcomePage);
        this.get('chirper.html', getWelcomePage);

        this.post('#/login', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;

            if (username.length === 0 || password.length === 0) return;

            auth.login(username, password).then((data) => {
                auth.saveSession(data);
                ctx.redirect('#/feeds');
            }).catch((reason) => {
                notify.handleError(reason);
            }).always(() => {
                $(ctx.target).find('input[type="submit"]').prop('disabled', false);
            });
        });

        // Register page
        this.get('#/register', function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/forms/registerForm.hbs');
            });
        });
        this.post('#/register', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeat = ctx.params.repeatPass;

            if (username.length < 5) {
                notify.showError('Username must be at least 5 characters long');
            } else if (password.length === 0 || repeat.length === 0) {
                notify.showError('Password cannot be empty');
            } else if (password !== repeat) {
                notify.showError("Passwords mismatch");
            } else {
                auth.register(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('User registration successful!');
                        ctx.redirect('#/feeds');
                    }).catch(
                    notify.handleError
                );
            }
        });


        function getWelcomePage() {
            if (auth.isAuth()) {
                this.redirect('#/feeds');
                return;
            }
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./templates/forms/loginForm.hbs');
            });
        }
    });

    app.run();
});