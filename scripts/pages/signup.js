window.addEventListener('load', () => {
    /* -------------------------------- listeners ------------------------------- */
    signupButton.addEventListener('click', (e) => userHandler.signUp(e))
    /* since the info of the user is stored in localStorage (to be able to log in even if the session is ended)
    to delete the information localStorage.removeItem('userData') must be run in the console of the browser */
})