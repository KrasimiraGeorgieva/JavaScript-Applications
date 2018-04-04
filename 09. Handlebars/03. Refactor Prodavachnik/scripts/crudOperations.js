const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_B1R2vLpcG';
const APP_SECRET = '36cf4dd7e6c449ea88223aa8f0155c03';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function registerUser() {
    let form = $('#formRegister');
    let username = form.find('input[name="username"]').val().trim();
    let password = form.find('input[name="passwd"]').val().trim();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: {username, password},
        success: registerSuccess,
        error: handleAjaxError
    });

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listAdverts();
        showInfo('User registration successful.');
    }
}

function loginUser() {
    let form = $('#formLogin');
    let userData = {
        username: form.find('input[name="username"]').val(),
        password: form.find('input[name="passwd"]').val()
    };

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: userData,
        success: loginSuccess,
        error: handleAjaxError
    });

    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        listAdverts();
        showInfo('Login successful.');
    }
}

function listAdverts() {
    $('#ads').empty();
    showView('viewAds');
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/adverts',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        success: loadAdvertsSuccess,
        error: handleAjaxError
    });

    function loadAdvertsSuccess(adverts) {
        showInfo('Advertisements loaded.');
        if (adverts.length === 0) {
            $('#ads').text('No advertisements available.');
        } else {
            let advertsTable = $('<table>')
                .append($('<tr>').append(
                    '<th>Title</th>',
                    '<th>Description</th>',
                    '<th>Publisher</th>',
                    '<th>Date Published</th>',
                    '<th>Price</th>',
                    '<th>Actions</th>')
                );

            for (let advert of adverts) {
                let readMoreLink = $(`<a data-id="${advert._id}" href="#">[Read More]</a>`)
                    .on('click', function () {
                        displayAdvert($(this).attr("data-id"))
                    });
                let links = [readMoreLink];

                if (advert._acl.creator === sessionStorage['userId']) {
                    let deleteLink = $(`<a data-id="${advert._id}" href="#">[Delete]</a>`)
                        .on('click', function () {
                            deleteAdvert($(this).attr("data-id"))
                        });
                    let editLink = $(`<a data-id="${advert._id}" href="#">[Edit]</a>`)
                        .on('click', function () {
                            loadAdvertForEdit($(this).attr("data-id"))
                        });
                    links = [readMoreLink, ' ', deleteLink, ' ', editLink];
                }

                advertsTable.append($('<tr>').append(
                    $('<td>').text(advert.title),
                    $('<td>').text(advert.description),
                    $('<td>').text(advert.publisher),
                    $('<td>').text(advert.datePublished),
                    $('<td>').text(advert.price),
                    $('<td>').append(links)
                ));
            }

            $('#ads').append(advertsTable);
        }
    }
}

function createAdvert() {
    $.ajax({
        method: 'GET',
        url: `${BASE_URL}user/${APP_KEY}/${sessionStorage.getItem('userId')}`,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        success: afterPublisherRequest,
        error: showError
    });

    function afterPublisherRequest(publisher) {
        let form = $('#formCreateAd');
        let advertData = {
            title: form.find('input[name="title"]').val().trim(),
            description: form.find('textarea[name="description"]').val().trim(),
            publisher: publisher.username,
            datePublished: form.find('input[name="datePublished"]').val().trim(),
            price: Number(form.find('input[name="price"]').val().trim()),
            image: form.find('input[name="image"]').val().trim()
        };

        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY + '/adverts',
            headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
            data: advertData,
            success: createAdvertSuccess,
            error: handleAjaxError
        });

        function createAdvertSuccess() {
            listAdverts();
            showInfo('Advertisement created.');
        }
    }
}

function loadAdvertForEdit(advertId) {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/adverts/' + advertId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        success: loadAdvertForEditSuccess,
        error: handleAjaxError
    });

    function loadAdvertForEditSuccess(advert) {
        let form = $('#formEditAd');
        form.find('input[name="id"]').val(advert._id);
        form.find('input[name="title"]').val(advert.title);
        form.find('input[name="publisher"]').val(advert.publisher);
        form.find('textarea[name="description"]').val(advert.description);
        form.find('input[name="datePublished"]').val(advert.datePublished);
        form.find('input[name="price"]').val(advert.price);
        form.find('input[name="image"]').val(advert.image);
        showView('viewEditAd');
    }
}

function displayAdvert(advertId){
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/adverts/' + advertId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        success: displayAdvertSuccess,
        error: handleAjaxError
    });

    $('#viewDetailsAd').empty();

    function displayAdvertSuccess(advert) {
        let advertInfo = $('<div>').append(
            $('<img>').attr("src", advert.image),
            $('<br>'),
            $('<label>').text('Title:'),
            $('<h1>').text(advert.title),
            $('<label>').text('Description:'),
            $('<p>').text(advert.description),
            $('<label>').text('Publisher:'),
            $('<div>').text(advert.publisher),
            $('<label>').text('Date:'),
            $('<div>').text(advert.datePublished));

        $('#viewDetailsAd').append(advertInfo);

        showView('viewDetailsAd');
    }
}

function editAdvert() {
    let form = $('#formEditAd');
    let id = form.find('input[name="id"]').val();

    let advertData = {
        title: form.find('input[name="title"]').val().trim(),
        description: form.find('textarea[name="description"]').val().trim(),
        publisher: form.find('input[name="publisher"]').val().trim(),
        datePublished: form.find('input[name="datePublished"]').val().trim(),
        price: form.find('input[name="price"]').val().trim(),
        image: form.find('input[name="image"]').val().trim()
    };

    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/adverts/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: advertData,
        success: editAdvertSuccess,
        error: handleAjaxError
    });

    function editAdvertSuccess() {
        listAdverts();
        showInfo('Advertisement edited.');
    }
}

function deleteAdvert(advertId) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/adverts/' + advertId,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        success: deleteBookSuccess,
        error: handleAjaxError
    });

    function deleteBookSuccess() {
        listAdverts();
        showInfo('Advert deleted.');
    }
}

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text("");
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');
}

function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
    $('#loggedInUser').text("Welcome, " + username + "!");
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}