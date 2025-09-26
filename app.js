let userClickedSort = false; // Flag to track if the user clicked the sort button

function waitForElement(selector, callback) {
  const checkElement = () => {
    const element = document.querySelector(selector);
    if (element && !document.querySelector(".sorter-button")) {
      // Avoid duplicate buttons
      callback(element);
      return true;
    }
    return false;
  };

  // Check immediately in case element is already there
  if (checkElement()) return;
}

function observePageChanges() {
  let bullshitRemoved = false;
  let bullshitSearchRemoved = false;
  setInterval(() => {
    if (window.location.href.includes("https://www.google.com")) {
      if (!bullshitSearchRemoved) {
        try {
          // Get the h2 element
          const h2Element = document.querySelector(".VW3apb");
          // Find the closest parent with the class ULSxyf
          const aiBullshitSearch = h2Element?.closest("#Odp5De");
          const aiBullshitSearch2 = document.getElementById("eKIzJc");
          const aiBullshitSearch3 = document.querySelector('.olrp5b');
          aiBullshitSearch3.remove();
          aiBullshitSearch2.remove();
          aiBullshitSearch.remove();
          bullshitSearchRemoved = true;
        } catch {}
      }
    }
    if (window.location.href.includes("https://www.youtube.com")) {
      if (!bullshitRemoved) {
        try {
          const aiBullshit1 = document.getElementById("expandable-metadata");
          aiBullshit1.remove();
          bullshitRemoved = true;
        } catch {}
      }
    }
    if (window.location.href.includes("https://music.youtube.com")) {
      const button = document.querySelector(".sorter-button"); // Look for the sort button
      if (!button) {
        userClickedSort = false;
        waitForElement("#start-items", createSortButton);
      }
    }
  }, 1000); // Check every second for navigation changes
}

function sortItems() {
  const itemsContainer = document.querySelector("#content #items");

  if (!itemsContainer) {
    return;
  }

  // Get all items inside #items container
  const items = Array.from(
    itemsContainer.querySelectorAll("ytmusic-two-row-item-renderer")
  );

  if (items.length === 0) {
    return;
  }

  // Sort items based on title first and then year
  items.sort((a, b) => {
    // Get the text inside the <a> tag
    const linkA =
      a.querySelector("div span yt-formatted-string a")?.textContent?.trim() ||
      "";
    const linkB =
      b.querySelector("div span yt-formatted-string a")?.textContent?.trim() ||
      "";

    // Get the last child (span) inside yt-formatted-string for the year
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

    // First, sort alphabetically by title
    const titleComparison = linkA.localeCompare(linkB);
    if (titleComparison !== 0) {
      return titleComparison;
    }

    // If titles are the same, sort by year (descending order)
    return yearB - yearA;
  });

  // Reappend the sorted items back into the container
  items.forEach((item) => itemsContainer.appendChild(item));
}

// Function to create the manual sorting button
function createSortButton() {
  // Create a button element with the specified classes
  const button = document.createElement("ytmusic-chip-cloud-chip-renderer");
  button.classList.add(
    "style-scope",
    "ytmusic-chip-cloud-renderer",
    "sorter-button"
  );
  button.setAttribute("chip-style", "STYLE_UNKNOWN");

  // Add click event listener to the button
  button.addEventListener("click", () => {
    userClickedSort = true; // Set flag to true when user clicks the button;
    sortItems();
  });

  // Append the button to the body or any other container (e.g., #content)
  const container = document.querySelector("#chips"); // Or wherever you'd like the button to appear
  if (container) {
    container.appendChild(button);
  }

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

window.addEventListener("scroll", () => {
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.scrollY + window.innerHeight;

  // Check if we are near the bottom of the page
  if (scrollPosition >= documentHeight - 100) {
    // 100px from bottom
    if (userClickedSort) {
      sortItems();
    }
  }
});

// Initial setup
observePageChanges();
