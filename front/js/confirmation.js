const currentUrl = window.location;
const urlParams = new URL(currentUrl);
const productId = urlParams.searchParams.get("id");
const orderId = document.getElementById("orderId");
orderId.innerHTML = productId;