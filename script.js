const opening = document.getElementById("opening");
const entryButton = document.getElementById("entryButton");
const cloudBase = document.getElementById("cloudBase");
const portfolioModal = document.getElementById("portfolioModal");
const portfolioModalImage = document.getElementById("portfolioModalImage");
const portfolioModalClose = document.getElementById("portfolioModalClose");
const portfolioImageLinks = document.querySelectorAll(".open-portfolio-image");
const sparkIcons = ["🍓", "🥧", "❤"];
let hasEntered = false;

if (opening) {
  // Never auto-enter: keep the opening visible until explicit click.
  opening.classList.remove("hide");
}

function spawnEntrySparks(options) {
  if (!entryButton) {
    return;
  }

  const {
    count,
    minDistance,
    maxDistance,
    minDuration,
    maxDuration,
    jitter,
  } = options;

  const rect = entryButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement("span");
    spark.className = "entry-spark";
    spark.textContent = sparkIcons[Math.floor(Math.random() * sparkIcons.length)];

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * jitter;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const duration = minDuration + Math.random() * (maxDuration - minDuration);
    const size = 22 + Math.random() * 34;

    spark.style.left = `${centerX}px`;
    spark.style.top = `${centerY}px`;
    spark.style.setProperty("--dx", `${dx}px`);
    spark.style.setProperty("--dy", `${dy}px`);
    spark.style.setProperty("--dur", `${duration}ms`);
    spark.style.setProperty("--size", `${size}px`);

    fragment.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }

  document.body.appendChild(fragment);
}

if (entryButton && opening) {
  entryButton.addEventListener("click", () => {
    if (hasEntered) {
      return;
    }
    hasEntered = true;

    entryButton.classList.add("entering");
    // Stage 1: nearby burst around the button.
    spawnEntrySparks({
      count: 32,
      minDistance: 40,
      maxDistance: 180,
      minDuration: 620,
      maxDuration: 980,
      jitter: 1.1,
    });

    // Stage 2: delayed wider scatter for a firework tail.
    setTimeout(() => {
      const viewRadius = Math.hypot(window.innerWidth, window.innerHeight);
      spawnEntrySparks({
        count: 64,
        minDistance: viewRadius * 0.24,
        maxDistance: viewRadius * 0.72,
        minDuration: 900,
        maxDuration: 1500,
        jitter: 1.9,
      });
    }, 140);

    // Stage 3: another bloom to make the fullscreen burst feel richer.
    setTimeout(() => {
      const viewRadius = Math.hypot(window.innerWidth, window.innerHeight);
      spawnEntrySparks({
        count: 48,
        minDistance: viewRadius * 0.3,
        maxDistance: viewRadius * 0.78,
        minDuration: 1050,
        maxDuration: 1750,
        jitter: 2.1,
      });
    }, 300);

    setTimeout(() => {
      opening.classList.add("hide");
    }, 1380);
  });
}

if (cloudBase) {
  const toggleCloud = () => {
    cloudBase.classList.toggle("collapsed");
  };

  cloudBase.addEventListener("click", toggleCloud);
  cloudBase.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCloud();
    }
  });
}

if (portfolioModal && portfolioModalImage && portfolioImageLinks.length > 0) {
  const closePortfolioModal = () => {
    portfolioModal.classList.remove("show");
    portfolioModal.setAttribute("aria-hidden", "true");
    portfolioModalImage.removeAttribute("src");
  };

  portfolioImageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const imageSrc = link.getAttribute("data-image") || link.getAttribute("href");
      if (!imageSrc) {
        return;
      }

      portfolioModalImage.setAttribute("src", imageSrc);
      portfolioModal.classList.add("show");
      portfolioModal.setAttribute("aria-hidden", "false");
    });
  });

  if (portfolioModalClose) {
    portfolioModalClose.addEventListener("click", closePortfolioModal);
  }

  portfolioModal.addEventListener("click", (event) => {
    if (event.target === portfolioModal) {
      closePortfolioModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && portfolioModal.classList.contains("show")) {
      closePortfolioModal();
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((section) => {
  observer.observe(section);
});
