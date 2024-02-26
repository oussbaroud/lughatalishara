const logout = (request, response) => {
    response.clearCookie('userRegistered');
    response.redirect('/');
}

module.exports = logout;