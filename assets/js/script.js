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
// Projects data + filterable gallery
const projects = [
  {
    id: "securedrop",
    category: "cloud",
    title: "SecureDrop — Infrastructure AWS automatisée",
    subtitle:
      "Application React + FastAPI et son infra AWS déployées en un <code>git push</code> : Terraform provisionne, Ansible configure, Vault fournit les secrets, Trivy et Checkov scannent, GitHub Actions orchestre. Pipeline complet en 4 min 17 s.",
    image: "assets/img/projects/securedrop-cover.jpg",
    stack: [
      "Terraform",
      "Ansible",
      "AWS",
      "Vault",
      "Trivy",
      "GitHub Actions",
      "Docker",
    ],
    links: { code: "https://github.com/jiemCode/securedrop-devops" },
    gallery: [
      "assets/img/projects/securedrop/01-versions-terraform-trivy-ansible.jpg",
      "assets/img/projects/securedrop/02-terraform-init-backend-success.jpg",
      "assets/img/projects/securedrop/03-terraform-plan-27-to-add.jpg",
      "assets/img/projects/securedrop/04-terraform-apply-complete-outputs.jpg",
      "assets/img/projects/securedrop/05-aws-alb-active.jpg",
      "assets/img/projects/securedrop/06-aws-ec2-instances-running.jpg",
      "assets/img/projects/securedrop/07-aws-dynamodb-table-created.jpg",
      "assets/img/projects/securedrop/08-ansible-ping-success.jpg",
      "assets/img/projects/securedrop/09-ansible-playbook-deploy-recap-ok.jpg",
      "assets/img/projects/securedrop/10-browser-securedrop-app-uploads-list.jpg",
      "assets/img/projects/securedrop/11-terraform-apply-oidc-github-role.jpg",
      "assets/img/projects/securedrop/12-github-actions-run-success-4m17s.jpg",
    ],
  },
  {
    id: "cicd-fleetcom",
    category: "cloud",
    title: "Pipeline CI/CD multi-étages — FleetCom",
    subtitle:
      "Chaîne complète sur deux instances EC2 : un webhook GitHub déclenche Jenkins, qui construit l'image Docker, la pousse sur Docker Hub et déploie sur Kubernetes. Observabilité via Helm kube-prometheus-stack.",
    image: "assets/img/projects/cicd-cover.jpg",
    stack: [
      "Jenkins",
      "Docker",
      "Kubernetes",
      "Helm",
      "Prometheus",
      "Grafana",
      "AWS EC2",
    ],
    links: {
      code: "https://github.com/jiemCode/node-app",
      report: "assets/files/rapport-pipeline-ci-cd.pdf",
      article: "blog/posts/mise_en_place_d_un_pipeline_ci_cd__01.html",
    },
    gallery: [
      "assets/img/projects/cicd/01-fleetcom-ci-jenkins-pipeline-creation.jpg",
      "assets/img/projects/cicd/02-github-repo-webhook-configuration.jpg",
      "assets/img/projects/cicd/03-github-webhook-delivers-list.jpg",
      "assets/img/projects/cicd/04-aws-ec2-instances-list-page-showing-ec2-ci-and-ec2-k8s-instances-up.jpg",
      "assets/img/projects/cicd/05-ec2-k8s-security-group-inbound-rules-32000-32001-30080-8443-22-icmp.jpg",
      "assets/img/projects/cicd/06-demo-app-exposed-through-k8s-on-port-30080.jpg",
      "assets/img/projects/cicd/07-helm-install-monitoring-prometheus.jpg",
      "assets/img/projects/cicd/08-grafana-dashboard.jpg",
      "assets/img/projects/cicd/09-grafana-dashboard-apiserver-metrics.jpg",
      "assets/img/projects/cicd/10-grafana-monitoring-dashboard-metrics.jpg",
    ],
  },
  {
    id: "aws-3tier",
    category: "cloud",
    title: "Architecture 3-Tier sur AWS",
    subtitle:
      "Construction d'une architecture web trois niveaux : VPC multi-AZ, sous-réseaux publics et privés, load balancers interne et public, Auto Scaling à chaque étage et base Aurora MySQL isolée.",
    image: "assets/img/projects/aws3tier-cover.jpg",
    stack: [
      "AWS VPC",
      "EC2",
      "ALB",
      "Auto Scaling",
      "Aurora MySQL",
      "S3",
      "IAM",
      "Nginx",
    ],
    links: { report: "assets/files/rapport-aws-3tier.pdf" },
    gallery: [
      "assets/img/projects/aws3tier/01-vpc-map.jpg",
      "assets/img/projects/aws3tier/02-subnets.jpg",
      "assets/img/projects/aws3tier/03-route-tables.jpg",
      "assets/img/projects/aws3tier/04-nat-gateways.jpg",
      "assets/img/projects/aws3tier/05-security-groups.jpg",
      "assets/img/projects/aws3tier/06-databases.jpg",
      "assets/img/projects/aws3tier/07-db-subnet-group.jpg",
      "assets/img/projects/aws3tier/08-custom-amis.jpg",
      "assets/img/projects/aws3tier/09-launch-templates.jpg",
      "assets/img/projects/aws3tier/10-auto-scaling-groups.jpg",
      "assets/img/projects/aws3tier/11-target-groups.jpg",
      "assets/img/projects/aws3tier/12-internet-lb-node.jpg",
      "assets/img/projects/aws3tier/13-site-1.jpg",
    ],
  },
  {
    id: "k8s-ha",
    category: "cloud",
    title: "Cluster Kubernetes haute disponibilité",
    subtitle:
      "Cluster multi-master monté avec kubeadm : deux control planes répartis sur deux zones de disponibilité, etcd en quorum, HAProxy en frontal de l'API server et security groups durcis. Projet mené avec Mouhamet Thioune.",
    image: "assets/img/projects/k8s-ha-cover.svg",
    stack: ["Kubernetes", "kubeadm", "HAProxy", "etcd", "Calico", "AWS VPC"],
    links: { report: "assets/files/rapport-cluster-k8s-ha.pdf" },
    gallery: [],
  },
  {
    id: "quality",
    category: "cloud",
    title: "Qualité & performance : SonarQube + JMeter",
    subtitle:
      "Chaîne d'assurance qualité pour une application Spring Boot : analyse statique SonarQube avec couverture JaCoCo et Quality Gate bloquante, puis tests de charge JMeter avec mesure d'Apdex et des temps de réponse.",
    image: "assets/img/projects/quality-cover.jpg",
    stack: [
      "SonarQube",
      "JMeter",
      "JaCoCo",
      "Maven",
      "Spring Boot",
      "Docker Compose",
      "PostgreSQL",
    ],
    links: {},
    gallery: [
      "assets/img/projects/quality/01-create-sonarqube-project.jpg",
      "assets/img/projects/quality/02-running-mvn-clean-verify-sonar.jpg",
      "assets/img/projects/quality/03-quality-gate-status-overview.jpg",
      "assets/img/projects/quality/04-quality-gate-failed.jpg",
      "assets/img/projects/quality/05-block-on-code-coverage-ratio-of-0.20-minimun-is-0.80.jpg",
      "assets/img/projects/quality/06-alert-on-token-hardcoded-in-code.jpg",
      "assets/img/projects/quality/07-alert-on-duplicated-literals.jpg",
      "assets/img/projects/quality/08-setup-project-for-clean-as-you-code.jpg",
      "assets/img/projects/quality/09-report-dashboard-apdex.jpg",
      "assets/img/projects/quality/10-report-response-time-percentile-and-response-time-overview.jpg",
      "assets/img/projects/quality/11-report-reponse-time-over-time-on-endpoints.jpg",
      "assets/img/projects/quality/12-monitor-cpu-cores-at-max.jpg",
    ],
  },
  {
    id: "labs",
    category: "cloud",
    title: "Labs Docker, Kubernetes & virtualisation",
    subtitle:
      "Plus de vingt-cinq environnements conteneurisés montés puis exploités : microservices distribués sur Docker Hub, WordPress sur Kubernetes avec Ingress TLS, SIEM Wazuh, GLPI, reverse proxies, et un pool XCP-ng piloté par Xen Orchestra.",
    image: "assets/img/projects/labs-cover.jpg",
    stack: [
      "Docker Compose",
      "Kubernetes",
      "Ingress TLS",
      "Nginx",
      "Wazuh",
      "XCP-ng",
    ],
    links: {},
    gallery: [
      "assets/img/projects/labs/01-msa-build.jpg",
      "assets/img/projects/labs/02-msa-tag.jpg",
      "assets/img/projects/labs/03-msa-push.jpg",
      "assets/img/projects/labs/04-msa-dockerhub.jpg",
      "assets/img/projects/labs/05-msa-browser.jpg",
      "assets/img/projects/labs/06-xcpng-xcpng_host_dashboard.jpg",
      "assets/img/projects/labs/07-xcpng-xoa_dashboard.jpg",
      "assets/img/projects/labs/08-xcpng-vm_list.jpg",
      "assets/img/projects/labs/09-xcpng-host_stats.jpg",
    ],
  },
  {
    id: "npm-oss",
    category: "cloud",
    title: "Contribution open source — Nginx Proxy Manager",
    subtitle:
      "Fonctionnalité de regroupement des hôtes proxy par domaine de base dans Nginx Proxy Manager : agrégation côté table, état initial mémoïsé et prise en charge des deux thèmes.",
    image: "assets/img/projects/npm-oss-cover.svg",
    stack: ["Node.js", "React", "TypeScript", "Nginx", "Docker"],
    links: {
      code: "https://github.com/jiemCode/nginx-proxy-manager/tree/feat/host-grouping",
    },
    gallery: [],
  },
  {
    id: "sms",
    category: "web",
    title: "Plateforme de gestion scolaire",
    subtitle:
      "Application de gestion d'établissement : inscriptions, notes et suivi des élèves.",
    image: "assets/img/sms.png",
    stack: ["Django", "jQuery", "Bootstrap", "SweetAlert"],
    links: { demo: "https://schoolms.booze.pics" },
    gallery: [],
  },
  {
    id: "bookshelf",
    category: "web",
    title: "Plateforme web de collection de livres",
    subtitle:
      "Catalogue de livres avec recherche, fiches détaillées et gestion de la collection.",
    image: "assets/img/bookshelf.png",
    stack: ["PHP", "JavaScript", "SQLite", "HTML/CSS"],
    links: {},
    gallery: [],
  },
  {
    id: "asrl",
    category: "reseau",
    title: "Administration et sécurité d'un LAN",
    subtitle:
      "Architecture réseau complète avec DMZ, pare-feu frontal et arrière, proxy filtrant et accès VPN, validée par des tests de pénétration.",
    image: "assets/img/asrl.png",
    stack: ["IPTables", "Squid", "OpenVPN", "WireGuard", "StrongSwan", "Mailcow"],
    links: { report: "assets/files/rapport-asrl.pdf" },
    gallery: [],
  },
  {
    id: "iot",
    category: "reseau",
    title: "Mini station météo sur ESP32",
    subtitle:
      "Station connectée relevant température et humidité, avec restitution sur un tableau de bord temps réel.",
    image: "assets/img/iot.png",
    stack: ["ESP32", "C/C++", "Arduino", "MQTT"],
    links: {},
    gallery: [],
  },
];

