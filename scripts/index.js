window.addEventListener('load', () => {
    /* -------------------------------- userData -------------------------------- */
    userData = userHandler.getUserData();
    /* ------------ checks if there is a user and if it is logged in ------------ */
    if (Object.keys(userData).length && userData.isLoggedIn) {
        (() => {
            navUl.innerHTML = personalizedNav(userData.name)
            const closeSession = document.getElementById('closeSession')
            closeSession.addEventListener('click', () => userHandler.signOut())
        })()
    }
    /* -------------------------------- listeners ------------------------------- */
    navCart.addEventListener('click', () => cart.showCart(relativeRoute, cartProductList, cartTotal))
    /* -------------------------------- functions ------------------------------- */
    // function that gets all the products
    function getAllProducts() {
        const endpoint = API_URL;
        const response = fetch(endpoint)
            .then(response => response.json())
            .then(data => data)
        return response;
    }

    // function that filters products on sale
    async function onSaleProducts() {
        const products = await getAllProducts()
        productsOnSale = products.filter((product) => product.isOnSale)
        productsOnSale.map((product) => onSaleSection.innerHTML += productCard(product))
        productsOnSale.forEach((product) => document.getElementById(`add${product.id}`)
            .addEventListener('click', () => cart.addToCart(product)))
    }
    onSaleProducts()

    // function that filters products in tendency
    async function tendencyProducts() {
        const products = await getAllProducts()
        const productsOnTendency = products.filter((product) => product.isTendency)
        productsOnTendency.map((product) => onTendency.innerHTML += productCard(product))
        productsOnTendency.forEach((product) => document.getElementById(`add${product.id}`)
            .addEventListener('click', () => cart.addToCart(product)))
    }
    tendencyProducts()
})