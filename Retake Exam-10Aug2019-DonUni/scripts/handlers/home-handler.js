handlers.getHome = function (ctx) {
    ctx.loadPartials({
        header: './template/common/header.hbs',
        footer: './template/common/footer.hbs',
        homePartial: './template/homePartial.hbs'
    }).then(function () {
        this.partial('./template/welcome.hbs')
    })
};

handlers.getLogin = function (ctx) {
    ctx.loadPartials({
        header: './template/common/header.hbs',
        footer: './template/common/footer.hbs'
    }).then(function () {
        this.partial('./template/forms/login.hbs')
    })
};

handlers.getRegister = function (ctx) {
    ctx.loadPartials({
        header: './template/common/header.hbs',
        footer: './template/common/footer.hbs'
    }).then(function () {
        this.partial('./template/forms/register.hbs')
    })
};

handlers.getHomeLogged = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: './template/common/header.hbs',
        footer: './template/common/footer.hbs',
        homePartial: './template/homePartial.hbs'
    }).then(function () {
        this.partial('./template/logged.hbs')
    })
};

handlers.getAll = function (ctx){
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');

    causesService.getAllCauses().then((causes) => {
        ctx.causes = causes;
        ctx.isAuth = auth.isAuth();
        ctx.username = sessionStorage.getItem('username');
        if (causes.length === 0) {
            ctx.noCauses = true
        } else {
            ctx.Causes = false
        }

        ctx.loadPartials({
            causePartial: './template/causes/causePartial.hbs',
            header: './template/common/header.hbs',
            footer: './template/common/footer.hbs'
        }).then(function () {
            this.partial('./template/causes/listings.hbs')
        })
    })
};

handlers.getCreate = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    ctx.loadPartials({
        header: './template/common/header.hbs',
        footer: './template/common/footer.hbs'
    }).then(function () {
        this.partial('./template/forms/create.hbs')
    })
};

handlers.createListing = function (ctx) {
    ctx.username = sessionStorage.getItem('username');
    ctx.auth = auth.isAuth();
    //let {cause, pictureUrl, neededFunds, description, donors = '', collectedFunds = 0} = ctx.params;
    let cause =  ctx.params.cause;
    let pictureUrl = ctx.params.pictureUrl;
    let neededFunds = ctx.params.neededFunds;
    let description = ctx.params.description;
    let owner = sessionStorage.getItem('username');
    let donors = '';
    let collectedFunds = 0;

    if (cause.length === '' || pictureUrl.length === '' || neededFunds.length === '' || description === '') {
        notify.showError('All fields should be non-empty!');
    } else if(isNaN(neededFunds)){
        notify.showError('Needed funds must be number!');
    }else {
        causesService.createCause({cause, pictureUrl, neededFunds, description, donors, collectedFunds,
         owner}).then(() => {
            notify.showInfo('Cause created');
            ctx.redirect('#/causes/all');
        })
    }
};

handlers.getDetails = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;

    causesService.getById(id).then((cause) => {
        ctx.isAuth = auth.isAuth();
        ctx.username = sessionStorage.getItem('username');
        ctx.cause = cause;
        if (cause.owner === ctx.username) {
            ctx.mine = true
        } else {
            ctx.mine = false
        }
        ctx.loadPartials({
            header: './template/common/header.hbs',
            footer: './template/common/footer.hbs'
        }).then(function () {
            this.partial('./template/causes/details.hbs')
        })
    })
};

handlers.getDelete = function (ctx){
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;

    causesService.getById(id).then((cause) => {
        ctx.auth = auth.isAuth();
        ctx.cause = cause;
        ctx.username = sessionStorage.getItem('username')

        ctx.loadPartials({
            header: './template/common/header.hbs',
            footer: './template/common/footer.hbs'
        }).then(function () {
            this.partial('./template/causes/delete.hbs')
        })
    })
};

handlers.deleteCause = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');
    let id = ctx.params.id;
    causesService.deleteCause(id).then(() => {
        notify.showInfo('Cause deleted.');
        ctx.redirect('#/causes/all')
    })
};

handlers.editCause = function (ctx) {
    let id = ctx.params.id;
    causesService.getById(id).then((data) => {
        let cause = data.cause;
        let pictureUrl = data.pictureUrl;
        let neededFunds = data.neededFunds;
        let description = data.description;
        let donors;
        if (data.donors === ''){
            donors = sessionStorage.getItem('username');
        } else{
            donors = data.donors.concat(' ' + sessionStorage.getItem('username'));
        }
        let collectedFunds = (Number(data.collectedFunds) + Number(ctx.params.currentDonation));
        let owner = data.owner;
        causesService.editCause(id, {cause, pictureUrl, neededFunds, description, donors, collectedFunds, owner}).then(() => {
            notify.showInfo('Cause has been changed');
            ctx.redirect('#/causes/all');
        })
    })
};
