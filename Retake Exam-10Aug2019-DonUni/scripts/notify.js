let notify = (() => {
    $(document).on({
      ajaxStart: () => $('#loadingNotification').show(),
      ajaxStop: () => $('#loadingNotification').fadeOut()
    })
    function showInfo (message) {
      let infoBox = $('#successNotification')
      infoBox.find('span').text(message)
      infoBox.fadeIn()
      setTimeout(() => infoBox.fadeOut(), 3000)
    }
  
    function showError(message) {
      let errorBox = $('#errorNotification')
      errorBox.find('span').text(message)
      errorBox.fadeIn()
      setTimeout(() => errorBox.fadeOut(), 3000)
    }
  
    function handleError (reason) {
      showError(reason.responseJSON.description)
    }
  
    return {
      showInfo,
      showError,
      handleError
    }
  })()