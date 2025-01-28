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
  const enviarMail = document.getElementById("enviar-mail");
  const simularValor = document.getElementById("simular-valor");
  const activarEnvio = document.getElementById("activar-envio");
  const correctPassword = "1480";

  console.log("Current loggedIn state:", loggedIn);
  if (loggedIn === false) {
    const enteredPassword = passwordInput.value;

    if (enteredPassword === correctPassword) {
      alert("Sesión Iniciada. Mails de Prueba: Activado");
      loggedIn = true;
      console.log("Current loggedIn state:", loggedIn);
      otherControls.forEach((section) => {
        section.classList.add("visible");
      });
      enviarMail.disabled = false;
      simularValor.disabled = true;
      activarEnvio.disabled = true;

      loginButton.textContent = "Log Off";
      loginButton.classList.add("logged-in");
      passwordInput.disabled = true;

      loginTimer = setTimeout(() => {
        logOut();
      }, 3 * 60 * 1000);
    } else {
      alert("Sesión Iniciada. Mails de Prueba: Desactivado");
      loggedIn = true;
      otherControls.forEach((section) => {
        section.classList.add("visible");
      });
      enviarMail.disabled = true;
      simularValor.disabled = false;
      activarEnvio.disabled = false;
      loginButton.textContent = "Log Off";
      loginButton.classList.add("logged-in");
      passwordInput.disabled = true;

      loginTimer = setTimeout(() => {
        logOut();
      }, 3 * 60 * 1000);
    }
  } else {
    logOut();
  }
}

function logOut() {
  alert("Sesión Terminada");
  const loginButton = document.getElementById("login-button");
  const passwordInput = document.getElementById("password-input");
  const otherControls = document.querySelectorAll("#other-controls");
  const enviarMail = document.getElementById("enviar-mail");
  const simularValor = document.getElementById("simular-valor");
  const activarEnvio = document.getElementById("activar-envio");

  clearTimeout(loginTimer);

  loggedIn = false;
  otherControls.forEach((section) => {
    section.classList.remove("visible");
  });
  enviarMail.disabled = true;
  simularValor.disabled = true;
  activarEnvio.disabled = true;

  loginButton.textContent = "Log In";
  loginButton.classList.remove("logged-in");
  passwordInput.disabled = false;
  passwordInput.value = "";
}

// Add these functions to handle percentage input validation
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

// Global tankTimers object
window.tankTimers = {
  tank1: { timer: null, elapsedTime: 0, isRunning: false },
  tank2: { timer: null, elapsedTime: 0, isRunning: false },
};

function toggleTimer(tankId) {
  const tank = window.tankTimers[tankId]; // Access global tankTimers
  const timeInput = document.getElementById(`time-${tankId}`);
  const button = document.querySelector(
    `button[onclick="toggleTimer('${tankId}')"]`
  );

  if (!tank) {
    console.error(`Tanque ${tankId === "tank1" ? "1" : "2"} invalido`);
    return;
  }

  if (tank.isRunning) {
    // Stop the timer
    clearInterval(tank.timer);
    tank.isRunning = false;

    // Update button text and style
    button.textContent = "Activar";
    button.style.background = "";
    button.style.color = "";

    alert(
      `Tiempo total del tanque ${tankId === "tank1" ? "1" : "2"}: ${tank.elapsedTime}s.`
    );
  } else {
    // Start the timer
    tank.isRunning = true;
    tank.timer = setInterval(() => {
      tank.elapsedTime++;
      timeInput.value = tank.elapsedTime; // Update the input field
    }, 1000);

    // Update button text and style
    button.textContent = "Desactivar";
    button.style.background = "linear-gradient(to bottom, red, darkred)";
    button.style.color = "white";

    alert(`Empezó el temporizador del tanque ${tankId === "tank1" ? "1" : "2"}.`);
  }
}
