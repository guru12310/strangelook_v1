const API = "http://localhost:3000/api";
const backdrop = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");
function notify(message) { toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 3200) }
function openModal() { backdrop.classList.add("open"); backdrop.setAttribute("aria-hidden", "false") }
function closeModal() { backdrop.classList.remove("open"); backdrop.setAttribute("aria-hidden", "true") }
["postTopBtn", "heroPostBtn", "bottomPostBtn"].forEach(id => document.getElementById(id).addEventListener("click", openModal));
document.getElementById("modalClose").addEventListener("click", closeModal);
backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal() });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal() });

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = prompt("Email address");
  if (!email) return;
  const password = prompt("Password");
  if (!password) return;
  try {
    const r = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const b = await r.json(); if (!r.ok) throw new Error(b.error || "Login failed");
    localStorage.setItem("strangelook_token", b.data.token);
    notify(`Welcome back, ${b.data.user.displayName}`);
  } catch (e) { notify(e.message.includes("Failed to fetch") ? "Backend not reachable on localhost:3000" : e.message) }
});
document.getElementById("menuBtn").addEventListener("click", () => document.querySelector(".desktop-nav")?.classList.toggle("mobile-open"));

document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active")); chip.classList.add("active");
  const category = chip.dataset.category;
  document.querySelectorAll(".plan-card").forEach((card, i) => { const cats = ["Movies", "Food", "Events"]; card.style.display = category === "All" || cats[i] === category ? "" : "none" });
}));
document.getElementById("filterBtn").addEventListener("click", () => notify("Choose a category to filter the plans."));

document.querySelectorAll(".request-demo").forEach(btn => btn.addEventListener("click", () => notify("Sign in and complete identity verification to request: " + btn.dataset.plan)));

const form = document.getElementById("planForm");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.startsAt = new Date(data.startsAt).toISOString();
  if (data.closesAt) data.closesAt = new Date(data.closesAt).toISOString(); else delete data.closesAt;
  try {
    const token = localStorage.getItem("strangelook_token");
    const res = await fetch(`${API}/plans`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(data) });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Could not create plan");
    notify("Plan submitted. It is pending moderation and verification.");
    form.reset(); closeModal();
  } catch (err) { notify(err.message.includes("Failed to fetch") ? "Backend not reachable. Start the backend on localhost:3000." : err.message) }
});

async function loadPlans() {
  try {
    const res = await fetch(`${API}/plans`);
    if (!res.ok) return;
    const body = await res.json();
    if (!Array.isArray(body.data) || !body.data.length) return;
    // Backend data is intentionally not injected as HTML until a dedicated safe card renderer is added.
    console.info(`StrangeLook API connected: ${body.data.length} approved plan(s) available.`);
  } catch (_) { console.info("StrangeLook demo mode: start backend at localhost:3000 to connect.") }
}
loadPlans();
