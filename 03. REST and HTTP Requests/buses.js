function getInfo() {
    let stopId = $('#stopId').val();
    let list = $('#buses');
    list.empty();
	
    /* Variant 1
    $.get(`https://judgetests.firebaseio.com/businfo/${stopId}.json`)
        .then(displayBusStopInfo)
        .catch(displayError);
    */

    // Variant 2
    let getRequest = {
        method: 'GET',
        url: `https://judgetests.firebaseio.com/businfo/${stopId}.json`,
        success: displayBusStopInfo,
        error: displayError
    };
    $.ajax(getRequest);

    function displayBusStopInfo (busStopInfo){
        $('#stopName').text(busStopInfo.name);
        let buses = busStopInfo.buses;
        for (let busId in buses) {
            let time = buses[busId];
            let liItem = $('<li>');
            liItem.text(`Bus ${busId} arrives in ${time} minutes`);
            list.append(liItem);
        }
    }

    function displayError(){
        $('#stopName').text('Error')
    }
}