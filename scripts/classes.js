/* ------------------------------ Product class ----------------------------- */
class Product {
    // constructor
    constructor(id, name, price, category, picture, isOnSale, isTendency, stock) {
        this.id = id;
        this.name  = name;
        this.price = price;
        this.category = category;
        this.picture = picture;
        this.isOnSale = isOnSale;
        this.isTendency = isTendency;
        this.stock = stock;
        this.quantity = 1;
    }
}

/* ------------------------------- Cart class ------------------------------- */
class Cart {
    // constructor 
    constructor() {}
    // method that adds product to cart
    addToCart = (product) => {
        let newProduct = new Product(product.id, product.name, product.price, product.category, product.picture, product.isOnSale, product.isTendency, product.stock)
        let productExists = productsArray.find((productInArray) => productInArray.id === newProduct.id)
        if(!productExists) {
            productsArray.push(newProduct)
            localStorage.setItem('cart', JSON.stringify(productsArray))
        } else {
            productExists.quantity++
            localStorage.setItem('cart', JSON.stringify(productsArray))
        }
    }
    // method that renders cart in modal
    showCart = (route, divCartProducts, divTotalPrice) => {
        let totalPrice = productsArray.reduce((acum, product) => acum += product.price*product.quantity, 0)
        if(productsArray.length!==0) {
            divCartProducts.innerHTML = ''
            productsArray.map((product) => {
                divCartProducts.innerHTML += `
                <div class="card mb-3" id="card${product.id}">
                    <div class="row g-0">
                        <div class="col-md-3">
                            <img src="${route}${product.picture}" class="img-fluid rounded-start modal-img" alt="...">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body cart-body" id="cardBody${product.id}">
                                <h5 class="card-title cart-title">${product.name.toUpperCase()}</h5>
                                <p class="card-text cart-price">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(product.price*product.quantity)}</p>
                                <div class="d-flex card-buttons">
                                    <button type="button" class="btn btn-primary btn-sm btn-minus" id="btnMinus${product.id}"><i class="fas fa-minus"></i></button>
                                    <p class="card-text d-flex"><small class="align-self-center quantity">${product.quantity}</small></p>
                                    <button type="button" class="btn btn-primary btn-sm btn-plus" id="btnPlus${product.id}"><i class="fas fa-plus"></i></button>
                                    <p class="card-text d-flex"><small class="align-self-center stock-avaliable">${product.stock} disponibles</small></p>
                                    <button type="button" class="btn btn-primary btn-sm btn-delete ms-auto" id="btnDelete${product.id}"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `})
            productsArray.forEach((product) => {
                document.getElementById(`btnMinus${product.id}`).addEventListener('click', () => this.substractQuantity(product, route, divCartProducts, divTotalPrice))
                document.getElementById(`btnPlus${product.id}`).addEventListener('click', () => this.incrementQuantity(product, route, divCartProducts, divTotalPrice))
                document.getElementById(`btnDelete${product.id}`).addEventListener('click', () => this.removeCartProduct(product, route, divCartProducts, divTotalPrice))
            })
            divTotalPrice.innerHTML = `
                <p class="total-cart">Total</p>
                <p class="total-price-cart">$${new Intl.NumberFormat("de-DE", {minimumFractionDigits: '2'}).format(totalPrice)}</p>
            `
        } else {
            divCartProducts.innerHTML = 'El carrito se encuentra vacío'
            divTotalPrice.innerHTML = ''
        }
    }
    // method that decreses quantity by one
    substractQuantity = (product, relativeRoute, divCartProducts, divTotalPrice) => {
        let productInStorage = productsArray.find((productInStorage) => productInStorage.id === product.id)
        if(productInStorage.quantity > 1) {
            productInStorage.quantity--
            localStorage.setItem('cart', JSON.stringify(productsArray))
        }
        this.showCart(relativeRoute, divCartProducts, divTotalPrice)
    }
    // method that increases quantity by one
    incrementQuantity = (product, relativeRoute, divCartProducts, divTotalPrice) => {
        let productInStorage = productsArray.find((productInStorage) => productInStorage.id === product.id)
        if(productInStorage.quantity < productInStorage.stock) {
            productInStorage.quantity++
            localStorage.setItem('cart', JSON.stringify(productsArray))
            this.showCart(relativeRoute, divCartProducts, divTotalPrice)
        }
        if(productInStorage.quantity === product.stock) {
            document.getElementById(`btnPlus${product.id}`).setAttribute('disabled', '')
        }
    }
    // method that deletes product from cart
    removeCartProduct = (product, relativeRoute, divCartProducts, divTotalPrice) => {
        let productIndex = productsArray.findIndex((productInStorage) => productInStorage.id === product.id)
        productsArray.splice(productIndex, 1)
        localStorage.setItem('cart', JSON.stringify(productsArray))
        this.showCart(relativeRoute, divCartProducts, divTotalPrice)
    }
}

