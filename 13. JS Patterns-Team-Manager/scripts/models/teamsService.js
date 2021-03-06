let teamsService = (() => {
    function loadTeams() {
        // Request teams from db
        return requester.get('appdata', 'teams', 'kinvey');
    }

    function loadTeamDetails(teamId) {
        return requester.get('appdata', 'teams/' + teamId, 'kinvey');
    }

    function edit(teamId, name, description) {
        let teamData = {
            name: name,
            comment: description
        };

        return requester.update('appdata', 'teams/' + teamId, 'kinvey', teamData);
    }


    function deleteTeam(teamId){
        return requester.remove('appdata', 'teams/' + teamId, 'kinvey');
    }

    function createTeam(name, comment) {
        let teamData = {
            name: name,
            comment: comment
        };

        return requester.post('appdata', 'teams', 'kinvey', teamData);
    }


    function joinTeam(teamId) {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: teamId
        };

        return requester.update('user', sessionStorage.getItem('userId'), 'kinvey', userData);
    }

    function leaveTeam() {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: ''
        };
       return requester.update('user', sessionStorage.getItem('userId'), userData, 'kinvey');
    }


    return {
        loadTeams,
        loadTeamDetails,
        edit,
        deleteTeam,
        createTeam,
        joinTeam,
        leaveTeam
    }
})();