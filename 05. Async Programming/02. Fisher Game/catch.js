function attachEvents() {
    const BASE_URL = 'https://baas.kinvey.com/appdata/kid_BJoYaxK9G';
    const USERNAME = 'pesho';
    const PASSWORD = 'pesho';
    const AUTH_HEADERS = {
        'Authorization': 'Basic ' + (btoa(USERNAME + ":" + PASSWORD)),
        'Content-type': 'application/json'
    };

    $('.load').on('click', loadAll);
    $('.add').on('click', addCatch);

    // AJAX request
    function request(method, endpoint, data) {
        return $.ajax({
            method: method,
            url: BASE_URL + endpoint,
            headers: AUTH_HEADERS,
            data: JSON.stringify(data)
        })
    }

    // LIST all catches
    function loadAll() {
        request('GET', '/biggestCatches/')
            .then(displayAll)
            .catch(handleError);
    }

    function displayAll(data) {
        let catches = $('#catches');
        catches.empty();
        for (let el of data) {
            catches.append($(`<div class="catch" data-id="${el._id}">`)
                .append($('<label>').text('Angler'))
                .append($(`<input type="text" class="angler" value="${el['angler']}"/>`))
                .append($('<label>').text('Weight'))
                .append($(`<input type="number" class="weight" value="${el['weight']}"/>`))
                .append($('<label>').text('Species'))
                .append($(`<input type="text" class="species" value="${el['species']}"/>`))
                .append($('<label>').text('Location'))
                .append($(`<input type="text" class="location" value="${el['location']}"/>`))
                .append($('<label>').text('Bait'))
                .append($(`<input type="text" class="bait" value="${el['bait']}"/>`))
                .append($('<label>').text('Capture Time'))
                .append($(`<input type = "number" class="captureTime" value ="${el['captureTime']}"/>`))
                .append($('<button class="update" >Update</button>').on('click', updateCatch))
                .append($('<button class = "delete" >Delete</button>').on('click', deleteCatch)))
        }
    }
     // UPDATE a catch
    function updateCatch(){
        let catchEl = $(this).parent();
        let dataObj = createDataJson(catchEl);
        request('PUT', `/biggestCatches/${catchEl.attr('data-id')}`, dataObj)
            .then(loadAll)
            .catch(handleError);
    }

    // DELETE a catch
    function deleteCatch(){
        let catchId = $(this).parent().attr('data-id');
        request('DELETE', `/biggestCatches/${catchId}`)
            .then(loadAll)
            .catch(handleError);
    }

    // CREATE a catch
    function addCatch(){
        let catchEl = $('#addForm');
        let dataObj = createDataJson(catchEl);
        request('POST', '/biggestCatches/', dataObj)
            .then(loadAll)
            .catch(handleError)
    }

    function createDataJson(catchEl){
        return{
            angler: catchEl.find('.angler').val(),
            weight: Number(catchEl.find('.weight').val()), // +catchEl.find('.weight').val(),
            species: catchEl.find('.species').val(),
            location: catchEl.find('.location').val(),
            bait: catchEl.find('.bait').val(),
            captureTime: Number(catchEl.find('.captureTime').val()) // +catchEl.find('.captureTime').val()
        };
    }

    function handleError(err) {
        alert(`Error: ${err.statusText}`);
    }
}