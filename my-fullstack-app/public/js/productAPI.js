// function displayProduct(products) {
//   const ul = document.getElementById("productList");

//   ul.innerHTML = "";

//   products.forEach((product) => {
//     const li = document.createElement("li");

//     li.textContent = `${product.product} -  price $${product.price}`;
//     ul.appendChild(li);
//   });
// }

// async function loadProduct() {
//   const res = await fetch("http://localhost:5000/products");
//   const data = await res.json();

//   displayProduct(data);
// }

// function searchProduct() {
//   const query = document.getElementById("search").value.toLowerCase();
//   const lis = document.querySelectorAll("#productList li");
//   lis.forEach(li => {
//     const text = li.textContent.toLowerCase();
//     li.style.display = text.includes(query) ? "" : "none";
//   });
// }

// async function addProduct() {

  
//   const product = document.getElementById("name").value;
//   const price = document.getElementById("price").value;

//  if(!product){
//   console.error('fill the page')
//  }


//   const res = await fetch("http://localhost:5000/products", {
//     method:"post",
//     headers:{
//       "content-Type": "application/json"
//     },
//     body:JSON.stringify({
//       product,
//       price
//     })
//   });


//   const newProduct = await res.json()

//   loadProduct()

//   document.getElementById("name").value = ""
//   document.getElementById("price").value = ""

  
// }

// loadProduct();
