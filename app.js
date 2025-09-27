// --- CONFIGURATION & GLOBALS ---
let userClickedSort = false; // Flag to re-sort when user scrolls to bottom

// --- UTILS ---

/** Safely removes an element or selector from the DOM */
function safeRemove(selectorOrElement) {
  try {
    const el =
      typeof selectorOrElement === "string"
        ? document.querySelector(selectorOrElement)
        : selectorOrElement;
    if (el) el.remove();
  } catch (e) {
    console.warn("Failed to remove element:", selectorOrElement, e);
  }
}

/** Observes DOM changes on a target selector and runs callback */
function observeDOM(targetSelector, callback) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const observer = new MutationObserver(callback);
  observer.observe(target, { childList: true, subtree: true });

  // Run once immediately (in case DOM is already ready)
  callback();
}

// --- CLEAN-UP HANDLERS ---

function removeGoogleAIContent() {
  if (location.hostname !== "www.google.com") return;
  safeRemove("#Odp5De");
  safeRemove("#eKIzJc");
  safeRemove(".olrp5b");
  safeRemove("#taw");
}

function removeYouTubeMetadata() {
  if (location.hostname !== "www.youtube.com") return;
  safeRemove("#expandable-metadata");
}

// --- SORTING LOGIC ---

function sortItems() {
  const itemsContainer = document.querySelector("#content #items");
  if (!itemsContainer) return;

  const items = Array.from(
    itemsContainer.querySelectorAll("ytmusic-two-row-item-renderer")
  );
  if (!items.length) return;

  items.sort((a, b) => {
    const linkA =
      a.querySelector("div span yt-formatted-string a")?.textContent?.trim() ||
      "";
    const linkB =
      b.querySelector("div span yt-formatted-string a")?.textContent?.trim() ||
      "";

    const yearA = parseInt(
      a
        .querySelector("yt-formatted-string span:last-child")
        ?.textContent?.trim() || "0",
      10
    );
    const yearB = parseInt(
      b
        .querySelector("yt-formatted-string span:last-child")
        ?.textContent?.trim() || "0",
      10
    );

    // First, sort alphabetically
    const titleComparison = linkA.localeCompare(linkB);
    if (titleComparison !== 0) return titleComparison;

    // Then by year (descending)
    return yearB - yearA;
  });

  // Reflow-safe re-insertion
  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.appendChild(item));
  itemsContainer.appendChild(fragment);
}

// --- SORT BUTTON CREATION ---

function createSortButtonOnce() {
  if (document.querySelector(".sorter-button")) return;
  createSortButton();
}

function createSortButton() {
  const container = document.querySelector("#chips");
  if (!container) return;

  // Using a proper button for better resilience
  const button = document.createElement("ytmusic-chip-cloud-chip-renderer");
  button.classList.add(
    "style-scope",
    "ytmusic-chip-cloud-renderer",
    "sorter-button"
  );
  button.setAttribute("chip-style", "STYLE_UNKNOWN");

  button.addEventListener("click", () => {
    userClickedSort = true;
    sortItems();
  });

  container.appendChild(button);
  const insideButton = button.querySelector("a");

  const textButton = document.createElement("div");
  textButton.classList.add(
    "text",
    "style-scope",
    "ytmusic-chip-cloud-chip-renderer"
  );
  textButton.textContent = "Channel"; // Set button text
  insideButton.appendChild(textButton);
}

// --- SCROLL RE-SORT ---

window.addEventListener("scroll", () => {
  if (!userClickedSort) return;

  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.scrollY + window.innerHeight;

  if (scrollPosition >= documentHeight - 100) {
    sortItems();
  }
});

// --- MAIN OBSERVER ---

observeDOM("body", () => {
  removeGoogleAIContent();
  removeYouTubeMetadata();

  if (location.hostname === "music.youtube.com") {
    createSortButtonOnce();
  }
});
