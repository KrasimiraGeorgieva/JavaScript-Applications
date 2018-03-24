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
            generateLi(res[key].name, res[key].phone, key);
        }
    }
}

function handleError(err) {
    console.log(err);
}

function postData() {
    let name = person.val();
    let phoneVal = phone.val();
    let postData = JSON.stringify({'name': name, 'phone': phoneVal});

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
        .append($('<a href="#">[Delete]</a>')
            .click(function () {
                $.ajax({
                    method: 'DELETE',
                    url: URL + '/' + key + '.json'
                }).then(() => $(li).remove())
                    .catch(handleError)
            }));
    $('#phonebook').append(li)
}