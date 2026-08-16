// Retro clock widget
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const monthNames = ["JAN.", "FEB.", "MAR.", "APR.", "MAY.", "JUN.", "JUL.", "AUG.", "SEP.", "OCT.", "NOV.", "DEC."];
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    document.getElementById("clock").textContent = `${meridiem} ${hours}:${minutes}:${seconds}`;
    document.getElementById("date").textContent = `${monthNames[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`;
}
setInterval(updateClock, 1000);
updateClock();

// Hidden trigger — looks like plain text, quietly opens the secret page
function unlockSecret() {
    window.location.href = "/secret";
}

// Contact form submission (Web3Forms)
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot: if this hidden checkbox got checked, it was a bot — silently pretend to succeed.
    if (contactForm.botcheck && contactForm.botcheck.checked) {
        contactForm.reset();
        return;
    }

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    formStatus.textContent = "Sending...";

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.success) {
                contactForm.reset();
                contactForm.style.display = "none";

                const contactTitle = document.getElementById("contact-title");
                const contactSubtitle = document.getElementById("contact-subtitle");
                if (contactTitle) contactTitle.style.display = "none";
                if (contactSubtitle) contactSubtitle.style.display = "none";

                formStatus.textContent = "Thank you for your message! We'll get back to you as soon as possible.";
            } else {
                formStatus.textContent = "Something went wrong. Please try again, or email directly instead.";
                submitButton.disabled = false;
            }
        })
        .catch(() => {
            formStatus.textContent = "Something went wrong. Please try again, or email directly instead.";
            submitButton.disabled = false;
        });
});