/* ----------------------------- Validator class ---------------------------- */
class Validator {
    // constructor
    constructor(){}
    // method that checks if password repeats correctly
    passwordRepeats = (form ,pass, passConfirm) => {
        let passRepeats = true
        const pwrdMsjError = document.createElement('p')
        pwrdMsjError.classList.add('passMsjError')
        pwrdMsjError.innerHTML = '*las contraseñas no coinciden, intente nuevamente'
        if (pass.value !== passConfirm.value) {
            if (!form.querySelector('.passMsjError')) {
                form.appendChild(pwrdMsjError)
            }
        } else if ((pass.value === passConfirm.value) && document.querySelector('.passMsjError')) {
            document.querySelector('.passMsjError').remove()
            passRepeats = false
        } else {
            passRepeats = false
        }
        return passRepeats
    }
    // method that checks that there be no empy fields
    checkEmptyFields = (name, email, pass, passConfirm) => {
        let emptyFields = false
        const emptyFieldMsj = document.createElement('p')
        emptyFieldMsj.classList.add('emptyFieldMsj')
        emptyFieldMsj.innerHTML = '*uno o mas campos estan vacios'
        if ((name.value === '' || email.value === '' || pass.value === '' || passConfirm.value === '') && !document.querySelector('.emptyFieldMsj')) {
            emptyFields = true
            signupForm.appendChild(emptyFieldMsj)
        } else if ((name.value === '' || email.value === '' || pass.value === '' || passConfirm.value === '') && document.querySelector('.emptyFieldMsj')) {
            emptyFields = true
        } else {
            let msj = document.querySelector('.emptyFieldMsj')
            msj? msj.remove() : ''
        }
        return emptyFields
    }
}

/* ------------------------------- User class ------------------------------- */
class UserHandler {
    // constructor
    constructor(){}
    // method that signs up a new user
    getUserData = () => {
        return JSON.parse(localStorage.getItem('userData'))
    }
    // method that asigns up a new user
    signUp = (e) => {
        e.preventDefault()
        const passwordRepeats = validator.passwordRepeats(signuForm, signupPassword, signupPasswordConfirm)
        const emptyFields = validator.checkEmptyFields(signupName, signupEmail, signupPassword, signupPasswordConfirm)
        const userData = {
            name: signupName.value.toLowerCase().trim(),
            email: signupEmail.value.toLowerCase().trim(),
            password: signupPassword.value.toLowerCase().trim(),
            isLoggedIn: true
        }
        if (!passwordRepeats && !emptyFields) {
            localStorage.setItem('userData', JSON.stringify(userData)) // in a real enviroment the password would not be stored in localStorage
            location.replace('../index.html')
        }
    }
    // method that loggs in a new user
    logIn = (e) => {
        e.preventDefault()
        const userInfo = {
            email: loginEmail.value.toLowerCase().trim(),
            password: loginPassword.value.toLowerCase().trim()
        }
        if (Object.keys(userData).length) {
            if (this.getUserData() && userInfo.email === userData.email && userInfo.password === userData.password) {
                userData.isLoggedIn = true
                localStorage.setItem('userData', JSON.stringify(userData))
                location.replace('../index.html')
            } else {
                alert('datos incorrectos, intente nuevamente')
            }
        } else {
            alert('el usuario no se encuentra registrado')
        }
    }
    // method that sign's out a new user
    signOut = () => {
        userData.isLoggedIn = false
        localStorage.setItem('userData', JSON.stringify(userData))
        navUl.innerHTML = defaultNav()
        console.log(userData)
        // localStorage.removeItem('userData')
        location.replace(`${relativeRoute}/index.html`)
    }
}

/* --------------------------- cart instantiation --------------------------- */
let cart = new Cart()
/* ------------------------- validator instantiation ------------------------ */
let validator = new Validator()
/* ------------------------ userHandler instantiation ----------------------- */
let userHandler = new UserHandler()