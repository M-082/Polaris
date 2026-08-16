$(function () {
    $("#navbar").load("../components/navbar.html");

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const monthNames = ["JAN.", "FEB.", "MAR.", "APR.", "MAY.", "JUN.", "JUL.", "AUG.", "SEP.", "OCT.", "NOV.", "DEC."];
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        $("#clock").text(`${meridiem} ${hours}:${minutes}:${seconds}`);
        $("#date").text(`${monthNames[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`);
    }
    updateClock();
    setInterval(updateClock, 1000);

    // --- Typewriter effect ---
    function typeWriter($el, text, speed) {
        $el.text("");
        let i = 0;
        (function step() {
            if (i < text.length) {
                $el.text($el.text() + text.charAt(i));
                i++;
                setTimeout(step, speed);
            }
        })();
    }

    // const encodedCodeword = "bW9vbg==";
    const encodedCodeword = "aXZvcnlvcmI=";
    const unlockedImageSrc = "../assets/images/contact/502error.png"; // swap in your real filename

    $("#codeword-form").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        const guess = $("#codeword").val().trim().toLowerCase().replace(/\s+/g, "");

        if (guess === atob(encodedCodeword)) {
            $form.fadeOut(500, function () {
                setTimeout(function () {
                    $("#unlocked-message").show();
                    typeWriter($("#unlocked-text"), "53 11 32 52 52 15 24 41 53", 120);

                    $("#secret-image").fadeTo(400, 0, function () {
                        $(this).attr("src", unlockedImageSrc);
                        $(this).fadeTo(400, 1);
                    });
                }, 500);
            });
        } else {
            $("#codeword-status").text("INCORRECT. TRY AGAIN.").addClass("error");
        }
    });
});