// Haetaan DOM-elementit
const thSelect = document.getElementById('th-select');
const buildingsContainer = document.getElementById('buildings-container');
const calculateBtn = document.getElementById('calculate-btn');
const updatesContainer = document.getElementById('updates-container');
const themeToggleBtn = document.getElementById('theme-toggle');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpCloseBtn = document.getElementById('help-close-btn');

let selectedTH = null;

// Täytetään Town Hall dropdown (warWeightData oletetaan määriteltynä toisessa tiedostossa)
Object.keys(warWeightData).forEach(th => {
  const option = document.createElement('option');
  option.value = th;
  option.textContent = th;
  thSelect.appendChild(option);
});

// Kun käyttäjä valitsee Town Hallin
thSelect.addEventListener('change', () => {
  selectedTH = thSelect.value;
  updateBuildings(selectedTH, buildingsContainer, calculateBtn, warWeightData);
  updatesContainer.textContent = '';
});

// Kun käyttäjä klikkaa laske-nappia
calculateBtn.addEventListener('click', () => {
  calculateNextUpgrades(selectedTH, warWeightData, updatesContainer);
});

// Teeman vaihtaminen
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

// Modalin ohje-toiminnallisuus
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

// Sulje modal Esc-näppäimellä
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
    helpModal.classList.add('hidden');
    helpModal.setAttribute('aria-hidden', 'true');
    helpBtn.setAttribute('aria-expanded', 'false');
    helpBtn.focus();
  }
});

// Sivun latauksessa asetetaan teema
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
});
