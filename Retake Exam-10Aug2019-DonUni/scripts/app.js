 const handlers = {};

$(() => {
  const app = Sammy ('#container', function () {
    this.use('Handlebars', 'hbs');

    this.get('index.html', handlers.getHome);
    this.get('#/home', handlers.getHome);

    this.get('#/register', handlers.getRegister);
    this.get('#/login', handlers.getLogin);
    this.post('#/register', handlers.registerUser);
    this.get('#/homeLogged', handlers.getHomeLogged);
    this.post('#/login', handlers.loginUser);
    this.get('#/logout', handlers.logout);

    this.get('#/causes/all', handlers.getAll);
    this.get('#/create', handlers.getCreate);
    this.post('#/create', handlers.createListing);

    this.get('#/details/:id', handlers.getDetails);

    this.get('#/delete/:id', handlers.getDelete);
    this.post('#/delete/:id', handlers.deleteCause);

    this.post('#/details/:id', handlers.editCause);
  });
  app.run('#/home');
});