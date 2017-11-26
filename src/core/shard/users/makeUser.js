'user strict';

const makeUser = (mercuryId, password, email, displayName) => {
    return {
        mercuryId,
        password,
        email,
        displayName
    };
}

module.exports = {
    makeUser
};