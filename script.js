// Mock Data
let buses = [
  { id: 1, number: "Bus 101", driver: "John Smith", route: "North Zone", status: "on-route", lat: 28.6139, lng: 77.2090 },
  { id: 2, number: "Bus 102", driver: "Mary Johnson", route: "East Zone", status: "delayed", lat: 28.7041, lng: 77.1025 },
  { id: 3, number: "Bus 103", driver: "James Brown", route: "South Zone", status: "idle", lat: 28.5355, lng: 77.3910 },
  { id: 4, number: "Bus 104", driver: "Patricia Miller", route: "West Zone", status: "on-route", lat: 28.4595, lng: 77.0266 }
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

// Global variables
let map;
let busMarkers = {};

// Initialize map
function initMap() {
  map = L.map('map').setView([28.6139, 77.2090], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  buses.forEach(bus => {
    let marker = L.marker([bus.lat, bus.lng])
      .addTo(map)
      .bindPopup(`<b>${bus.number}</b><br>Driver: ${bus.driver}<br>Route: ${bus.route}`);
    busMarkers[bus.id] = marker;
  });
}

// Smoothly move marker from old position to new
function smoothMoveMarker(marker, newLat, newLng, duration = 2000) {
  const startPos = marker.getLatLng();
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const lat = startPos.lat + (newLat - startPos.lat) * progress;
    const lng = startPos.lng + (newLng - startPos.lng) * progress;
    marker.setLatLng([lat, lng]);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Update time
function updateLastUpdateTime() {
  document.getElementById("lastUpdate").textContent = new Date().toLocaleTimeString();
}

// Render Stats
function renderStats() {
  document.getElementById("statTotalBuses").textContent = buses.length;
  document.getElementById("statActiveBuses").textContent = buses.filter(b => b.status === "on-route").length;
  document.getElementById("statTotalStudents").textContent = students.length;
  document.getElementById("statDelayedBuses").textContent = buses.filter(b => b.status === "delayed").length;
}

// Render Bus List
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

// Render Student List
function renderStudentList() {
  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${student.name}</span><span>${student.bus}</span>`;
    list.appendChild(li);
  });
}

// Render Alerts
function renderAlerts() {
  const allList = document.getElementById("allAlerts");
  const recentList = document.getElementById("recentAlerts");
  const alertCount = alerts.filter(a => !a.read).length;
  document.getElementById("alertCount").textContent = alertCount > 0 ? alertCount : "";

  allList.innerHTML = "";
  alerts.forEach(alert => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${alert.message}</span>
      <div class="alert-actions">
        <button onclick="markAsRead(${alert.id})">Mark as Read</button>
        <button onclick="dismissAlert(${alert.id})">Dismiss</button>
      </div>`;
    allList.appendChild(li);
  });

  recentList.innerHTML = "";
  alerts.slice(0, 5).forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.message;
    recentList.appendChild(li);
  });
}

// Alert Actions
function markAsRead(id) {
  alerts = alerts.map(a => a.id === id ? { ...a, read: true } : a);
  renderAlerts();
}

function dismissAlert(id) {
  alerts = alerts.filter(a => a.id !== id);
  renderAlerts();
}

// Navigation
function showView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
  document.querySelectorAll(".main-nav button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
}

// Simulate movement
function simulateBusUpdates() {
  buses.forEach(bus => {
    const newLat = bus.lat + (Math.random() - 0.5) * 0.005;
    const newLng = bus.lng + (Math.random() - 0.5) * 0.005;
    bus.lat = newLat;
    bus.lng = newLng;
    smoothMoveMarker(busMarkers[bus.id], newLat, newLng, 2000);
  });
}

// Init App
function init() {
  initMap();
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

document.addEventListener("DOMContentLoaded", init);
