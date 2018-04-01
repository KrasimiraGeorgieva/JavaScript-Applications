function attachEvents() {
    // Bind the navigation menu links
    $("#linkHome").on('click', showHomeView);
    $("#linkLogin").on('click', showLoginView);
    $("#linkRegister").on('click', showRegisterView);
    $("#linkListAds").on('click', listAdverts);
    $("#linkCreateAd").on('click', showCreateAdView);
    $("#linkLogout").on('click', logoutUser);

    // Bind the form buttons
    $("#buttonLoginUser").on('click', loginUser);
    $("#buttonRegisterUser").on('click',registerUser);
    $("#buttonCreateAd").on('click', createAdvert);
    $("#buttonEditAd").on('click', editAdvert);
    $("form").on('click', function(event) { event.preventDefault() });

    // Bind the info / error boxes
    $("#infoBox, #errorBox").on('click', function() {
        $(this).fadeOut();
    });

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });
}
