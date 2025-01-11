// Check for saved theme preference
const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme);
updateThemeIcon(theme);

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const button = document.querySelector('.theme-toggle');
  button.innerHTML = theme === 'dark' ? '🌙' : '☀️';
}

// Add these functions to handle percentage input validation
function validatePercentage(event) {
  // Allow only numbers and basic control keys
  if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || 
      event.key === 'Enter' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
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
  input.value = input.value.replace(/[^\d]/g, '');
  
  // Ensure value is between 0 and 100
  let value = parseInt(input.value);
  if (value > 100) {
    input.value = '100';
  } else if (value < 0) {
    input.value = '0';
  }
} 