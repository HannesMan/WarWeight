// DOM-elementit
const thSelect = document.getElementById('th-select');
const buildingsContainer = document.getElementById('buildings-container');
const calculateBtn = document.getElementById('calculate-btn');
const updatesContainer = document.getElementById('updates-container');
const themeToggleBtn = document.getElementById('theme-toggle');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpCloseBtn = document.getElementById('help-close-btn');

let selectedTH = null;
window.warWeightData = {}; // Tallennetaan data tähän

// Lataa yksittäinen JSON-tiedosto async-funktiona
async function loadTHData(thLevel) {
  try {
    const response = await fetch(`data/${thLevel}.json`);
    if (!response.ok) throw new Error(`Failed to load ${thLevel}.json`);
    const data = await response.json();
    window.warWeightData[thLevel] = data;
  } catch (error) {
    console.error(error);
  }
}

// Lataa kaikki tarvittavat TH-tasot ja täytä valikko
async function initialize() {
  const thLevels = ['TH12', 'TH13', 'TH14', 'TH15', 'TH16', 'TH17'];

  // Tyhjennä select (jätä placeholder)
  while (thSelect.options.length > 1) {
    thSelect.remove(1);
  }

  // Täytä dropdown
  thLevels.forEach(th => {
    const option = document.createElement('option');
    option.value = th;
    option.textContent = th;
    thSelect.appendChild(option);
  });

  // Lataa datat
  await Promise.all(thLevels.map(loadTHData));

  // Ota tallennettu teema käyttöön
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

// Päivitä rakennukset valinnan mukaan
thSelect.addEventListener('change', () => {
  selectedTH = thSelect.value;
  // Kutsutaan wwScriptissä olevaa updateBuildings-funktiota
  updateBuildings(selectedTH, buildingsContainer, calculateBtn, window.warWeightData);
  updatesContainer.textContent = '';
});

// Laske-napin käsittelijä
calculateBtn.addEventListener('click', () => {
  calculateNextUpgrades(selectedTH, window.warWeightData, updatesContainer);
});

// Teeman vaihto
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    themeToggleBtn.setAttribute('aria-pressed', 'true');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    themeToggleBtn.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('theme', theme);
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
});

// Modalin avaus/sulku
helpBtn.addEventListener('click', () => {
  helpModal.classList.remove('hidden');
  helpModal.setAttribute('aria-hidden', 'false');
  helpBtn.setAttribute('aria-expanded', 'true');
  helpModal.querySelector('.modal-content').focus();
});

helpCloseBtn.addEventListener('click', () => {
  helpModal.classList.add('hidden');
  helpModal.setAttribute('aria-hidden', 'true');
  helpBtn.setAttribute('aria-expanded', 'false');
  helpBtn.focus();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
    helpModal.classList.add('hidden');
    helpModal.setAttribute('aria-hidden', 'true');
    helpBtn.setAttribute('aria-expanded', 'false');
    helpBtn.focus();
  }
});

// Käynnistetään sivun latauksen yhteydessä
document.addEventListener('DOMContentLoaded', initialize);
