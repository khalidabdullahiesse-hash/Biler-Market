const BASE_URL = "http://localhost:5000";// ── helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem("token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function fmtMoney(n) {
  return "$" + Number(n).toFixed(2);
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── API calls ─────────────────────────────────────────────────────────────────

async function apiCreateLoan(totalAmount) {
  const res = await fetch(`${BASE_URL}/loans`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ totalAmount: Number(totalAmount) }),
  });
  return res.json();
}

async function apiGetAllLoans() {
  const res = await fetch(`${BASE_URL}/loans`, {
    headers: authHeaders(),
  });
  return res.json();
}

async function apiPayLoan(id, amount) {
  const res = await fetch(`${BASE_URL}/loans/${id}/pay`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ amount: Number(amount) }),
  });
  return res.json();
}

async function apiDeleteLoan(id) {
  const res = await fetch(`${BASE_URL}/loans/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// ── render ────────────────────────────────────────────────────────────────────

function renderLoans(loans) {
  const grid = document.getElementById("loanGrid");
  const totalEl = document.getElementById("loanTotal");
  const remainEl = document.getElementById("loanRemain");

  if (!grid) return;

  if (!loans || loans.length === 0) {
    grid.innerHTML = `
      <div class="loan-empty">
        <div class="loan-empty-icon">📋</div>
        <p>No loans yet. Add your first one above.</p>
      </div>`;
    if (totalEl) totalEl.textContent = "$0.00";
    if (remainEl) remainEl.textContent = "$0.00";
    return;
  }

  let totalSum = 0;
  let remainSum = 0;

  grid.innerHTML = loans
    .map((loan) => {
      const remain = loan.remainAmount ?? loan.totalAmount - loan.paidAmount;
      const pct = Math.min(
        100,
        Math.round((loan.paidAmount / loan.totalAmount) * 100)
      );
      totalSum += loan.totalAmount;
      remainSum += remain;

      const statusClass = pct === 100 ? "paid" : pct > 0 ? "partial" : "unpaid";
      const statusLabel = pct === 100 ? "Paid" : pct > 0 ? "Partial" : "Unpaid";

      return `
      <div class="loan-card" data-id="${loan._id}">
        <div class="loan-card-top">
          <div>
            <div class="loan-badge ${statusClass}">${statusLabel}</div>
            <div class="loan-amount">${fmtMoney(loan.totalAmount)}</div>
            <div class="loan-date">${fmtDate(loan.createdAt)}</div>
          </div>
          <button class="loan-delete-btn" onclick="handleDeleteLoan('${loan._id}')" title="Delete">✕</button>
        </div>

        <div class="loan-progress-wrap">
          <div class="loan-progress-bar">
            <div class="loan-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="loan-progress-labels">
            <span>Paid: <b>${fmtMoney(loan.paidAmount)}</b></span>
            <span>Left: <b>${fmtMoney(remain)}</b></span>
          </div>
        </div>

        ${
          pct < 100
            ? `<div class="loan-pay-row">
                <input
                  type="number"
                  class="loan-pay-input"
                  placeholder="Payment amount"
                  id="pay-${loan._id}"
                  min="1"
                  max="${remain}"
                />
                <button class="loan-pay-btn" onclick="handlePayLoan('${loan._id}')">Pay</button>
               </div>`
            : `<div class="loan-fully-paid">🎉 Fully Paid</div>`
        }
      </div>`;
    })
    .join("");

  if (totalEl) totalEl.textContent = fmtMoney(totalSum);
  if (remainEl) remainEl.textContent = fmtMoney(remainSum);
}

// ── handlers ──────────────────────────────────────────────────────────────────

async function handleAddLoan() {
  const input = document.getElementById("loanAmount");
  const val = input?.value?.trim();

  if (!val || isNaN(val) || Number(val) <= 0) {
    showLoanToast("Please enter a valid amount.", "error");
    return;
  }

  const btn = document.getElementById("addLoanBtn");
  if (btn) btn.textContent = "Adding…";

  try {
    const data = await apiCreateLoan(val);
    if (data.loan) {
      input.value = "";
      showLoanToast("Loan created!", "success");
      await loadLoans();
    } else {
      showLoanToast(data.message || "Failed to create loan.", "error");
    }
  } catch {
    showLoanToast("Network error.", "error");
  } finally {
    if (btn) btn.textContent = "+ Add Loan";
  }
}

async function handlePayLoan(id) {
  const input = document.getElementById(`pay-${id}`);
  const val = input?.value?.trim();

  if (!val || isNaN(val) || Number(val) <= 0) {
    showLoanToast("Enter a valid payment amount.", "error");
    return;
  }

  try {
    const data = await apiPayLoan(id, val);
    if (data.loan) {
      showLoanToast("Payment recorded!", "success");
      await loadLoans();
    } else {
      showLoanToast(data.message || "Payment failed.", "error");
    }
  } catch {
    showLoanToast("Network error.", "error");
  }
}

async function handleDeleteLoan(id) {
  if (!confirm("Delete this loan?")) return;

  try {
    const data = await apiDeleteLoan(id);
    if (data.message) {
      showLoanToast("Loan deleted.", "success");
      await loadLoans();
    }
  } catch {
    showLoanToast("Network error.", "error");
  }
}

async function loadLoans() {
  try {
    const data = await apiGetAllLoans();
    renderLoans(data.loans || []);
  } catch {
    showLoanToast("Could not load loans.", "error");
  }
}

// ── toast ─────────────────────────────────────────────────────────────────────

function showLoanToast(msg, type = "success") {
  let toast = document.getElementById("loanToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "loanToast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = "loan-toast " + type;
  toast.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}