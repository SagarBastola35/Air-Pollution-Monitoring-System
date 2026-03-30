
let currentAQI = 87; // initial moderate
let currentPM25 = 28.4;
let currentPM10 = 52.1;
let currentNO2 = 18.3;
let currentO3 = 35.7;
let currentTemp = 22.5;
let currentHumidity = 58;

// Station data array (urban & suburban)
const stationsData = [
  {
    id: 1,
    name: "Downtown Central",
    lat: 40.7128,
    lng: -74.006,
    aqi: 112,
    pm25: 38.2,
    pm10: 68.5,
    trend: "+8%",
  },
  {
    id: 2,
    name: "Industrial District",
    lat: 40.758,
    lng: -73.9855,
    aqi: 178,
    pm25: 65.3,
    pm10: 102.7,
    trend: "+12%",
  },
  {
    id: 3,
    name: "Riverside Park",
    lat: 40.7831,
    lng: -73.9712,
    aqi: 52,
    pm25: 15.6,
    pm10: 32.2,
    trend: "-3%",
  },
  {
    id: 4,
    name: "Eastside Residential",
    lat: 40.713,
    lng: -73.993,
    aqi: 94,
    pm25: 29.1,
    pm10: 55.3,
    trend: "+2%",
  },
  {
    id: 5,
    name: "Green Valley",
    lat: 40.75,
    lng: -73.95,
    aqi: 38,
    pm25: 9.8,
    pm10: 21.4,
    trend: "-5%",
  },
  {
    id: 6,
    name: "Northgate Suburb",
    lat: 40.8,
    lng: -73.92,
    aqi: 67,
    pm25: 20.5,
    pm10: 41.2,
    trend: "+1%",
  },
];

// Helper: get AQI category & style / color
function getAQICategory(aqi) {
  if (aqi <= 50)
    return {
      name: "Good",
      style: "status-good",
      description: "Air quality is satisfactory.",
    };
  if (aqi <= 100)
    return {
      name: "Moderate",
      style: "status-moderate",
      description: "Acceptable air quality.",
    };
  if (aqi <= 150)
    return {
      name: "Unhealthy for Sensitive",
      style: "status-unhealthy-sensitive",
      description: "Sensitive groups may experience effects.",
    };
  if (aqi <= 200)
    return {
      name: "Unhealthy",
      style: "status-unhealthy",
      description: "Health effects possible for general public.",
    };
  return {
    name: "Very Unhealthy",
    style: "status-very-unhealthy",
    description: "Health alert: serious risk.",
  };
}

