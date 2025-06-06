// Create feedback button and modal HTML
(function () {
  const formspreeURL = "https://formspree.io/f/xldngjoj"; // Replace with your own Formspree ID

  // Add feedback button to header
  const header = document.querySelector("header");
  const feedbackBtn = document.createElement("button");
  feedbackBtn.id = "feedback-btn";
  feedbackBtn.textContent = "Feedback";
  feedbackBtn.setAttribute("aria-haspopup", "dialog");
  feedbackBtn.setAttribute("aria-expanded", "false");
  feedbackBtn.setAttribute("aria-controls", "feedback-modal");
  feedbackBtn.style.marginLeft = "10px";
  header.appendChild(feedbackBtn);

  // Add modal HTML at the end of the body
  const modalHtml = `
    <div id="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title" aria-hidden="true" class="modal hidden">
      <div class="modal-content" tabindex="-1">
        <h2 id="feedback-title">Send Feedback</h2>
        <form id="feedback-form" action="${formspreeURL}" method="POST">
          <label for="feedback-name">Your name (optional):</label><br />
          <input type="text" id="feedback-name" name="name" placeholder="Your name" /><br /><br />
          <label for="feedback-text">Your feedback:</label><br />
          <textarea id="feedback-text" name="message" rows="6" required></textarea><br />
          <button type="submit">Send</button>
          <button type="button" id="feedback-close-btn">Cancel</button>
        </form>
        <div id="feedback-status" role="alert" style="margin-top:10px;"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("feedback-modal");
  const form = document.getElementById("feedback-form");
  const closeBtn = document.getElementById("feedback-close-btn");
  const statusDiv = document.getElementById("feedback-status");

  // Show modal and update aria-expanded
  function openModal() {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    feedbackBtn.setAttribute("aria-expanded", "true");
    modal.querySelector(".modal-content").focus();
  }

  // Close modal and update aria-expanded
  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    feedbackBtn.setAttribute("aria-expanded", "false");
    statusDiv.textContent = "";
    form.reset();
    feedbackBtn.focus();
  }

  feedbackBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  // Submit form via Formspree (AJAX)
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    statusDiv.textContent = "Sending...";
    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        statusDiv.textContent = "Thank you for your feedback!";
        form.reset();
        setTimeout(closeModal, 2000);
      } else {
        response.json().then(data => {
          if (data && data.errors) {
            statusDiv.textContent = data.errors.map(error => error.message).join(", ");
          } else {
            statusDiv.textContent = "Oops! There was a problem submitting your feedback.";
          }
        });
      }
    }).catch(() => {
      statusDiv.textContent = "Oops! There was a problem submitting your feedback.";
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
})();
