const API_BASE = "http://localhost:5000";

// ─── LOGIN ───────────────────────────────────────────────
const loginBTN = document.getElementById("loginBTN");
if (loginBTN) {
  loginBTN.addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // 1️⃣ Login → get token
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log("Login failed:", data.message || "Unknown error");
        return;
      }

      // 2️⃣ Save the token
      const token = data.token; // adjust key to match your API response
      localStorage.setItem("token", token);
      console.log("Token saved:", token);

      // 3️⃣ Verify token by calling /users/me
      const meRes = await fetch(`${API_BASE}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token here
        },
      });

      const meData = await meRes.json();

      if (!meRes.ok) {
        console.log("Token check failed — not authenticated");
        return;
      }

      console.log("Authenticated user:", meData);
      document.getElementById("fill").textContent =
        `Welcome Back, ${meData.email}!`;

      setTimeout(function () {
        window.location.href = "index.html";
      }, 3000);
    } catch (error) {
      console.log("Login error:", error);
    }
  });
}

// ─── REGISTER ────────────────────────────────────────────
const registerUser = document.getElementById("registerUser");
if (registerUser) {
  registerUser.addEventListener("click", async function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json(); // ✅ await added

      if (!res.ok) {
        console.log("Registration failed:", data.message || "Unknown error");
        return;
      }

      console.log("Registered:", data);
      document.getElementById("beil").textContent =
        `Account created successfully! Welcome, ${name}`;
    } catch (error) {
      showAlert("Creating Account Failed Please try again")
      console.log("Register error:", error);
    }
  });
}

function showAlert(error) {
  document.getElementById("alertBox").style.display = "block";
  document.getElementById("Error").textContent = error;
}

function closeAlert() {
  document.getElementById("alertBox").style.display = "none";
}
