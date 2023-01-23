//Récupère les éléments dans le localstorage
function getCartItems() {
    // Vérifie que le navigateur prend en charge le stockage local
    if (typeof (Storage) !== "undefined") {
        // Récupère les éléments existants du stockage local
        var existingItemsString = localStorage.getItem("cartItems");
        items = JSON.parse(existingItemsString) || [];
        return items;
    } else {
        console.log("Désolé, votre navigateur ne prend pas en charge le stockage local.");
    }
};

//Récupère les détails de chaque élément dans l'API
async function getProductById(items) {
    productIdList = [];
    for (let item of items) {
        productIdList.push(item.productId);
        HOST = "http://localhost:3000/api/products/" + item.productId;
        var Color = item.varColor
        var Quantity = item.varQuantity
        console.log(Quantity);
        if (Quantity == "") {
            console.log("NULL");
            var Quantity = 1;
        }
        await fetch(HOST)
            .then(response => response.json())
            .then(data => constructCartPage(data, Color, Quantity))
            .catch(error => console.log(error));
    };
    getTotalPrice();
};

//Constuction de la page
function constructCartPage(data, Color, Quantity) {
    const productSection = document.getElementById("cart__items");
    const itemCart = `
    <article class="cart__item" data-id="${data._id}" data-color="${Color}">
    <div class="cart__item__img">
        <img src="${data.imageUrl}" alt="${data.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
        <h2>${data.name}</h2>
        <p>${Color}</p>
        <p>${data.price} €</p>
        </div>
        <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${Quantity}" onchange="quantityChange('${data._id}','${Color}', this.value)">
        </div>
        <div class="cart__item__content__settings__delete">
            <p class="deleteItem" onclick="deleteItem('${data._id}','${Color}')">Supprimer</p>
        </div>
        </div>
    </div>
    </article>
    `;
    productSection.innerHTML += itemCart;
};

getCartItems();
getProductById(items);


//Affiche le prix total
async function getTotalPrice() {
    totalPrice = 0;
    const totalPriceSection = document.getElementById("totalPrice");
    for (let item of items) {
        await fetch("http://localhost:3000/api/products/" + item.productId)
            .then(response => response.json())
            .then(data => totalPrice = totalPrice + data.price * item.varQuantity)
            .catch(error => console.log(error));
    }
    totalPriceSection.innerHTML = `${totalPrice}`;
}

//Supprime un élément de la page et du localstorage
function deleteItem(deletedItemId, deletedItemColor) {
    for (let item of items) {
        if (item.productId == deletedItemId && item.varColor == deletedItemColor) {
            items = items.filter(element => element !== item)
        }
        var itemsString = JSON.stringify(items);
        localStorage.setItem("cartItems", itemsString);
        getTotalPrice();
        window.location.reload();
    }
};

//Change la quantité d'un élément
function quantityChange(ItemId, ItemColor, ItemQuantity) {
    for (let item of items) {
        if (item.productId == ItemId && item.varColor == ItemColor) {
            if (Number.isInteger(parseInt(ItemQuantity)) && parseInt(ItemQuantity) > 0) {
                var newItem = {
                    productId: item.productId,
                    varQuantity: ItemQuantity,
                    varColor: item.varColor,
                }
                let index = items.findIndex(element => element === item);
                items[index] = newItem;
            }
            var itemsString = JSON.stringify(items);
            localStorage.setItem("cartItems", itemsString);
            getTotalPrice();
        }
    }
};


//Verification des inputs
const firstName = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastName = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const address = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const city = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const email = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");
const submitButton = document.getElementById("order");

const inputBox = [firstName, lastName, address, city, email];
const ErrorMsg = [firstNameErrorMsg, lastNameErrorMsg, addressErrorMsg, cityErrorMsg, emailErrorMsg];

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    let varConfirmaton = true;
    for (let input of inputBox) {
        let onlySpaces = input.value.trim().length === 0;
        let onlyLetters = /^[a-zA-Z]+$/.test(input.value);
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let emailTest = emailRegex.test(input.value);
        let index = inputBox.findIndex(element => element === input);
        if (onlySpaces) {
            ErrorMsg[index].innerHTML = `Champ vide`;
            varConfirmaton = false;
        } else {
            if (onlyLetters || input == address || input == email) {
                ErrorMsg[index].innerHTML = ``;
                if ((input == firstName || input == lastName) && input.value.length < 2) {
                    ErrorMsg[index].innerHTML = `Champ Invalide`;
                    varConfirmaton = false;
                }
                if (input == address && input.value.length < 7) {
                    ErrorMsg[index].innerHTML = `Adresse invalide`;
                    varConfirmaton = false;
                }
                if (input == email && emailTest === false) {
                    ErrorMsg[index].innerHTML = `Email invalide`;
                    varConfirmaton = false;
                }
            } else {
                ErrorMsg[index].innerHTML = `Champ invalide`;
                varConfirmaton = false;
            }
        }
    }
    if (varConfirmaton) {
        submitButton.disabled = false;
        Confirmation();
    }
});

//Confirmation de la commande et renvoi vers la page de confirmation
async function Confirmation() {
    var contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    }
    console.log(contact)
    console.log(productIdList)
    console.log(JSON.stringify({ contact, productIdList }))
    products = productIdList;
    if (products.length === 0) {
        alert("Panier Vide");
    } else {
        let response = await fetch('http://localhost:3000/api/products/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ contact, products })
        });
        let data = await response.json();
        localStorage.clear();
        let confirmationUrl = "./confirmation.html?id=" + data.orderId;
        window.location.assign(confirmationUrl);
    }

}


//[{"productId":"415b7cacb65d43b2b5c1ff70f3393ad1","varQuantity":1,"varColor":"Black/Yellow"},{"productId":"a6ec5b49bd164d7fbe10f37b6363f9fb","varQuantity":4,"varColor":"White"},{"productId":"034707184e8e4eefb46400b5a3774b5f","varQuantity":8,"varColor":"Red"}]
