const token = localStorage.getItem("token");

function displayProduct(products) {
  const container = document.getElementById("productList");

  // Add the grid class to your parent container so the CSS grid layout applies
  container.classList.add("grid"); 

  // Generate the HTML for all products and insert it
  container.innerHTML = products.map((product) => `
    <div class="product-card">
      <span class="tag">Available</span>
      <h4>${product.product}</h4>
      <div class="price">$${product.price}</div>
    </div>
  `).join("");
}

async function loadProduct() {
  const res = await fetch("http://localhost:5000/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // ✅ IMPORTANT
    },
  });
  const data = await res.json();

  displayProduct(data);
}

function searchProduct() {
  const query = document.getElementById("search").value.toLowerCase();
  const lis = document.querySelectorAll("#productList li");
  lis.forEach((li) => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(query) ? "" : "none";


  });
}

async function addProduct() {
  const product = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!product) {
    console.error("fill the page");
  }

  const res = await fetch("http://localhost:5000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`, // ✅ IMPORTANT
    },
    body: JSON.stringify({
      product,
      price,
    }),
  });

  const newProduct = await res.json();

  loadProduct();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
}
async function CalicutProduct() {
  const calTotalProduct = await fetch("http://localhost:5000/products/total", {
    method: "get",
    header: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // ✅ IMPORTANT
    },
    body: JSON.stringify({
      totalPrice,
    }),
  });

  const total = await res.json();

  const totalValue = (document.getElementById("totalValue").value = total);
}
loadProduct();
