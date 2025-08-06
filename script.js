// =======================
// Mock Data
// =======================
let buses = [
  { id: 1, number: "Bus 101", driver: "John Smith", route: "North Zone", status: "on-route" },
  { id: 2, number: "Bus 102", driver: "Mary Johnson", route: "East Zone", status: "delayed" },
  { id: 3, number: "Bus 103", driver: "James Brown", route: "South Zone", status: "idle" },
  { id: 4, number: "Bus 104", driver: "Patricia Miller", route: "West Zone", status: "on-route" }
];

let students = [
  { name: "Alice", bus: "Bus 101" },
  { name: "Bob", bus: "Bus 102" },
  { name: "Charlie", bus: "Bus 103" },
  { name: "David", bus: "Bus 104" },
  { name: "Eva", bus: "Bus 101" }
];

let alerts = [
  { id: 1, message: "Bus 102 is delayed by 10 minutes", read: false },
  { id: 2, message: "Bus 104 is arriving at West Zone", read: false },
  { id: 3, message: "Bus 101 has completed its route", read: true }
];

// =======================
// Utility Functions
// =======================
function updateLastUpdateTime() {
  document.getElementById("lastUpdate").textContent = new Date().toLocaleTimeString();
}

function renderStats() {
  document.getElementById("statTotalBuses").textContent = buses.length;
  document.getElementById("statActiveBuses").textContent = buses.filter(b => b.status === "on-route").length;
  document.getElementById("statTotalStudents").textContent = students.length;
  document.getElementById("statDelayedBuses").textContent = buses.filter(b => b.status === "delayed").length;
}

function renderBusList(filter = "") {
  const list = document.getElementById("busList");
  list.innerHTML = "";
  buses
    .filter(b =>
      b.number.toLowerCase().includes(filter.toLowerCase()) ||
      b.driver.toLowerCase().includes(filter.toLowerCase()) ||
      b.route.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(bus => {
      const card = document.createElement("div");
      card.className = "bus-card";
      card.innerHTML = `
        <h4>${bus.number}</h4>
        <p>Driver: ${bus.driver}</p>
        <p>Route: ${bus.route}</p>
        <span class="status ${bus.status}">${bus.status.replace("-", " ")}</span>
      `;
      list.appendChild(card);
    });
}

function renderStudentList() {
  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${student.name}</span>
      <span>${student.bus}</span>
    `;
    list.appendChild(li);
  });
}

function renderAlerts() {
  const allList = document.getElementById("allAlerts");
  const recentList = document.getElementById("recentAlerts");
  const alertCount = alerts.filter(a => !a.read).length;

  // Badge count
  const badge = document.getElementById("alertCount");
  badge.textContent = alertCount > 0 ? alertCount : "";
  
  // All alerts
  allList.innerHTML = "";
  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${alert.message}</span>
      <div class="alert-actions">
        <button onclick="markAsRead(${alert.id})">Mark as Read</button>
        <button onclick="dismissAlert(${alert.id})">Dismiss</button>
      </div>
    `;
    allList.appendChild(li);
  });

  // Recent alerts (max 5)
  recentList.innerHTML = "";
  alerts.slice(0, 5).forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.message;
    recentList.appendChild(li);
  });
}

// =======================
// Actions
// =======================
function markAsRead(id) {
  alerts = alerts.map(a => a.id === id ? { ...a, read: true } : a);
  renderAlerts();
}

function dismissAlert(id) {
  alerts = alerts.filter(a => a.id !== id);
  renderAlerts();
}

// =======================
// Navigation
// =======================
function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  document.querySelectorAll(".main-nav button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
}

// =======================
// Real-time Simulation
// =======================
function simulateBusUpdates() {
  buses = buses.map(bus => {
    if (Math.random() > 0.8) {
      // Randomly change status
      const statuses = ["on-route", "delayed", "idle"];
      bus.status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    return bus;
  });
  renderStats();
  renderBusList(document.getElementById("busSearch").value);
}

// =======================
// Event Listeners
// =======================
document.getElementById("busSearch").addEventListener("input", e => {
  renderBusList(e.target.value);
});

// =======================
// Init
// =======================
function init() {
  updateLastUpdateTime();
  renderStats();
  renderBusList();
  renderStudentList();
  renderAlerts();

  setInterval(() => {
    updateLastUpdateTime();
    simulateBusUpdates();
  }, 5000);
}

init();
