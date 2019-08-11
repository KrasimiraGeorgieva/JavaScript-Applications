let remote = (() => {
  const BASE_URL = 'https://baas.kinvey.com/';
  const APP_KEY = 'kid_r1TyiRj7B'; // APP KEY HERE
  const APP_SECRET = 'fb9ff190f0134396a65506f90cf1687e';  // APP SECRET HERE

  // Creates the authentication header
  function makeAuth (auth) {
    if (auth === 'basic') {
      return `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`;
    } else {
      return `Kinvey ${sessionStorage.getItem('authtoken')}`;
    }
  }

  // Creates request object to kinvey

  // request method (GET, POST, PUT)
  // kinvey module (user/appdata)
  // url endpoint
  // auth
  function makeRequest (method, module, endpoint, auth) {
    return {
      url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
      method: method,
      headers: {
        'Authorization': makeAuth(auth)
      }
    }
  }

  // Function to return GET promise
  function get (module, endpoint, auth) {
    return $.ajax(makeRequest('GET', module, endpoint, auth));
  }

  // Function to return POST promise
  function post (module, endpoint, auth, data) {
    let obj = makeRequest('POST', module, endpoint, auth);
    if (data) {
        obj.data = data;
    }
    return $.ajax(obj);
  }

  // Function to return PUT promise
  function update (module, endpoint, auth, data) {
    let obj = makeRequest('PUT', module, endpoint, auth);
    obj.data = data;
    return $.ajax(obj);
  }

  // Function to return DELETE promise
  function remove (module, endpoint, auth) {
    return $.ajax(makeRequest('DELETE', module, endpoint, auth));
  }

  return {
    get,
    post,
    update,
    remove
  }
})();