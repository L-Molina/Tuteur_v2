// Check for saved theme preference
const theme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", theme);
updateThemeIcon(theme);

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const button = document.querySelector(".theme-toggle");
  button.innerHTML = theme === "dark" ? "🌙" : "☀️";
}

let loginTimer = 0;
let loggedIn = false;

function validatePassword() {
  const loginButton = document.getElementById("login-button");
  const passwordInput = document.getElementById("password-input");
  const otherControls = document.querySelectorAll("#other-controls");
  const enviarMailTank1 = document.querySelector('[id*="enviar-mail-tank1"]');
  const enviarMailTank2 = document.querySelector('[id*="enviar-mail-tank2"]');
  const correctPassword = "1480";

  clearTimeout(loginTimer); // Prevent multiple timers

  if (!loggedIn) {
    if (passwordInput.value === correctPassword) {
      alert("Sesión Iniciada. Mails Activados");
      loggedIn = true;
      otherControls.forEach(section => section.classList.add("visible"));
      enviarMailTank1.disabled = false;
      enviarMailTank2.disabled = false;
    } else {
      alert("Sesión Iniciada. Mails Desactivados");
      loggedIn = true;
      otherControls.forEach(section => section.classList.add("visible"));
      enviarMailTank1.disabled = true;
      enviarMailTank2.disabled = true;
    }

    loginButton.textContent = "Log Off";
    loginButton.classList.add("logged-in");
    passwordInput.disabled = true;

    loginTimer = setTimeout(() => logOut(), 3 * 60 * 1000);
  } else {
    logOut();
  }
}

function logOut() {
  alert("Sesión Terminada");
  const loginButton = document.getElementById("login-button");
  const passwordInput = document.getElementById("password-input");
  const otherControls = document.querySelectorAll("#other-controls");
  const enviarMailTank1 = document.querySelector('[id*="enviar-mail-tank1"]');
  const enviarMailTank2 = document.querySelector('[id*="enviar-mail-tank2"]');

  clearTimeout(loginTimer);

  loggedIn = false;
  otherControls.forEach(section => section.classList.remove("visible"));
  enviarMailTank1.disabled = true;
  enviarMailTank2.disabled = true;

  loginButton.textContent = "Log In";
  loginButton.classList.remove("logged-in");
  passwordInput.disabled = false;
  passwordInput.value = "";
}

function validatePercentage(event) {
  // Allow only numbers and basic control keys
  if (
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "Tab" ||
    event.key === "Enter" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  ) {
    return true;
  }

  // Allow only numbers
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
    return false;
  }

  // Check if the resulting value would be valid
  const newValue = event.target.value + event.key;
  if (parseInt(newValue) > 100) {
    event.preventDefault();
    return false;
  }

  return true;
}

function limitPercentage(input) {
  // Remove any non-numeric characters
  input.value = input.value.replace(/[^\d]/g, "");

  // Ensure value is between 0 and 100
  let value = parseInt(input.value);
  if (value > 100) {
    input.value = "100";
  } else if (value < 0) {
    input.value = "0";
  }
}

function updateBarHeight(tankId) {
  const input = document.getElementById(`percentage-${tankId}`);
  const barBg = document.getElementById(`barBg-${tankId}`);
  const currentValue = document.getElementById(`cv-${tankId}`);
  const percentage = parseInt(input.value, 10);

  // Validate input
  if (isNaN(percentage) || percentage < 0 || percentage > 100) {
    alert("Error: Valor ingresado fuera del rango requerido (entre 0 y 100)");
    return;
  }

  console.log(percentage);

  barBg.style.height = `${percentage}%`;
  currentValue.value = `${percentage}`;

  alert(`Valor del Tanque ${tankId === "tank1" ? "1" : "2"}: ${percentage}%.`);
}

window.tankState = {
  tank1: { timer: null, elapsedTime: 0, isRunning: false, minTime: Infinity },
  tank2: { timer: null, elapsedTime: 0, isRunning: false, minTime: Infinity },
};

function toggleTimer(tankId) {
  const timeInput = document.querySelector(`#time-${tankId}`);

  if (!timeInput) {
    console.error(`Error: Time input (seg) not found for ${tankId}`);
    return;
  }

  const button = document.querySelector(`[id*="activar-envio"][onclick*="toggleTimer('${tankId}')"]`);

  const tank = window.tankState[tankId];

  console.log(`Toggling timer for ${tankId}, current state: ${tank.isRunning}`);

  if (tank.isRunning) {
    clearInterval(tank.timer);
    clearInterval(tank.minTimer);
    tank.isRunning = false;
    button.textContent = "Activar";
    button.style.background = "";
    console.log(`Timer stopped for ${tankId}`);
  } else {
    tank.isRunning = true;
    tank.elapsedTime = 0;
    tank.minTime = Infinity;
    tank.timer = setInterval(() => {
      tank.elapsedTime++;
      timeInput.value = tank.elapsedTime; 
    }, 1000);

    tank.minTimer = setInterval(() => {
      tank.minTime++;
    }, 1000);

    button.textContent = "Desactivar";
    button.style.background = "linear-gradient(to bottom, red, darkred)";
    console.log(`Timer started for ${tankId}`);
  }

  updateEnviarMailState(tankId);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Page Loaded: Ensuring Enviar Mail buttons are disabled.");

  const enviarMailButtons = document.querySelectorAll('[id*="enviar-mail"]');
  enviarMailButtons.forEach(button => {
    button.disabled = true;
    button.style.opacity = "0.5";
  });

  updateEnviarMailState("tank1");
  updateEnviarMailState("tank2");
});


function updateEnviarMailState(tankId) {
  const enviarMailButton = document.querySelector(`[id*="enviar-mail-${tankId}"]`);

  console.log(`Looking for "Enviar Mail" button with ID: enviar-mail-${tankId}`);
  console.log("Found button:", enviarMailButton);

  if (!enviarMailButton) {
    console.error(`Error: "Enviar Mail" button not found for ${tankId}`);
    return;
  }

  const tank = window.tankState[tankId];

  console.log(`Updating mail state for ${tankId}: loggedIn=${loggedIn}, isRunning=${tank.isRunning}`);

  if (loggedIn && tank.isRunning) {
    enviarMailButton.disabled = false;
    enviarMailButton.style.opacity = "1";
  } else {
    enviarMailButton.disabled = true;
    enviarMailButton.style.opacity = "0.5";
  }
}

function enviarMail(tankId) {
  const tank = window.tankState[tankId];
  const minInput = document.getElementById(`min-${tankId}`);
  const enviarMailButton = document.querySelector(`[id*="enviar-mail-${tankId}"]`);

  console.log(`Attempting to send mail for ${tankId}`);

  if (!enviarMailButton) {
    console.error(`Error: "Enviar Mail" button not found for ${tankId}`);
    return;
  }

  if (!loggedIn || !tank.isRunning) {
    alert("You must be logged in and activate the timer to send mail.");
    return;
  }

  // Get the current timer value
  const currentTime = tank.elapsedTime;
  const currentMin = parseInt(minInput.value) || Infinity; // Default to Infinity if empty

  console.log(`Current elapsed time: ${currentTime}, Previous min: ${currentMin}`);

  if (currentTime < currentMin) {
    tank.minTime = currentTime; 
    minInput.value = tank.minTime; 
    console.log(`New minimum time recorded: ${tank.minTime}`);
  } else {
    console.log(`Min time NOT updated. Kept previous value: ${currentMin}`);
  }

  alert(`Mail sent for Tank ${tankId === "tank1" ? "1" : "2"}`);
}

