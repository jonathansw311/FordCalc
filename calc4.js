// ====================== CONFIGURATION ======================
const DOC_FEE = 1090.00;
const THIRD_PARTY = 544.00;
const NEW_PLATE = 450.00;
const TRANSFER_PLATE = 200.00;
let PROCARE_NEW = 1950.00;

// ====================== DOM ELEMENTS ======================
const submitBtn = document.querySelector('button');
const resultDiv = document.querySelector('.result');

const newRadio = document.getElementById('new');
const usedRadio = document.getElementById('used');
const usedOptionsDiv = document.getElementById('used-options');
const newOptionsDiv = document.getElementById('new-options');

const advCheckbox = document.getElementById('adv-discount');
const finCheckbox = document.getElementById('fin-discount');

// ====================== STATE ======================
let advDisc = 0;
let finDisc = 0;

// ====================== EVENT LISTENERS ======================
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    calculateAndDisplay();
});

document.body.addEventListener('focusout', (e) => {
    // Only trigger if the focused-out element is an input
    if (e.target.tagName === 'INPUT') {
        calculateAndDisplay();
    }
});

newRadio.addEventListener('change', toggleOptions);
usedRadio.addEventListener('change', toggleOptions);
advCheckbox.addEventListener('change', updateDiscounts);
finCheckbox.addEventListener('change', updateDiscounts);

// ====================== HELPER FUNCTIONS ======================
function updateDiscounts() {
    advDisc = advCheckbox.checked ? 1000 : 0;
    finDisc = finCheckbox.checked ? 1000 : 0;
}

function toggleOptions() {
    if (usedRadio.checked) {
        usedOptionsDiv.style.display = 'block';
        newOptionsDiv.style.display = 'none';
        PROCARE_NEW = 0;
    } else {
        usedOptionsDiv.style.display = 'none';
        newOptionsDiv.style.display = 'block';
        // Reset discounts when switching to New
        advCheckbox.checked = false;
        finCheckbox.checked = false;
        advDisc = 0;
        finDisc = 0;
     //   PROCARE_NEW = 1950;
    }
}

function getPlateFee() {
    return document.getElementById('newPlates').checked ? NEW_PLATE : TRANSFER_PLATE;
}

// ====================== MAIN CALCULATION ======================
function gatherInputData() {
    
    if (usedRadio.checked){
        proCare = 0;
     } else{
            proCare = Number(document.getElementById('ProCare').value);
     }
    
    
    return {
        sellPrice:   Number(document.getElementById('sellPrice').value)   || 0,
        tradePrice:  Number(document.getElementById('tradePrice').value)  || 0,
        cashDown:    Number(document.getElementById('cashDown').value)    || 0,
        tradePayoff: Number(document.getElementById('tradePayoff').value) || 0,
        months:      Number(document.getElementById('months').value)      || 0,
        rate:        (Number(document.getElementById('rate').value) || 0) * 0.01,
        
        
        
        //proCare:     Number(document.getElementById('ProCare').value)     || 
          //         (newRadio.checked ? PROCARE_NEW : 0)
        proCare: proCare,  
    };
}

function calculatePayment(data) {
    const { sellPrice, tradePrice, cashDown, tradePayoff, months, rate, proCare } = data;

    // Taxable amount (sale price - trade + procare + doc fee)
    const taxableAmt = (sellPrice - tradePrice) + proCare + DOC_FEE + advDisc + finDisc;
    
    // Taxes (6%)
    const taxes = Math.max(taxableAmt * 0.06, 0);

    // Amount to finance BEFORE down payment
    let amtFin = taxableAmt + taxes + getPlateFee() + THIRD_PARTY + tradePayoff;
    
    // Subtract cash down payment
    amtFin = Math.max(amtFin - cashDown, 0);

    // Monthly payment calculation
    if (months <= 0) return 0;
    
    const monthlyRate = rate / 12;
    
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
        monthlyPayment = amtFin / months;
    } else {
        monthlyPayment = (amtFin * monthlyRate) / 
                        (1 - Math.pow(1 + monthlyRate, -months));
    }

    return {
        monthlyPayment: monthlyPayment,
        amtFin: amtFin,
        taxes: taxes,
        plateFee: getPlateFee(),
        proCare: proCare,
        tradePrice: tradePrice
    };
}

function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
}

// ====================== DISPLAY ======================
function displayResults(results) {
    resultDiv.replaceChildren();

    const p1 = document.createElement('p');
    p1.innerHTML = `The monthly payment is <strong>$${formatCurrency(results.monthlyPayment)}</strong> for ${results.months || '?'} months`;
    
    const p2 = document.createElement('p');
    p2.innerHTML = `Amount Financed: <strong>$${formatCurrency(results.amtFin)}</strong>`;
    
    const p3 = document.createElement('p');
    p3.innerHTML = `Estimated Plate Fees: <strong>$${formatCurrency(results.plateFee)}</strong>`;
    
    const p4 = document.createElement('p');
    p4.innerHTML = `Taxes: <strong>$${formatCurrency(results.taxes)}</strong>`;
    
    resultDiv.append(p1, p2, p3, p4);

    if (results.proCare > 0) {
        const p5 = document.createElement('p');
        p5.innerHTML = `Reconditioning (ProCare): <strong>$${formatCurrency(results.proCare)}</strong>`;
        resultDiv.append(p5);
    }

    if (results.tradePrice > 0) {
        const taxSaved = results.tradePrice * 0.06;
        const p6 = document.createElement('p');
        p6.innerHTML = `Your trade saved you <strong>$${formatCurrency(taxSaved)}</strong> in taxes!`;
        resultDiv.append(p6);
    }
}

// ====================== MAIN FUNCTION ======================
function calculateAndDisplay() {
    const inputData = gatherInputData();
    const results = calculatePayment(inputData);
    
    // Add months back for display
    results.months = inputData.months;
    
    displayResults(results);
}

// ====================== INITIALIZE ======================
window.addEventListener('click', () => {
    toggleOptions();
    updateDiscounts();
    // Optional: run once on load with default values
    // calculateAndDisplay();
});
