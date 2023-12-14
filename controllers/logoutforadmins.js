const logout = (request, response) => {
    response.clearCookie('adminRegistered');
    response.redirect('/manage');
}

module.exports = logout;