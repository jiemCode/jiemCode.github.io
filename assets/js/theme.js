
// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to apply the theme based on cookie
function applyTheme() {
    const theme = getCookie("theme") || "light";
    const themeStyle = document.getElementById("theme-style");
    const themeIcon = document.getElementById("theme-toggle");
    themeStyle.href = theme === "dark" ? "assets/css/dark.css" : "assets/css/light.css";
    themeIcon.src = theme === "dark" ? "assets/icons/sun.png" : "assets/icons/moon.png";
}

// Function to toggle the theme
function toggleTheme() {
    const currentTheme = getCookie("theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCookie("theme", newTheme, 7); // Set cookie for 7 days
    applyTheme();
}

// Event listener for the toggle button
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

// Apply the theme on page load
applyTheme();

// document.addEventListener("DOMContentLoaded", function () {
//     // Simulate loading time
//     setTimeout(() => {
//         document.getElementById("loader").style.display = "none";
//         document.getElementById("content").style.display = "block";
//     }, 2000); // Change the duration as needed
// });

$(document).ready(function () {
    setTimeout(() => {
        // 
    }, 1500);
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "block";
});

