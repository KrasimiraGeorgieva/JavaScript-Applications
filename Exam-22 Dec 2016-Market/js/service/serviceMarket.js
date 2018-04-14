let serviceMarket = (() => {
    function getAllProducts(){
        return remote.get('appdata', 'products', 'kinvey')
    }

    function getProductById(productId){
        const endpoint = `products/${productId}`;
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getUser(userId){
        return remote.get('user', userId, 'kinvey');
    }

    function updateCart(userData) {
        let endPoint = sessionStorage.getItem('userId');
        return remote.update('user', endPoint, 'kinvey', userData)
    }

    return{
        getAllProducts,
        getProductById,
        getUser,
        updateCart
    }
})();