// Update global AQI display + pollutant details + alert banner
function updateMainDashboard() {
  // update numeric values
  const globalAqiSpan = document.getElementById("globalAqiValue");
  const aqiStatusSpan = document.getElementById("aqiStatus");
  const pm25Span = document.getElementById("pm25Val");
  const pm10Span = document.getElementById("pm10Val");
  const no2Span = document.getElementById("no2Val");
  const o3Span = document.getElementById("o3Val");
  const tempSpan = document.getElementById("tempVal");
  const humidSpan = document.getElementById("humidVal");

  if (globalAqiSpan) globalAqiSpan.innerText = currentAQI;
  if (pm25Span) pm25Span.innerText = currentPM25.toFixed(1);
  if (pm10Span) pm10Span.innerText = currentPM10.toFixed(1);
  if (no2Span) no2Span.innerText = currentNO2.toFixed(1);
  if (o3Span) o3Span.innerText = currentO3.toFixed(1);
  if (tempSpan) tempSpan.innerText = `${currentTemp.toFixed(1)}°C`;
  if (humidSpan) humidSpan.innerText = `${currentHumidity.toFixed(0)}%`;

  const category = getAQICategory(currentAQI);
  if (aqiStatusSpan) {
    aqiStatusSpan.innerText = `${category.name} (AQI ${currentAQI})`;
    aqiStatusSpan.className = `aqi-status ${category.style}`;
  }

  // dynamic background tint for main card (optional subtle effect)
  const mainCard = document.getElementById("aqiMainCard");
  if (mainCard) {
    let borderAccent = "#e2e8f0";
    if (currentAQI <= 50) borderAccent = "#22c55e";
    else if (currentAQI <= 100) borderAccent = "#facc15";
    else if (currentAQI <= 150) borderAccent = "#f97316";
    else if (currentAQI <= 200) borderAccent = "#ef4444";
    else borderAccent = "#8b5cf6";
    mainCard.style.borderLeft = `6px solid ${borderAccent}`;
  }

  // Alert Banner Logic: show if AQI > 150
  const alertBanner = document.getElementById("alertBanner");
  const alertMessageSpan = document.getElementById("alertMessage");
  if (currentAQI > 150) {
    if (alertBanner) {
      alertBanner.style.display = "flex";
      if (alertMessageSpan) {
        alertMessageSpan.innerText = `⚠️ ALERT: AQI ${currentAQI} - ${category.name}. Limit outdoor activities, wear N95 mask if necessary.`;
      }
    }
  } else if (currentAQI > 100) {
    if (alertBanner) {
      alertBanner.style.display = "flex";
      if (alertMessageSpan) {
        alertMessageSpan.innerText = `⚠️ Caution: AQI ${currentAQI} (${category.name}). Sensitive groups should reduce prolonged exertion.`;
      }
    }
  } else {
    if (alertBanner) alertBanner.style.display = "none";
  }

  // Update trend metric display (dynamic trend emoji)
  const trendSpan = document.getElementById("trendVal");
  if (trendSpan) {
    let trendIcon = "";
    if (currentAQI > 110) trendIcon = '<i class="fas fa-arrow-up"></i> Rising';
    else if (currentAQI < 70)
      trendIcon = '<i class="fas fa-arrow-down"></i> Improving';
    else trendIcon = '<i class="fas fa-chart-line"></i> Stable';
    trendSpan.innerHTML = trendIcon;
  }
}

// Render stations grid dynamically
function renderStations() {
  const stationsGrid = document.getElementById("stationsGrid");
  if (!stationsGrid) return;

  stationsGrid.innerHTML = "";
  stationsData.forEach((station) => {
    const category = getAQICategory(station.aqi);
    const card = document.createElement("div");
    card.className = "station-card";
    card.innerHTML = `
            <div class="station-name">
                <i class="fas fa-location-dot" style="color:#2b7a4b"></i> ${station.name}
            </div>
            <div class="station-aqi" style="color: ${getAqiColor(station.aqi)}">${station.aqi}</div>
            <div class="station-status" style="background:${getAqiBg(station.aqi)}; padding:4px 8px; border-radius:40px; display:inline-block; font-size:0.75rem; font-weight:500;">${category.name}</div>
            <div class="station-details">
                <span><i class="fas fa-smog"></i> PM2.5: ${station.pm25} µg/m³</span>
                <span><i class="fas fa-chart-simple"></i> ${station.trend}</span>
            </div>
            <div class="station-details" style="margin-top:6px;">
                <span><i class="fas fa-microchip"></i> PM10: ${station.pm10} µg/m³</span>
            </div>
        `;
    stationsGrid.appendChild(card);
  });
}

// helper colors
function getAqiColor(aqi) {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  return "#a855f7";
}
function getAqiBg(aqi) {
  if (aqi <= 50) return "#dcfce7";
  if (aqi <= 100) return "#fef9c3";
  if (aqi <= 150) return "#ffedd5";
  if (aqi <= 200) return "#fee2e2";
  return "#ede9fe";
}

