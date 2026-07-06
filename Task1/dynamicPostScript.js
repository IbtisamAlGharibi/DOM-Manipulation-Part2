const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");
const addBtn = document.getElementById("addBtn");
const statuMessage = document.getElementById("statusMessage");
const refreshBtn = document.getElementById("refreshBtn");

async function fetchPosts() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!response.ok) {
            throw new Error();
        }
        const posts = await response.json();
        displayPosts(posts);
        statusMessage.textContent = "";
    } catch (error) {
        statusMessage.textContent = "Failed to load posts.";
    }
}
function displayPosts(posts) {
    postsContainer.innerHTML = "";
    posts.forEach(post => {
        const postCard = document.createElement("div");
        postCard.className = "post-card";
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <small>ID: ${post.id}</small><br>
            <button class="delete-btn" data-id="${post.id}">Delete</button>
        `;
        postsContainer.appendChild(postCard);
    });
}
async function addPost() {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (title === "" || body === "") {
        statusMessage.textContent = "Please enter both title and body.";
        return;
    }
    const postData = {
        title: title,
        body: body
    };
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error();
        }
        const newPost = await response.json();
        statusMessage.textContent = "Post added successfully.";
        titleInput.value = "";
        bodyInput.value = "";
        const postCard = document.createElement("div");
        postCard.className = "post-card";
        postCard.innerHTML = `
            <h3>${newPost.title}</h3>
            <p>${newPost.body}</p>
            <small>ID: ${newPost.id}</small><br>
            <button class="delete-btn" data-id="${newPost.id}">Delete</button>
        `;
        postsContainer.prepend(postCard);
    } catch (error) {
        statusMessage.textContent = "Failed to add post.";
    }
}
async function deletePost(postId, postElement) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error();
        }
        postElement.remove();
        statusMessage.textContent = "Post deleted successfully.";
    } catch (error) {
        statusMessage.textContent = "Failed to delete post.";
    }
}
addBtn.addEventListener("click", addPost);
refreshBtn.addEventListener("click", fetchPosts);

postsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const postId = event.target.dataset.id;
        const postElement = event.target.parentElement;
        deletePost(postId, postElement);
    }
});
fetchPosts();