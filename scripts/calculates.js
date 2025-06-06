// Calculates.js
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mpwrqdrr'; // replace with your own Formspree form URL

export function setupCalculateButton() {
  const calculateBtn = document.getElementById('calculate-btn');
  if (!calculateBtn) return;

  calculateBtn.addEventListener('click', async () => {
    try {
      // Send form data through Formspree
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Calculate button clicked',
          timestamp: new Date().toISOString(),
        }),
      });
      // No visible feedback shown to the user
    } catch (error) {
      // Error handling (you can optionally show something to the user)
      console.error('Failed to send calculate event', error);
    }
  });
}
