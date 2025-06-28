document.addEventListener("DOMContentLoaded", main);

function main(){
    displayPosts();
    addPostListener();
}

constnPOST_URL = "http://localhost:3000/posts";
const USER_URL = "http://localhost:3000/users";
const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");

function displayPosts() {
  fetch(POST_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = ""; // Clear existing
      posts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.className = "post-card";
        postItem.textContent = post.title;
        postItem.dataset.id = post.id;

        // Add click event for each title
        postItem.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postItem);
      });
    });
}

function handlePostClick(postId) {
  fetch(`${POST_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      // Fetch author details using authorId
      fetch(`${USER_URL}/${post.authorId}`)
        .then(res => res.json())
        .then(author => {
          postDetail.innerHTML = `
            <h2>${post.title}</h2>
            <p><strong>By:</strong> ${author.name}</p>
            <p>${post.content}</p>
          `;
        });
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const title = form.title.value;
    const author = form.author.value;
    const content = form.content.value;

    const newPost = {
      id: Date.now(), // temporary ID
      title,
      authorId: "Unknown", // since form doesn't link to users in db
      content
    };

    const postItem = document.createElement("div");
    postItem.className = "post-card";
    postItem.textContent = newPost.title;
    postItem.addEventListener("click", () => {
      postDetail.innerHTML = `
        <h2>${newPost.title}</h2>
        <p><strong>By:</strong> ${author}</p>
        <p>${newPost.content}</p>
      `;
    });

    postList.appendChild(postItem);
    form.reset();
  });
}
