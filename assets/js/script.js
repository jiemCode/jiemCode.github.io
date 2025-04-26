// ----------
// Navigation
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll("nav .container ul li");
window.onscroll = () => {
  var current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 80) {
      current = section.getAttribute("id");
    }
  });

  navLi.forEach((li) => {
    li.classList.remove("active");
    if (li.classList.contains(current)) {
      li.classList.add("active");
    }
  });
};

// ----------------
// Smooth scrolling
$(document).ready(function () {
  $("a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;

      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });
});

// ------------------------------
// Add projects items dynamically
projects = {
  sms: {
    imageUrl: "assets/img/sms.png",
    description: "#jquery #bootstrap #sweetalert #django",
    title: "Plateforme de gestion scolaire <br>",
    buttonLink: "https://samaecole.pythonanywhere.com",
  },
  asrl: {
    imageUrl: "assets/img/asrl.png",
    description: "#iptables #openvpn #dmz #squid #mailcow",
    title: "Administration et Sécurité d'un LAN <br>",
    buttonLink: "#",
  },
  bookshelf: {
    imageUrl: "assets/img/bookshelf.png",
    description: "#php #html #css #js #sqlite",
    title: "Plateforme Web de Collection de Livres <br>",
    buttonLink: "#",
  },
  iot: {
    imageUrl: "assets/img/iot.png",
    description: "#esp32 #c #arduino #html",
    title: "Mini Station Météo sur ESP32 <br>",
    buttonLink: "#",
  },
};

Object.keys(projects).forEach((key) => {
  const project = projects[key];

  var button = `<br> <a target="blank" style="color: var(--primary); font-size: larger; bold; padding: 2px 6px; border-radius: 6px; background-color: var(--secondary)" href=${project.buttonLink}>Voir</a>`;

  var new_art = `
    <div class="col">
            <div class="card sbg">
            <div class="card-img-top" style="background-image: url('${project.imageUrl}'); background-size: cover; background-color: var(--primary-light);">
              <div class="card-img-top" style="background-color: rgba(0, 0, 0, .35); width: 100%; height: 300px"></div>
            </div>
              <div class="card-body">
                <h5 class="card-title scol">${project.title} ${button}</h5>
                <p class="card-text" style="color: var(--main)">${project.description}</p>
              </div>
            </div>
          </div>
  `;

  document.getElementById("card__container").innerHTML += new_art;
});
