$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');
        this.get('index.html', displayHome);
        this.get('#/home', displayHome);
        this.get('#/about', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/about/about.hbs');
            })
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
                    auth.showInfo('Successfully logged in!');
                    displayHome(ctx);
                }).catch(auth.handleError)
        });

        //Logout
        this.get('#/logout', function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showInfo('Successfully logged out!');
                    displayHome(ctx);
                })
                .catch(auth.handleError);
        });

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
            let repeatPassword = ctx.params.repeatPassword;

            if (password !== repeatPassword) {
                auth.showError('Passwords mismatch!')
            } else {
                auth.register(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);
                        auth.showInfo('Successfully registered!');
                        displayHome(ctx);
                    }).catch(auth.handleError());
            }
        });

        // Catalog - show all teams
        this.get('#/catalog', displayCatalog);

        // CREATE team
        // GET
        this.get('#/create', function (ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function () {
                this.partial('./templates/create/createPage.hbs');
            });
        });
        // POST
        this.post('#/create', function (ctx) {
            let teamName = ctx.params.name;
            let teamComment = ctx.params.comment;

            teamsService.createTeam(teamName, teamComment)
                .then(function (teamInfo) {
                    teamsService.joinTeam(teamInfo._id)
                        .then(function (userInfo) {
                            auth.saveSession(userInfo);
                            auth.showInfo(`Team "${teamName}" created!`);
                            displayCatalog(ctx);
                        })
                        .catch(auth.handleError);
                })
                .catch(auth.handleError);
        });

        // READ team - show team details
        this.get('#/catalog/:id', function (ctx) {
            let teamId = ctx.params.id.substr(1);

            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo) {
                    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
                    ctx.username = sessionStorage.getItem('username');
                    ctx.teamId = teamId;
                    ctx.name = teamInfo.name;
                    ctx.comment = teamInfo.comment;
                    ctx.isOnTeam = teamInfo._id === sessionStorage.getItem('teamId');
                    ctx.members = ctx.isOnTeam;
                    ctx.isAuthor = teamInfo._acl.creator === sessionStorage.getItem('userId');

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        teamMember: './templates/catalog/teamMember.hbs',
                        teamControls: './templates/catalog/teamControls.hbs'
                    }).then(function () {
                        this.partial('./templates/catalog/details.hbs');
                    })
                }).catch(auth.handleError);
        });

        // Join team by id
        this.get('#/join/:id', function (ctx) {
            let teamId = ctx.params.id.substr(1);

            teamsService.joinTeam(teamId)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Team was joined!');
                    displayCatalog(ctx);
                }).catch(auth.handleError);
        });

        //Leave team
        this.get('#/leave', function (ctx) {
            teamsService.leaveTeam()
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Team was left!');
                    displayCatalog(ctx);
                }).catch(auth.handleError);
        });

        // EDIT by id
        // GET
        this.get('#/edit/:id', function (ctx) {
            let teamId = ctx.params.id.substr(1);
			
            teamsService.loadTeamDetails(teamId)
                .then(function (teamInfo) {
                    ctx.teamId = teamId;
                    ctx.name = teamInfo.name;
                    ctx.comment = teamInfo.comment;

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        editForm: './templates/edit/editForm.hbs'
                    }).then(function () {
                        this.partial('./templates/edit/editPage.hbs');
                    })
                }).catch(auth.handleError);
        });
        // POST
        this.post('#/edit/:id', function (ctx) {
            let teamId = ctx.params.id.substr(1);
            let teamName = ctx.params.name;
            let teamComment = ctx.params.comment;

            teamsService.edit(teamId, teamName, teamComment)
                .then(function () {
                    auth.showInfo(`Team ${teamName} was edited!`);
                    displayCatalog(ctx);
                }).catch(auth.handleError);
        });

        // DELETE team by id
        this.get('#/delete/:id', function (ctx) {
            let teamId = ctx.params.id.substr(1);

            teamsService.deleteTeam(teamId)
                .then(function () {
                    auth.showInfo('Team deleted!');
                    ctx.redirect('#/catalog');
                }).catch(auth.handleError);
        });

        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/home/home.hbs');
            });
        }

        function displayCatalog(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
			
            teamsService.loadTeams()
                .then(function (teams) {
                    ctx.hasTeam = sessionStorage.getItem('teamId') !== null;
                    ctx.hasNoTeam = sessionStorage.getItem('teamId') === null
                        || sessionStorage.getItem('teamId') === "undefined";
                    ctx.teams = teams;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        team: './templates/catalog/team.hbs'
                    }).then(function () {
                        this.partial('./templates/catalog/teamCatalog.hbs');
                    })
                })
        }

    });

    app.run();
});