const cardContainer = document.getElementById("card__container");
const filterBar = document.querySelector(".project-filters");

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function buildLinks(project) {
  const { code, report, article, demo } = project.links || {};
  const buttons = [];

  if (demo) {
    buttons.push(
      `<a class="card-link primary" href="${escapeAttr(demo)}" target="_blank" rel="noopener">Voir la démo</a>`
    );
  }
  if (code) {
    buttons.push(
      `<a class="card-link" href="${escapeAttr(code)}" target="_blank" rel="noopener">Code</a>`
    );
  }
  if (report) {
    buttons.push(
      `<a class="card-link" href="${escapeAttr(report)}" target="_blank" rel="noopener">Rapport PDF</a>`
    );
  }
  if (article) {
    buttons.push(
      `<a class="card-link" href="${escapeAttr(article)}">Article</a>`
    );
  }
  if (project.gallery && project.gallery.length) {
    buttons.push(
      `<button type="button" class="card-link gallery-trigger" data-project="${escapeAttr(project.id)}">Captures (${project.gallery.length})</button>`
    );
  }

  return buttons.length
    ? `<div class="card-links">${buttons.join("")}</div>`
    : "";
}

function buildCard(project) {
  const tags = project.stack
    .map((tech) => `<span class="tag">${tech}</span>`)
    .join("");

  return `
    <div class="col">
      <div class="card sbg project-card">
        <div class="card-img-top" style="background-image: url('${project.image}'); background-size: cover; background-position: center; background-color: var(--primary-light);">
          <div class="card-img-top card-img-overlay-tint"></div>
        </div>
        <div class="card-body">
          <h5 class="card-title scol">${project.title}</h5>
          <p class="card-subtitle">${project.subtitle}</p>
          <div class="card-tags">${tags}</div>
          ${buildLinks(project)}
        </div>
      </div>
    </div>
  `;
}

