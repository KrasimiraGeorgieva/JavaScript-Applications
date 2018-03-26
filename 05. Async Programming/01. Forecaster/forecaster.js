function attachEvents() {
    const baseUrl = 'https://judgetests.firebaseio.com/';
    $('#submit').click(loadForecast);

    function request(lastPartOfUrl){
        return $.ajax({
            method: 'GET',
            url: baseUrl + lastPartOfUrl
        })
    }

    function loadForecast() {
        request('locations.json')
            .then(getAllLocations)
            .catch(handleError);
    }
	
    function getAllLocations(arrData){
        let inputLocation = $('#location').val();
        let code = arrData.filter(loc => loc['name'] === inputLocation)
        .map(loc => loc['code'])[0];

        if(!code){
            handleError();
        }

        let todayForecast = request(`forecast/today/${code}.json`);
        let upcomingForecast = request(`forecast/upcoming/${code}.json`);

        Promise.all([todayForecast, upcomingForecast])
            .then(getAllForecastInfo)
            .catch(handleError)
    }

    function getAllForecastInfo([todayWeather, upcomingWeather]) {
        let weatherSymbols = {
           	'Sunny': '&#x2600;', // ☀
            'Partly sunny': '&#x26C5;', // ⛅
            'Overcast':	'&#x2601;', // ☁
            'Rain':	'&#x2614;', // ☂
            'Degrees': '&#176;'   // °
        };

        let forecast = $('#forecast');
        forecast.css('display', 'block');
        showCurrent(todayWeather, weatherSymbols);
        showUpcoming(upcomingWeather, weatherSymbols);
    }

    function showCurrent(todayWeather, weatherSymbols){
        let current = $('#current');
        current.empty();
        current
            .append($('<div class="label">Current conditions</div>'))
            .append($(`<span class="condition symbol">${weatherSymbols[todayWeather['forecast']['condition']]}</span>`))
            .append($('<span class="condition"></span>')
                .append($(`<span class="forecast-data">${todayWeather['name']}</span>`))
                .append($(`<span class="forecast-data">${todayWeather['forecast']['low']}&#176;/${todayWeather['forecast']['high']}&#176;</span>`))
                .append($(`<span class="forecast-data">${todayWeather['forecast']['condition']}</span>`)))
    }

    function showUpcoming(upcomingWeather, weatherSymbols) {
        let upcoming = $('#upcoming');
        upcoming.empty();
        upcoming.append($('<div class="label">Three-day forecast</div>'));
        let data = upcomingWeather['forecast'];
        for (let info of data) {
            upcoming
                .append($('<span class="upcoming"></span>')
                    .append($(`<span class="symbol">${weatherSymbols[info['condition']]}</span>`))
                    .append($(`<span class="forecast-data">${info['low']}&#176;/${info['high']}&#176;</span>`))
                    .append($(`<span class="forecast-data">${info['condition']}</span>`)))
        }
    }

    function handleError(){
        $('#forecast').css('display','block').text('Error');
    }
}
