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

addToCartBtn.addEventListener("click", () => {
    const varQuantity = parseInt(getQuantity());
    const varColor = getColor();
    if (varQuantity == 0) {
        if (varColor == "") {
            alert("Quantité nulle et aucune couleur sélectionnée");
        } else {
            alert("Quantité nulle");
        }
    } else if (varColor == "") {
        alert("Aucune couleur sélectionnée");
    };

    //addCart(productId, varColor, varQuantity);
    // window.location.assign("cart.html");
});