function renderProjects(filter) {
  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  cardContainer.innerHTML = visible.map(buildCard).join("");
}

if (filterBar) {
  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    filterBar
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.toggle("active", btn === button));

    renderProjects(button.dataset.filter);
  });
}

renderProjects("all");

// ----------------------
// Screenshot lightbox
const lightbox = document.getElementById("project-lightbox");

if (lightbox && cardContainer) {
  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCounter = lightbox.querySelector(".lightbox-counter");
  const lightboxTitle = lightbox.querySelector(".lightbox-title");
  let currentGallery = [];
  let currentIndex = 0;

  function showSlide(index) {
    const total = currentGallery.length;
    currentIndex = (index + total) % total;
    lightboxImage.src = currentGallery[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${total}`;
  }

  function openLightbox(project) {
    currentGallery = project.gallery;
    lightboxTitle.textContent = project.title;
    showSlide(0);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.classList.remove("lightbox-open");
  }

  cardContainer.addEventListener("click", (event) => {
    const trigger = event.target.closest(".gallery-trigger");
    if (!trigger) return;

    const project = projects.find((item) => item.id === trigger.dataset.project);
    if (project && project.gallery.length) openLightbox(project);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target.closest(".lightbox-next")) showSlide(currentIndex + 1);
    else if (event.target.closest(".lightbox-prev")) showSlide(currentIndex - 1);
    else if (
      event.target.closest(".lightbox-close") ||
      event.target === lightbox
    )
      closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    else if (event.key === "ArrowRight") showSlide(currentIndex + 1);
    else if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
  });
}
