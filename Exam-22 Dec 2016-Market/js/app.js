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

        // Shop Products Screen
        function displayProducts(ctx) {
            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            serviceMarket.getAllProducts()
                .then(function (products) {
                    products.forEach((p) => {
                        p.price = Number(p.price).toFixed(2);
                    });
                    ctx.products = products;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        product: './templates/shop/shopProduct.hbs',
                        allProductsForm: './templates/shop/allProductsForm.hbs'
                    }).then(function () {
                        this.partial('./templates/shop/allProductsPage.hbs')
                            .then(function () {
                                $('button').on('click', purchaseProduct)
                            });

                        function purchaseProduct() {
                            let productId = $(this).attr('data-id');
                            let userId = sessionStorage.getItem('userId');

                            serviceMarket.getProductById(productId).then(function (product) {

                                serviceMarket.getUser(userId).then(function (userInfo) {
                                    let cart;
                                    if (userInfo['cart'] === undefined) {
                                        cart = {};
                                    } else {
                                        cart = userInfo['cart'];
                                    }

                                    if (cart.hasOwnProperty(productId)) {
                                        cart[productId] = {
                                            quantity: Number(cart[productId]['quantity']) + 1,
                                            product: {
                                                name: product['name'],
                                                description: product['description'],
                                                price: product['price']
                                            }
                                        }
                                    } else {
                                        cart[productId] = {
                                            quantity: 1,
                                            product: {
                                                name: product['name'],
                                                description: product['description'],
                                                price: product['price']
                                            }
                                        }
                                    }

                                    userInfo.cart = cart;
                                    serviceMarket.updateCart(userInfo)
                                        .then(() => {
                                            notify.showInfo('Product purchased.');
                                            ctx.redirect('#/cart');
                                        });
                                });

                            });
                        }
                    });
                }).catch(notify.handleError);
        }

        // Cart Products Screen
        this.get('#/cart', displayProductsInCart);

        function displayProductsInCart(ctx) {
            ctx.isAuth = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            let userId = sessionStorage.getItem('userId');

            serviceMarket.getUser(userId).then(function (userInfo) {
                let cart = userInfo.cart;
                if (cart !== undefined) {
                    let products = [];
                    let keys = Object.keys(cart);

                    for (let id of keys) {
                        let product = {
                            _id: id,
                            name: cart[id]['product']['name'],
                            description: cart[id]['product']['description'],
                            quantity: cart[id]['quantity'],
                            totalPrice: (Number(cart[id]['quantity']) * Number(cart[id]['product']['price'])).toFixed(2)
                        };
                        products.push(product);
                    }

                    ctx.products = products;
                }
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    product: './templates/cart/productCart.hbs',
                    cartForm: './templates/cart/cartForm.hbs'
                }).then(function () {
                    this.partial('./templates/cart/cartPage.hbs')
                        .then(function () {
                            $('button').on('click', discardProduct)
                        });
                });
            }).catch(notify.handleError);


            function discardProduct() {
                let productId = $(this).attr('data-id');
                let userId = sessionStorage.getItem('userId');

                serviceMarket.getProductById(productId).then(function (product) {
                    serviceMarket.getUser(userId).then(function (userInfo) {
                        let cart = userInfo.cart;

                        let quantity = Number(cart[productId]['quantity']) - 1;
                        if (quantity === 0) {
                            delete cart[productId];
                        } else {
                            cart[productId]['quantity'] = quantity;
                        }
                        userInfo['cart'] = cart;

                        serviceMarket.updateCart(userInfo).then(function (userData) {
                            notify.showInfo('Product discarded.');
                            displayProductsInCart(ctx);
                        })
                    })
                })
            }
        }

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
    });

    app.run();
});