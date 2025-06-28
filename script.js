document.addEventListener("DOMContentLoaded", main);

const POST_URL = "http://localhost:3001/posts";
const USER_URL = "http://localhost:3001/users";

const postList = document.getElementById("post-list");
const postDetail = document.getElementById("post-detail");

function main(){
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(POST_URL)
    .then(res => res.json())
    .then(posts => {
      postList.innerHTML = "";
      posts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.className = "post-card";
        postItem.textContent = post.title;
        postItem.dataset.id = post.id;

        postItem.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(postItem);
      });
    });
}

function handlePostClick(postId) {
  fetch(`${POST_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      // If authorId exists, get full name from users
      if (post.authorId) {
        fetch(`${USER_URL}/${post.authorId}`)
          .then(res => res.json())
          .then(author => {
            postDetail.innerHTML = `
              <h2>${post.title}</h2>
              <p><strong>By:</strong> ${author.name}</p>
              <p>${post.content}</p>
            `;
          });
      } else {
        postDetail.innerHTML = `
          <h2>${post.title}</h2>
          <p><strong>By:</strong> Unknown</p>
          <p>${post.content}</p>
        `;
      }
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    const newPost = {
      title,
      authorName: author,
      content
    };

    const postItem = document.createElement("div");
    postItem.className = "post-card";
    postItem.textContent = newPost.title;
    postItem.addEventListener("click", () => {
      postDetail.innerHTML = `
        <h2>${newPost.title}</h2>
        <p><strong>By:</strong> ${newPost.authorName}</p>
        <p>${newPost.content}</p>
      `;
    });

    postList.appendChild(postItem);
    form.reset();
  });
}
