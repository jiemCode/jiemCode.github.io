// Minimal theme handling for the blog (keeps the same cookie as the portfolio)
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = `${name}=`;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.indexOf(nameEQ) === 0)
    ?.substring(nameEQ.length) || null;
}

function applyTheme() {
  const theme = getCookie("theme") || "light";
  const themeStyle = document.getElementById("theme-style");
  const themeIcon = document.getElementById("theme-icon");
  const prefix = document.body.dataset.assetsPrefix || "./";

  if (themeStyle) {
    themeStyle.href = `${prefix}assets/css/${theme === "dark" ? "dark" : "light"}.css`;
  }
  if (themeIcon) {
    themeIcon.src = `${prefix}assets/icons/${theme === "dark" ? "sun" : "moon"}.png`;
  }
  document.body.dataset.theme = theme;
}

function toggleTheme() {
  const currentTheme = getCookie("theme") || "light";
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  setCookie("theme", nextTheme, 7);
  applyTheme();
}

function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", toggleTheme);
  }
  applyTheme();
}

document.addEventListener("DOMContentLoaded", initThemeToggle);
