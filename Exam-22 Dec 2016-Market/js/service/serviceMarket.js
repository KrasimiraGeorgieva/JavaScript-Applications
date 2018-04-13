let serviceMarket = (() => {
    function getAllProducts(){
        return remote.get('appdata', 'products', 'kinvey')
    }

    return{
        getAllProducts,
    }
})();