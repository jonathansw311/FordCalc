// === DISCOUNT VARIABLES ===
let advDisc = 0;   // Advertising Discount
let finDisc = 0;   // Financing Discount

// Get DOM elements
const newRadio = document.getElementById('new');
const usedRadio = document.getElementById('used');
const usedOptionsDiv = document.getElementById('used-options');

const advCheckbox = document.getElementById('adv-discount');
const finCheckbox = document.getElementById('fin-discount');

// Function to show/hide used options
function toggleUsedOptions() {
  if (usedRadio.checked) {
    usedOptionsDiv.style.display = 'block';
  } else {
    usedOptionsDiv.style.display = 'none';
    // Reset checkboxes and discount values when switching to "New"
    advCheckbox.checked = false;
    finCheckbox.checked = false;
    advDisc = 0;
    finDisc = 0;
  }
}

// Update discount values when checkboxes change
function updateDiscounts() {
  advDisc = advCheckbox.checked ? 1000 : 0;
  finDisc = finCheckbox.checked ? 1000 : 0;
  console.log(advDisc);
  console.log(finDisc);
  
  // Optional: You can call your main calculation function here
  // calculateTotal();   // ← Uncomment if you have a calculate function
}

// Event Listeners
newRadio.addEventListener('change', toggleUsedOptions);
usedRadio.addEventListener('change', toggleUsedOptions);

advCheckbox.addEventListener('change', updateDiscounts);
finCheckbox.addEventListener('change', updateDiscounts);

// Initialize on page load
window.addEventListener('load', () => {
  toggleUsedOptions();
  updateDiscounts();   // Set initial values
});