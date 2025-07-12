
// Contact Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const responseDiv = document.getElementById("form-response");
  const API_BASE_URL = window.location.origin;
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      try {
        const res = await fetch(`${API_BASE_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        const data = await res.json();

        if (res.ok) {
          responseDiv.textContent = "✅ Message sent successfully!";
          responseDiv.style.color = "green";
          form.reset();
        } else {
          responseDiv.textContent = data.error || "❌ Something went wrong.";
          responseDiv.style.color = "red";
        }
      } catch (err) {
        responseDiv.textContent = "❌ Could not send message.";
        responseDiv.style.color = "red";
      }
    });
  }
});
// Theme Toggle Button
const toggleButton = document.createElement('button');
toggleButton.textContent = "🌙";
toggleButton.style.position = "fixed";
toggleButton.style.bottom = "20px";
toggleButton.style.left = "20px";
toggleButton.style.zIndex = "999";
toggleButton.style.padding = "8px 12px";
toggleButton.style.borderRadius = "6px";
toggleButton.style.border = "none";
toggleButton.style.background = "#4070f4";
toggleButton.style.color = "#fff";
toggleButton.style.cursor = "pointer";
document.body.appendChild(toggleButton);

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleButton.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});