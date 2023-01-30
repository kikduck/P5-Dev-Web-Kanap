const HOST = "http://localhost:3000/api/products";

//Récupérer les donnnées et affichage des produits
async function dataFetch() {
  try {
    const response = await fetch(HOST);
    const data = await response.json();

    const productSection = document.getElementById("items");

    data.forEach((product) => {
      const productCard = `
      <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}" />
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>
      `;
      productSection.innerHTML += productCard;
    });
  } catch (error) {
    console.error(error);
  }
}

dataFetch();
