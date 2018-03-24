function attachEvents() {
    const URL = 'https://phonebook-658a8.firebaseio.com/phonebook';
    const person = $('#person');
    const phone = $('#phone');

    $('#btnLoad').on('click', LoadData);
    $('#btnCreate').on('click', postData);

    function LoadData() {
        $('#phonebook').empty();
        $.ajax({
            method: 'GET',
            url: URL + '.json',
        }).then(handleSuccess)
            .catch(handleError);

        function handleSuccess(res) {
            for (let key in res) {
                generateLi(res[key].person, res[key].phone, key);
            }
        }
    }

    function handleError() {
        $('#phonebook')
            .append($('<li>')
                .text('ERROR'));
    }

    function postData() {
        let name = person.val();
        let phoneVal = phone.val();
        let postData = JSON.stringify({'person': name, 'phone': phoneVal});

        if($('#person').val() === '' || $('#phone').val() === '') return;

        $.ajax({
            method: 'POST',
            url: URL + '.json',
            data: postData,
            success: appendElement,
            error: handleError
        });
        function appendElement(res){
            generateLi(name, phoneVal, res.name);
        }
        person.val('');
        phone.val('');
    }

    function generateLi(name, phone, key) {
        let li = $(`<li>${name}: ${phone} </li>`)
            .append($('<button>[Delete]</button>')
                .click(function () {
                    $.ajax({
                        method: 'DELETE',
                        url: URL + '/' + `${key}` + '.json'
                    }).then(() => $(li).remove())
                        .catch(handleError)
                }));
        $('#phonebook').append(li)
    }
}