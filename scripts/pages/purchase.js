window.addEventListener('load', () => {
    /* -------------------------------- userData -------------------------------- */
    userData = userHandler.getUserData();
    /* ------------ checks if there is a user and if it is logged in ------------ */
    if (Object.keys(userData).length && userData.isLoggedIn) {
        (() => {
            navUl.innerHTML = personalizedNav(userData.name)
            cartNavDiv[0].remove() // remove cart from nav in purchase.html
            const closeSession = document.getElementById('closeSession')
            closeSession.addEventListener('click', () => userHandler.signOut())
        })()
    }
    /* -------------------------- check if cart exists -------------------------- */
    if (productsArray.length === 0) {
        location.replace('../index.html')
    } else {
        productsArray = JSON.parse(localStorage.getItem('cart'))
    }
    /* -------------------------------- listeners ------------------------------- */
    btnPurchase.addEventListener('click', finishPurchase)
    /* -------------------------------- functions ------------------------------- */
    // function that render products to purchase
    function renderProductsToPurchase() {
        let totalPrice = productsArray.reduce((acum, product) => acum += product.price * product.quantity, 0)
        productsArray.map((product) => {
            purchaseDiv.innerHTML += purchaseCard(product)
        })
        productsArray.forEach((product) => {
            document.getElementById(`btnMinus${product.id}`).addEventListener('click', () => cart.substractQuantity(product, relativeRoute, purchaseDiv, divTotal))
            document.getElementById(`btnPlus${product.id}`).addEventListener('click', () => cart.incrementQuantity(product, relativeRoute, purchaseDiv, divTotal))
            document.getElementById(`btnDelete${product.id}`).addEventListener('click', () => cart.removeCartProduct(product, relativeRoute, purchaseDiv, divTotal))
        })
        divTotal.innerHTML += totalPriceDisplay(totalPrice)
    }
    renderProductsToPurchase()

    function finishPurchase() {
        Swal.fire({
            title: 'Desea completar la compra?',
            text: "Esta accion es irreversible",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Comprar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Compra confirmada',
                    'Le enviaremos un mail con los detalles de su compra',
                    'success',
                ).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem('cart', '[]')
                        location.replace('../index.html')
                    }
                })
            }
        })
    }
})