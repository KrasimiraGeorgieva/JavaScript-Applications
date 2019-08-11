let auth = (() => {
    function isAuth () {
      return sessionStorage.getItem('authtoken') !== null;
    }
  
    // save session
    function saveSession (userData) {
      sessionStorage.setItem('authtoken', userData._kmd.authtoken);
      sessionStorage.setItem('username', userData.username);
      sessionStorage.setItem('userId', userData._id);
    }
  
    // register user
    function register (username, password) {
      let obj = { username, password };
      return remote.post('user', '', 'basic', obj);
    }
  
    // login user
    function login (username, password) {
      let obj = { username, password };
      return remote.post('user', 'login', 'basic', obj);
    }
  
    // logout user
    function logout () {
      return remote.post('user', '_logout', 'kinvey');
    }
  
    return {
      isAuth,
      login,
      logout,
      register,
      saveSession
    }
})();