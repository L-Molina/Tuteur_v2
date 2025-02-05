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

let loggedIn = false;

function validatePassword() {
    const loginButton = document.getElementById("login-button");
    const passwordInput = document.getElementById("password-input");
    const controls = document.querySelectorAll(".action-buttons");
    const correctPassword = "1480";

    if (!loggedIn) {
        if (passwordInput.value === correctPassword) {
            loggedIn = true;
            
            controls.forEach(control => control.style.display = "flex"); // Muestra los elementos con la clase "action-buttons"
            loginButton.textContent = "Log Off";
        } else {
            alert("Contraseña Incorrecta");
        }
    }
}

function logOut() {
    const loginButton = document.querySelector("#login-button");
    const passwordInput = document.getElementById("password-input");
    const controls = document.querySelectorAll(".action-buttons");
    
    loggedIn = false;
    controls.forEach(control => control.style.display = "none"); // Oculta los elementos con la clase "action-buttons"
    passwordInput.value = "";
    loginButton.textContent = "Log In";
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

/*
function updateBarHeight(tankId) {
  const input = document.getElementById(`cv-${tankId}`);
  const barBg = document.getElementById(`barBg-${tankId}`);
  const percentage = parseInt(input.value, 10);

  console.log(percentage)

  barBg.style.height = `${percentage}%`;
}
*/

function updateBarHeight(tankId) {
  const input = document.getElementById(`cv-tank1`);
  const barBg = document.getElementById(`barBg-tank1`);
  const percentage = parseInt(input.value, 10);

  console.log(percentage);

  barBg.style.height = `${percentage}%`;
}

function updateBarHeight(tankId) {
  const input = document.getElementById(`cv-tank2`);
  const barBg = document.getElementById(`barBg-tank2`);
  const percentage = parseInt(input.value, 10);

  console.log(percentage);

  barBg.style.height = `${percentage}%`;
}

/*
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
*/
