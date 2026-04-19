const API_BASE = "https://biler-market.onrender.com";
const token = localStorage.getItem("token");

// ─── DISPLAY PRODUCTS ───────────────────────────────────
function displayProduct(products) {
  const container = document.getElementById("productList");
  container.classList.add("grid");

  container.innerHTML = products.map((product) => `
    <div class="product-card">
      <span class="tag">Available</span>
      <h4>${product.product}</h4>
      <div class="price">$${product.price}</div>
    </div>
  `).join("");
}

// ─── LOAD PRODUCTS ──────────────────────────────────────
async function loadProduct() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to load products");
      return;
    }

    displayProduct(data);
  } catch (error) {
    console.log("Load error:", error);
  }
}

// ─── ADD PRODUCT ────────────────────────────────────────
async function addProduct() {
  const product = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!product || !price) {
    console.log("Fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product, price }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("Failed to add product");
      return;
    }

    console.log("Product added:", data);
    loadProduct();

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
  } catch (error) {
    console.log("Add error:", error);
  }
}

// ─── TOTAL PRICE ────────────────────────────────────────
async function calcTotalProduct() {
  try {
    const res = await fetch(`${API_BASE}/products/total`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const total = await res.json();

    if (!res.ok) {
      console.log("Failed to get total");
      return;
    }

    document.getElementById("totalValue").value = total;
  } catch (error) {
    console.log("Total error:", error);
  }
}

// ─── SEARCH (FIXED) ─────────────────────────────────────
function searchProduct() {
  const query = document.getElementById("search").value.toLowerCase();
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? "" : "none";
  });
}

// ─── INIT ───────────────────────────────────────────────
loadProduct();