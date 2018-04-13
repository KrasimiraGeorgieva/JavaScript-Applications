$(() => {
    const app = Sammy('#app', function () {
        this.use('Handlebars', 'hbs');

        // HomePage
        this.get('market.html', displayHome);
        this.get('#/home', displayHome);

        // Register
        // GET
        this.get('#/register', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs');
            });
        });
        // POST
        this.post('#/register', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let name = ctx.params.name;

            auth.register(username, password, name)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notify.showInfo('User registration successful.');
                    displayHome(ctx);
                }).catch(notify.handleError);
        });

        // Login
        // GET
        this.get('#/login', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs');
            });
        });
        // POST
        this.post('#/login', function (ctx) {
            let username = this.params.username;
            let password = this.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notify.showInfo('Login successful.');
                    displayHome(ctx);
                }).catch(notify.handleError)
        });

        //Logout
        this.get('#/logout', function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    notify.showInfo('Successfully logged out!');
                    displayHome(ctx);
                })
                .catch(notify.handleError);
        });

        // List all products
        this.get('#/shop', displayProducts);

        function displayHome(ctx) {
            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                home: './templates/home/home.hbs'
            }).then(function () {
                this.partial('./templates/home/homePage.hbs');
            });
        }

        function displayProducts(ctx){
            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
        }


    });
    app.run();
});