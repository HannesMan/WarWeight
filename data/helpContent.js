// helpContent.js
document.addEventListener("DOMContentLoaded", () => {
  const helpContainer = document.getElementById("help-content");
  if (helpContainer) {
    helpContainer.innerHTML = `
      <p>This application helps you prioritize Builder Upgrades to increase War Weight as quickly as possible.</p>
      <ul>
        <li>First, select your Town Hall level from the dropdown menu.</li>
        <li>Check the boxes for upgrades you have completed.</li>
        <li>Click the "Calculate Next Upgrades" button to see the upcoming upgrades.</li>
        <li>You can toggle between dark and light themes using the button at the top right.</li>
      </ul>
      <p style="margin-top: 1em; font-style: italic; font-size: 0.9em; color: #666;">
        Made by Hannes Man | BLITZKRIEG FWA
      </p>
    `;
  }
});
