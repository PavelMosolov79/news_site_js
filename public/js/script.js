document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("posts-container");
    const paginationContainer = document.getElementById("pagination-container");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const postsPerPage = 10;
    let currentPage = 1;
    let filteredPosts = [];

    async function fetchData(url) {
        const response = await fetch(url);
        return response.json();
    }

    function displayPosts(posts, page) {
        postsContainer.innerHTML = "";
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = page * postsPerPage;

        for (let i = startIndex; i < endIndex; i++) {
            const post = posts[i];
            if (!post) break;

            const postElement = document.createElement("div");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <button class="show-comments-btn">Показать комментарии</button>
                <div class="comments"></div>
            `;
            postsContainer.appendChild(postElement);

            const showCommentsBtn = postElement.querySelector(".show-comments-btn");
            const commentsContainer = postElement.querySelector(".comments");

            showCommentsBtn.addEventListener("click", async () => {
                if (commentsContainer.innerHTML === "") {
                    const comments = await fetchData(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
                    comments.forEach((comment) => {
                        const commentElement = document.createElement("div");
                        commentElement.classList.add("comment");
                        commentElement.innerHTML = `
                            <h3>${comment.name}</h3>
                            <p>${comment.body}</p>
                            <p>Email: ${comment.email}</p>
                        `;
                        commentsContainer.appendChild(commentElement);
                    });
                    showCommentsBtn.textContent = "Скрыть комментарии";
                } else {
                    commentsContainer.innerHTML = "";
                    showCommentsBtn.textContent = "Показать комментарии";
                }
            });
        }
    }

    function displayPagination(posts, currentPage) {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(posts.length / postsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.addEventListener("click", () => {
                currentPage = i;
                displayPosts(posts, currentPage);
                displayPagination(posts, currentPage);
            });
            if (i === currentPage) {
                pageButton.disabled = true;
            }
            paginationContainer.appendChild(pageButton);
        }
    }

    function performSearch(searchTerm, posts) {
        searchTerm = searchTerm.toLowerCase();
        filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayPosts(filteredPosts, currentPage);
        displayPagination(filteredPosts, currentPage);
    }

    async function initialize() {
        const posts = await fetchData("https://jsonplaceholder.typicode.com/posts");
        displayPosts(posts, currentPage);
        displayPagination(posts, currentPage);

        searchButton.addEventListener("click", () => {
            const searchTerm = searchInput.value;
            performSearch(searchTerm, posts);
        });
    }

    initialize();
});