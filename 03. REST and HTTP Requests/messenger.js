function attachEvents() {
    $('#refresh').click(attachRefresh);
    $('#submit').click(sendMessage);

    function sendMessage() {
        let messageJson = {
            "author": $('#author').val(),
            "content": $('#content').val(),
            "timestamp": Date.now()
        };

        let sendMessageRequest = {
            method: 'POST',
            url: 'https://messenger-94b75.firebaseio.com/messenger/.json',
            data: JSON.stringify(messageJson),
            success: attachRefresh
        };

        $.ajax(sendMessageRequest)
    }

    function attachRefresh() {
        $.get('https://messenger-94b75.firebaseio.com/messenger/.json')
            .then(showMessages);
    }

    function showMessages(messages) {
        let output = $('#messages');
        output.empty();
        let messagesStr = '';
        for (let key in messages) {
            messagesStr += `${messages[key]["author"]}: ${messages[key]["content"]}\n`
        }
        output.text(messagesStr)
    }
}
