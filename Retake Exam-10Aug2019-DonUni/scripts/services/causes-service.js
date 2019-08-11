let causesService = (() => {
    function getAllCauses () {
        let endpoint = `causes`;
        return remote.get('appdata', endpoint, 'kinvey')
    }

    function createCause (data) {
        return remote.post('appdata', 'causes', 'kinvey', data)
    }

    function getById (id) {
        let endpoint = `causes/${id}`;
        return remote.get('appdata', endpoint, 'kinvey')
    }

    function myListings (username) {
        let endpoint = `causes?query={"owner":"${username}"}&sort={"_kmd.ect": -1}`;
        return remote.get('appdata', endpoint, 'kinvey')
    }

    function deleteCause (id) {
        let endpoint = `causes/${id}`;
        return remote.remove('appdata', endpoint, 'kinvey')
    }

    function editCause (id, data) {
        let endpoint = `causes/${id}`;
        return remote.update('appdata', endpoint, 'kinvey', data)
    }

    return {
        getAllCauses,
        createCause,
        deleteCause,
        getById,
        editCause,
        myListings
    }
})();