const locale = document.documentElement.lang?.slice(0, 2) || "nl";
const messages = {
  nl: {
    menuOpen: "Menu openen",
    menuClose: "Menu sluiten",
    call: "Bel",
    subject: "Websiteaanvraag",
    request: "Rondleiding",
    formSending: "Even versturen…",
    formSuccess: "Bedankt. Je aanvraag is goed ontvangen. Marie-Hélène neemt persoonlijk contact met je op.",
    formError: "Het versturen lukt momenteel niet. Probeer het later opnieuw of gebruik de belknop.",
    fields: {
      naam: "Naam",
      email: "E-mail",
      telefoon: "Telefoon",
      type: "Type aanvraag",
      tour: "Gewenste rondleiding",
      datum: "Voorkeursdatum",
      deelnemers: "Aantal deelnemers",
      taal: "Gewenste taal",
      bericht: "Bericht",
    },
  },
  fr: {
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    call: "Appeler",
    subject: "Demande via le site",
    request: "Visite guidée",
    formSending: "Envoi en cours…",
    formSuccess: "Merci. Votre demande a bien été reçue. Marie-Hélène vous contactera personnellement.",
    formError: "L’envoi ne fonctionne pas pour le moment. Réessayez plus tard ou utilisez le bouton d’appel.",
    fields: {
      naam: "Nom",
      email: "E-mail",
      telefoon: "Téléphone",
      type: "Type de demande",
      tour: "Visite souhaitée",
      datum: "Date souhaitée",
      deelnemers: "Nombre de participants",
      taal: "Langue souhaitée",
      bericht: "Message",
    },
  },
  en: {
    menuOpen: "Open menu",
    menuClose: "Close menu",
    call: "Call",
    subject: "Website enquiry",
    request: "Guided tour",
    formSending: "Sending…",
    formSuccess: "Thank you. Your request has been received. Marie-Hélène will contact you personally.",
    formError: "Your request could not be sent right now. Please try again later or use the call button.",
    fields: {
      naam: "Name",
      email: "Email",
      telefoon: "Phone",
      type: "Type of request",
      tour: "Preferred tour",
      datum: "Preferred date",
      deelnemers: "Number of participants",
      taal: "Preferred language",
      bericht: "Message",
    },
  },
};
const copy = messages[locale] || messages.nl;

const menuButton = document.querySelector(".menu-btn");
const navigationShell = document.querySelector(".nav-shell");

menuButton?.addEventListener("click", () => {
  const isOpen = navigationShell?.classList.toggle("open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? copy.menuClose : copy.menuOpen);
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navigationShell?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", copy.menuOpen);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigationShell?.classList.contains("open")) {
    navigationShell.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.focus();
  }
});

const topButton = document.querySelector(".sticky-top");
const syncTopButton = () => topButton?.classList.toggle("show", window.scrollY > 640);

window.addEventListener("scroll", syncTopButton, { passive: true });
syncTopButton();
topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const galleryImage = document.querySelector(".gallery-stage img[data-images]");
const galleryCount = document.querySelector(".gallery-count");

if (galleryImage && galleryCount) {
  const images = galleryImage.dataset.images.split("|").filter(Boolean);
  const alts = galleryImage.dataset.alts?.split("|") ?? [];
  let currentIndex = 0;

  const showImage = (nextIndex) => {
    currentIndex = (nextIndex + images.length) % images.length;
    galleryImage.src = images[currentIndex];
    if (alts[currentIndex]) galleryImage.alt = alts[currentIndex];
    galleryCount.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  document.querySelector(".gallery-next")?.addEventListener("click", () => showImage(currentIndex + 1));
  document.querySelector(".gallery-prev")?.addEventListener("click", () => showImage(currentIndex - 1));

  let touchStartX = 0;
  galleryImage.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  galleryImage.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 44) showImage(currentIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });
}

const tourFromQuery = new URLSearchParams(window.location.search).get("tour");
const tourSelect = document.querySelector("select[name='tour']");
if (tourFromQuery && tourSelect) {
  const option = [...tourSelect.options].find((item) => item.value === tourFromQuery);
  if (option) tourSelect.value = tourFromQuery;
}

document.querySelector(".contact-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector("button[type='submit']");

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());
  payload.locale = locale;

  if (status) status.textContent = copy.formSending;
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Contact request failed");
    form.reset();
    if (status) status.textContent = copy.formSuccess;
  } catch {
    if (status) status.textContent = copy.formError;
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
