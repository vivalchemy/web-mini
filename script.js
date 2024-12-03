// URL of your GitHub repository
const repoUrl = "https://api.github.com/repos/vivalchemy/web-mini/contents";

// Fetch project data from GitHub
async function fetchProjects() {
  try {
    const response = await fetch(repoUrl);
    const data = await response.json();

    if (Array.isArray(data)) {
      generateProjectCards(data);
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
}

// Generate project cards dynamically
function generateProjectCards(projects) {
  const projectsGrid = document.getElementById("projects-grid");
  projectsGrid.innerHTML = ""; // Clear the grid

  projects.forEach((project) => {
    // Only display folders (i.e., directories)
    if (project.type === "dir") {
      const card = document.createElement("div");
      card.classList.add("project-card");

      const cardTitle = document.createElement("h3");
      cardTitle.textContent = project.name; // Project name
      card.appendChild(cardTitle);

      const projectLink = document.createElement("a");
      projectLink.href = project.html_url; // GitHub URL for the project
      projectLink.textContent = "View Project";
      card.appendChild(projectLink);

      projectsGrid.appendChild(card);
    }
  });
}

// Fetch and display projects on page load
fetchProjects();
