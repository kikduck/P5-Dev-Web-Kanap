const currentUrl = window.location;
const urlParams = new URL(currentUrl);
const productId = urlParams.searchParams.get("id");
const HOST = "http://localhost:3000/api/products/" + productId;

const dataFetch = async function () {
    const response = await fetch(HOST);
    const data = await response.json();
    constructDom(data);
};

const constructDom = function (data) {
    const image = document.querySelector(".item__img");
    image.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    const title = document.getElementById("title");
    title.innerHTML = data.name;
    const pageTitle = document.querySelector("title");
    pageTitle.innerHTML = data.name;
    const cost = document.getElementById("price");
    cost.innerHTML = `${data.price}`;
    const details = document.getElementById("description");
    details.innerHTML = data.description;
    const options = document.getElementById("colors");
    data.colors.forEach(color => {
        options.innerHTML += `<option value="${color}">${color}</option>`;
    });
};

dataFetch();

const getQuantity = () => {
    const quantity = document.getElementById("quantity");
    return quantity.value;
};

const getColor = () => {
    const color = document.getElementById("colors");
    return color.value;
};



const addToCartBtn = document.getElementById("addToCart");

function addCart(productId, varQuantity, varColor) {
    // Vérifie que le navigateur prend en charge le stockage local
    if (typeof (Storage) !== "undefined") {
        var varNewItem = true;
        // Récupère les éléments existants du stockage local
        var existingItemsString = localStorage.getItem("cartItems");
        if (existingItemsString == "") {
            var existingItems = [];
        } else {
            var existingItems = JSON.parse(existingItemsString) || [];
        }
        // Crée un objet pour stocker les variables
        var newItem = {
            productId: productId,
            varQuantity: varQuantity,
            varColor: varColor,
        };
        for (let item of existingItems) {
            if (item.productId == productId && item.varColor == varColor) {
                console.log("MEME ITEM");
                var newItem = {
                    productId: productId,
                    varQuantity: varQuantity + item.varQuantity,
                    varColor: varColor,
                };
                var varNewItem = false
                let index = existingItems.findIndex(element => element === item);
                existingItems[index] = newItem;
            }
        }
        console.log(varNewItem);
        if (varNewItem === true) {
            // Ajoute l'objet aux éléments existants
            existingItems.push(newItem);
        }
        // Convertit l'objet en chaîne de caractères pour le stocker
        var itemsString = JSON.stringify(existingItems);
        // Stocke les variables dans le stockage local
        localStorage.setItem("cartItems", itemsString);
    } else {
        console.log("Désolé, votre navigateur ne prend pas en charge le stockage local.");
    }
}


addToCartBtn.addEventListener("click", () => {
    const varQuantity = parseInt(getQuantity());
    const varColor = getColor();
    if (varQuantity <= 0 || Number.isInteger(parseInt(varQuantity)) === false) {
        if (varColor == "") {
            alert("Quantité invalide et aucune couleur sélectionnée");
        } else {
            alert("Quantité invalide");
        }
    } else if (varColor == "") {
        alert("Aucune couleur sélectionnée");
    } else {
        addCart(productId, varQuantity, varColor);
        window.location.assign("cart.html");
    };

});