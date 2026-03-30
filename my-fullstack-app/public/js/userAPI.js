const API_BASE = "http://localhost:5000";
const loginBTN = document.getElementById("loginBTN");
if (loginBTN) {
  loginBTN.addEventListener("click", async function () {
    try {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return console.log("login Failed !!");
      }

      console.log(data);
      const fill = document.getElementById("fill");

      fill.textContent = `Welcome Back ${email.toString()}`;
      // clear inputs
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    } catch (error) {
      console.log("Error:", error);
    }
  });
}

const registerUser = document.getElementById("registerUser");
if (registerUser) {
  registerUser.addEventListener("click", async function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      const data = res.json();
      console.log(data);
      const beil = document.getElementById("beil");
      beil.textContent = `You successfully made Your new account ${name.toString()}`
    } catch (error) {
      console.log("Error", error);
    }
  });
}
