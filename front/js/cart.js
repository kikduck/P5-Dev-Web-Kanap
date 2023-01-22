function getCartItems() {
    // Vérifie que le navigateur prend en charge le stockage local
    if (typeof (Storage) !== "undefined") {
        // Récupère les éléments existants du stockage local
        var existingItemsString = localStorage.getItem("cartItems");
        items = JSON.parse(existingItemsString) || [];
        //return items;
        console.log(items);
        dataFetch(items);

    } else {
        console.log("Désolé, votre navigateur ne prend pas en charge le stockage local.");
    }
};

async function dataFetch(items) {
    for (let item of items) {
        productIdList = [];
        productIdList.push(item.productId);
        HOST = "http://localhost:3000/api/products/" + item.productId;
        var Color = item.varColor
        var Quantity = item.varQuantity
        await fetch(HOST)
            .then(response => response.json())
            .then(data => constructDom(data, Color, Quantity, item))
            .catch(error => console.log(error));
    };
};

function constructDom(data, Color, Quantity, item) {
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

var cartItems = getCartItems();

function deleteItem(deletedItemId, deletedItemColor) {
    for (let item of items) {
        if (item.productId == deletedItemId && item.varColor == deletedItemColor) {
            items = items.filter(element => element !== item)
        }
        var itemsString = JSON.stringify(items);
        localStorage.setItem("cartItems", itemsString);
        window.location.reload();
    }
};

function quantityChange(ItemId, ItemColor, ItemQuantity) {
    for (let item of items) {
        if (item.productId == ItemId && item.varColor == ItemColor) {
            var newItem = {
                productId: item.productId,
                varQuantity: ItemQuantity,
                varColor: item.varColor
            };
            let index = items.findIndex(element => element === item);
            items[index] = newItem;
        }
        var itemsString = JSON.stringify(items);
        localStorage.setItem("cartItems", itemsString);
        window.location.reload();
    }
};
//[{"productId":"415b7cacb65d43b2b5c1ff70f3393ad1","varQuantity":1,"varColor":"Black/Yellow"},{"productId":"a6ec5b49bd164d7fbe10f37b6363f9fb","varQuantity":4,"varColor":"White"},{"productId":"034707184e8e4eefb46400b5a3774b5f","varQuantity":8,"varColor":"Red"}]
