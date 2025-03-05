function waitForElement(selector, callback) {
    const checkElement = () => {
        const element = document.querySelector(selector);
        if (element && !document.querySelector("#sort-button")) { // Avoid duplicate buttons
            callback(element);
            return true;
        }
        return false;
    };

    // Check immediately in case element is already there
    if (checkElement()) return;

    // Fallback: Check every 500ms in case MutationObserver fails
    const intervalId = setInterval(() => {
        if (checkElement()) clearInterval(intervalId);
    }, 500);

    // Use MutationObserver to detect dynamic changes
    const observer = new MutationObserver(() => {
        if (checkElement()) {
            observer.disconnect();
            clearInterval(intervalId);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function observePageChanges() {
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      waitForElement("#start-items", createSortButton);
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

  // Sort items based on the link text in <a>
  items.sort((a, b) => {
    const linkA =
      a.querySelector("div span yt-formatted-string a")?.textContent?.trim() ||
      "";
    const linkB =
      b.querySelector("div span yt-formatted-string a")?.textContent?.trim() ||
      "";
    return linkA.localeCompare(linkB);
  });

  // Reappend the sorted items back into the container
  items.forEach((item) => itemsContainer.appendChild(item));
}

// Function to create the manual sorting button
function createSortButton() {
  // Create a button element with the specified classes
  const button = document.createElement("ytmusic-chip-cloud-chip-renderer");
  button.classList.add("style-scope", "ytmusic-chip-cloud-renderer");
  button.setAttribute("chip-style", "STYLE_UNKNOWN");

  // Add click event listener to the button
  button.addEventListener("click", () => {
    sortItems(); // Call sortItems when the button is clicked
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
    sortItems();
  }
});

// Initial setup
waitForElement("#start-items", createSortButton);
observePageChanges();
