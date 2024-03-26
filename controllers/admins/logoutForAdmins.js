// Logout Function
const logout = (request, response) => {
    // Clearing The Cookie
    response.clearCookie('adminRegistered');

    // Redirecting To Manage Page
    response.redirect('/manage');
}

// Exporting Logout Function
module.exports = logout;