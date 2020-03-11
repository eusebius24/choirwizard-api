function makeUsersArray() {
    return [
        {
            id: 1,
            fullname: "Ralph Vaughan Williams",
            username: "ralph@vw.co.uk",
            password: 'secret'
        },
        {
            id: 2,
            fullname: "Georg Friedrich Handel",
            username: "handel@royalopera.co.uk",
            password: 'secret'
        }
    ]
}

module.exports = {
    makeUsersArray
}