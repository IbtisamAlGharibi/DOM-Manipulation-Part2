const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const profileContainer = document.getElementById("profileContainer");
const repoContainer = document.getElementById("repoContainer");
const statusMessage = document.getElementById("statusMessage");

function clearResults() {
    profileContainer.innerHTML = "";
    repoContainer.innerHTML = "";
    statusMessage.textContent = "";
}

function displayUserProfile(user) {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";
    profileCard.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}">
        <h2>${user.name || user.login}</h2>
        <p>@${user.login}</p>
        <p>${user.bio || "No bio available"}</p>
        <p>Followers: ${user.followers}</p>
        <p>Following: ${user.following}</p>
        <p>Public Repos: ${user.public_repos}</p>
        <a href="${user.html_url}" target="_blank">View Profile</a>
    `;
    profileContainer.appendChild(profileCard);
}

function displayRepositories(repos) {
    repoContainer.innerHTML = "";
    if (!repos || repos.length === 0) {
        repoContainer.innerHTML = "<p>This user has no public repositories.</p>";
        return;
    }
    repos.slice(0, 20).forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.innerHTML = `
            <h3>
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </h3>
            <p>${repo.description || "No description"}</p>
            <span>${repo.language || "N/A"}</span>
            <p>Stars: ${repo.stargazers_count}</p>
            <p>Forks: ${repo.forks_count}</p>
        `;
        repoContainer.appendChild(repoCard);
    });
}

async function fetchUserData(username) {
    statusMessage.textContent = "Loading...";
    clearResults();
    try {
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        if (!profileRes.ok) {
            if (profileRes.status === 404) {
                throw new Error("User not found");
            }
            throw new Error("Error: " + profileRes.status);
        }
        const userData = await profileRes.json();
        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`);
        const repoData = await repoRes.json();
        displayUserProfile(userData);
        displayRepositories(repoData);
        statusMessage.textContent = `Showing results for ${username}`;
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

function searchUser() {
    const username = searchInput.value.trim();
    if (username === "") {
        statusMessage.textContent = "Please enter a username.";
        return;
    }
    fetchUserData(username);
    searchInput.value = "";
}

searchBtn.addEventListener("click", searchUser);
searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchUser();
    }
});