// Simulate real-time air pollution changes (dynamic realistic drift)
let intervalId = null;
function startRealTimeSimulation() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    // Dynamic change: random walk but within realistic ranges
    let deltaAQI = (Math.random() - 0.5) * 8;
    let newAQI = currentAQI + deltaAQI;
    newAQI = Math.min(295, Math.max(18, newAQI));
    currentAQI = Math.round(newAQI);

    // adjust pollutants proportionally
    let factor = currentAQI / 85; // baseline scaling
    currentPM25 = Math.min(
      180,
      Math.max(5, 12 + currentAQI * 0.35 + (Math.random() - 0.5) * 4),
    );
    currentPM10 = Math.min(
      280,
      Math.max(10, 22 + currentAQI * 0.6 + (Math.random() - 0.5) * 6),
    );
    currentNO2 = Math.min(
      110,
      Math.max(5, 8 + currentAQI * 0.22 + (Math.random() - 0.5) * 2.5),
    );
    currentO3 = Math.min(
      95,
      Math.max(12, 18 + currentAQI * 0.28 + (Math.random() - 0.5) * 3),
    );

    // temperature & humidity small drift
    currentTemp = currentTemp + (Math.random() - 0.5) * 0.5;
    currentTemp = Math.min(38, Math.max(12, currentTemp));
    currentHumidity = currentHumidity + (Math.random() - 0.5) * 1.2;
    currentHumidity = Math.min(85, Math.max(30, currentHumidity));

    // update stations aqi values to reflect similar regional behavior: each station evolves
    stationsData.forEach((station) => {
      let drift = (Math.random() - 0.5) * 7;
      let newStationAQI = station.aqi + drift;
      newStationAQI = Math.min(290, Math.max(15, newStationAQI));
      station.aqi = Math.round(newStationAQI);
      // adjust pm25 based on aqi trend
      station.pm25 = Math.min(
        140,
        Math.max(4, 6 + station.aqi * 0.32 + (Math.random() - 0.5) * 3),
      );
      station.pm10 = Math.min(
        220,
        Math.max(10, 12 + station.aqi * 0.58 + (Math.random() - 0.5) * 5),
      );
      let trendDelta =
        (drift > 0.5 ? "+" : drift < -0.5 ? "-" : "→") +
        Math.abs(Math.round(drift)) +
        "%";
      if (Math.abs(drift) < 1.2) trendDelta = "→ stable";
      station.trend = trendDelta;
    });

    // Re-render stations and main dashboard
    renderStations();
    updateMainDashboard();
  }, 4000); // update every 4 seconds for realistic monitoring
}

// ================ Newsletter Subscription (mock, production-ready) ================
function initNewsletter() {
  const subBtn = document.getElementById("subBtn");
  const subEmail = document.getElementById("subEmail");
  const subMsg = document.getElementById("subMsg");
  if (subBtn && subEmail) {
    subBtn.addEventListener("click", () => {
      const email = subEmail.value.trim();
      if (!email || !email.includes("@") || !email.includes(".")) {
        if (subMsg) {
          subMsg.innerText = "Please enter a valid email address.";
          subMsg.style.color = "#facc15";
        }
        return;
      }
      // mock subscription call (localStorage simulation)
      localStorage.setItem("airvision_sub", email);
      if (subMsg) {
        subMsg.innerText = "✓ Subscribed! You'll receive air quality alerts.";
        subMsg.style.color = "#86efac";
      }
      subEmail.value = "";
      setTimeout(() => {
        if (subMsg) subMsg.innerText = "";
      }, 3000);
    });
  }
}

// ================ Navbar Active State & Mobile Menu ================
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
    // close menu when clicking any link
    const links = document.querySelectorAll(".nav-links a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        // update active class manually
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }
  // smooth scroll for anchor links (in case of default)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        // update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

// ================ Additional UI Polish: Set initial active section on scroll ================
function initScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a");
  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });
    navItems.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href").substring(1);
      if (href === current) {
        link.classList.add("active");
      }
    });
  });
}

// ================ Error resilience & performance ================
function safeInit() {
  try {
    // initial render
    renderStations();
    updateMainDashboard();
    startRealTimeSimulation();
    initNewsletter();
    initNavbar();
    initScrollSpy();

    // add touch of manual refresh for any missing interaction
    window.addEventListener("load", () => {
      renderStations();
      updateMainDashboard();
    });
    // Optional: re-render on visibility change (performance)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        renderStations();
        updateMainDashboard();
      }
    });
  } catch (err) {
    console.warn("minor ui warning", err);
  }
}

// start everything when DOM ready
document.addEventListener("DOMContentLoaded", safeInit);
