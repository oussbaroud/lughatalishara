// Logout Function
const logout = (request, response) => {
    // Clearing The Cookie
    response.clearCookie('userRegistered');
    
    // Redirecting To Manage Page
    response.redirect('/');
}

// Exporting Logout Function
module.exports = logout;