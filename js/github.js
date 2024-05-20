// Get references to the search input, search form, and user info container
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector(".search-form");
const userInfo = document.querySelector(".user-info");

// Get references to the API key form and input
const apiKeyForm = document.querySelector(".api-key-form");
const apiKeyInput = document.querySelector(".api-key-input");

// Add an event listener to the search form's submit event
searchForm.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  // Get the trimmed username from the search input
  const username = searchInput.value.trim();
  // Check if a username was provided
  if (username) {
    // Call the fetchGitHubUser function with the username
    fetchGitHubUser(username);
  }
});

// Add an event listener to the API key form's submit event
apiKeyForm.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  // Get the API token from the input field
  const apiToken = apiKeyInput.value.trim();

  // Store the API token in the local storage
  localStorage.setItem("githubApiToken", apiToken);

  // Show the interactive demo section
  apiKeyForm.style.display = "none";
  interactiveDemoSection.style.display = "block";
});

// Function to fetch the GitHub user information
function fetchGitHubUser(username) {
  // Make a fetch request to the GitHub API with the username
  fetch(`https://api.github.com/users/${username}`)
    .then((response) => {
      // Check if the response is successful
      if (response.ok) {
        // Parse the response as JSON
        return response.json();
      }
      // Display an error message if the response is not successful
      userInfo.innerHTML =
        "<p>Error: Could not fetch GitHub user information.</p>";
      // Return an error object
      return Promise.reject(new Error(`HTTP error ${response.status}`));
    })
    .then((userData) => {
      // Call the displayUserInfo function with the user data
      displayUserInfo(userData);
    })
    .catch((error) => {
      // Log any errors that occurred during the fetch request
      console.error("Error fetching GitHub user:", error);
    });
}
// Function to display the user information
function displayUserInfo(userData) {
  // Create a new div element for the user card
  const userCard = document.createElement("div");
  userCard.classList.add("user-card");

  // Create an image element for the user's avatar
  const avatar = document.createElement("img");
  avatar.src = userData.avatar_url;
  avatar.alt = `${userData.login}'s avatar`;

  // Create an h2 element for the user's name (or login if name is not available)
  const name = document.createElement("h2");
  name.textContent = userData.name || userData.login;

  // Create a p element for the user's username
  const username = document.createElement("p");
  username.textContent = `@${userData.login}`;

  // Create a p element for the user's bio (or a default message if bio is not available)
  const bio = document.createElement("p");
  bio.textContent = userData.bio || "No bio available.";

  // Create a p element for the user's follower count
  const followers = document.createElement("p");
  followers.textContent = `Followers: ${userData.followers}`;

  // Create a p element for the user's following count
  const following = document.createElement("p");
  following.textContent = `Following: ${userData.following}`;

  // Append all the elements to the user card
  userCard.appendChild(avatar);
  userCard.appendChild(name);
  userCard.appendChild(username);
  userCard.appendChild(bio);
  userCard.appendChild(followers);
  userCard.appendChild(following);

  // Clear the previous user info and append the new user card
  userInfo.innerHTML = "";
  userInfo.appendChild(userCard);
}

// Interactive Demo Functionality
const demoButtons = document.querySelectorAll(".demo-btn");
const demoOutput = document.querySelector(".demo-output");
const interactiveDemoSection = document.querySelector(".interactive-demo");

// Get the user's GitHub API token from the local storage
const apiToken = localStorage.getItem("githubApiToken");

//Function to display the user's GitHub repositories
async function displayRepositories(btn) {
  try {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (response.ok) {
      const repos = await response.json();
      let repoNames = repos.map((repo) => `- ${repo.name}`).join("\n");
      demoOutput.textContent = `Your GitHub Repositories:\n${repoNames}`;
      updateBadge("display-repos");
    } else {
      const error = await response.json();
      demoOutput.textContent = `Error displaying repositories: ${error.message}`;
      console.error("Error displaying repositories:", error);
      btn.disabled = true;
    }
  } catch (error) {
    demoOutput.textContent = "Error displaying repositories.";
    console.error("Error displaying repositories:", error);
    btn.disabled = true;
  }
}
// Function to Create the user's GitHub repositories
async function createRepository(btn) {
  try {
    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ name: "new-repo" }),
    });

    if (response.ok) {
      demoOutput.textContent = "Repository created successfully!";
      updateBadge("create-repos");
    } else {
      const { message } = await response.json();
      demoOutput.textContent = `Error creating repository: ${message}`;
      console.error("Error creating repository:", message);
      btn.disabled = true;
    }
  } catch (error) {
    demoOutput.textContent = "Error creating repository.";
    console.error("Error creating repository:", error);
    btn.disabled = true;
  }
}
// Function to list the user's GitHub repositories
async function listRepositories(btn) {
  try {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (response.ok) {
      const repos = await response.json();
      demoOutput.textContent = `Repositories listed successfully! (${repos.length})`;
      updateBadge("list-repo");
    } else {
      const error = await response.json();
      demoOutput.textContent = `Error listing repositories: ${error.message}`;
      console.error("Error listing repositories:", error);
      btn.disabled = true;
    }
  } catch (error) {
    demoOutput.textContent = "Error listing repositories.";
    console.error("Error listing repositories:", error);
    btn.disabled = true;
  }
}

// Function to update the badge image, add a shake animation, and update the output
function updateBadge(action) {
  const badges = document.querySelectorAll(".badge");
  badges.forEach((badge) => {
    const badgeText = badge.querySelector("p").textContent;
    if (badgeText === "List Repository" && action === "list-repo") {
      badge.querySelector("img").classList.add("shake");
      badge.querySelector(
        "p",
      ).textContent = `List Repository clicked . 1 trophy added.`;
    } else if (
      badgeText === "Display Repository" &&
      action === "display-repos"
    ) {
      badge.querySelector("img").classList.add("shake");
      badge.querySelector(
        "p",
      ).textContent = `Display Repository clicked. 1 trophy added.`;
    } else if (badgeText === "Create Repository" && action === "create-repos") {
      badge.querySelector("img").classList.add("shake");
      badge.querySelector(
        "p",
      ).textContent = `Create Repository clicked. 1 trophy added.`;
    }
  });
}
// Check if the API token is available
if (apiToken) {
  // Loop through each button in the demoButtons array
  demoButtons.forEach((btn) => {
    // Add a click event listener to each button
    btn.addEventListener("click", () => {
      // Get the action associated with the button (e.g., 'create-repo', 'list-repos')
      const action = btn.dataset.action;
      // Use a switch statement to call the appropriate function based on the action
      switch (action) {
        case "create-repo":
          createRepository(btn);
          break;
        case "list-repos":
          listRepositories(btn);
          break;
        case "display-repos":
          displayRepositories(btn);
          break;
      }
    });
  });

  const displayReposBtn = document.querySelector(
    '.demo-btn[data-action="display-repos"]',
  );
  displayReposBtn.addEventListener("click", () => {
    displayRepositories(displayReposBtn);
  });

  const createRepositoryBtn = document.querySelector(
    '.demo-btn[data-action="create-repos"]',
  );
  createRepositoryBtn.addEventListener("click", () => {
    createRepository(createRepositoryBtn);
  });
}
// This example adapted from "REST API GitHub" at https://docs.github.com/en/rest/about-the-rest-api/about-the-rest-api
