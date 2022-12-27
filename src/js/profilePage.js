"use strict";

let session = new Session();
let session_id = session.getSessionOfCurrentUser();

if (session_id !== "") {
  async function populateUserData() {
    const user = new User();
    let userData = await user.getCurrentUser(session_id);

    let username = `${userData.username[0].toUpperCase()}${userData.username.slice(
      1
    )}`;

    if (userData.birthDate !== undefined && userData.birthDate > 3) {
      let birtDateArr = [...userData.birthDate].join("").split(".");

      document.querySelector(
        "#day"
      ).value = `<option selected value=${+birtDateArr[0]}>${+birtDateArr[0]}</option>`;
    }

    if (
      userData.city !== undefined &&
      userData.city.length > 0 &&
      !Number(userData.city)
    ) {
      document.querySelector(
        "#edit_city"
      ).value = `${userData.city[0].toUpperCase()}${userData.city.slice(1)}`;
    }

    if (
      userData.phone !== undefined &&
      userData.phone.length > 3 &&
      Number(userData.phone)
    ) {
      document.querySelector("#edit_phone").value = `${userData.phone}`;
    }

    document.querySelector(
      "#edit_korisnicko_ime"
    ).value = `${userData.username}`;
    document.querySelector("#edit_email").value = `${userData.email}`;

    document.querySelector(".curentUser-username").textContent = `${username}`;
    document.querySelector(
      ".curentUser-email"
    ).textContent = `${userData.email}`;

    let birthDate = userData.birthDate;

    // let arr = [...birthDate].join("").split(".");

    if (birthDate !== undefined && birthDate.length > 3) {
      document.querySelector(".box-user-info-list").insertAdjacentHTML(
        "beforeend",
        `<li>     <p>
              <i class="ph-cake-fill info-icon"></i>
                <span>Birth date: </span>
                </p>
              <span class="curentUser-birthDate">${birthDate}</span>
            </li>
      `
      );
    }

    if (
      userData.phone !== undefined &&
      userData.phone.length > 3 &&
      Number(userData.phone)
    ) {
      document.querySelector(".box-user-info-list").insertAdjacentHTML(
        "beforeend",
        `<li>
      <p>
        <ion-icon class="info-icon" name="call"></ion-icon>
        <span>Phone :</span>
      </p>
      <span class="curentUser-phone">${userData.phone}</span>
    </li>`
      );
    }

    if (
      userData.city !== undefined &&
      userData.city.length > 0 &&
      !Number(userData.city)
    ) {
      document.querySelector(".box-user-info-list").insertAdjacentHTML(
        "beforeend",
        `<li>
        <p> <ion-icon class="info-icon" name="home"></ion-icon>
            <span>City :</span>
        </p>
        <span class="curentUser-city">${userData.city[0].toUpperCase()}${userData.city.slice(
          1
        )}</span>
        </li>`
      );
    }
  }
  populateUserData();
} else {
  window.location.href = "/";
}

// LOGOUT
document.querySelector(".odjava-btn").addEventListener("click", (e) => {
  e.preventDefault();

  session.destroySession();
  window.location.href = "/";
});

// EDIT PROFILE
document.querySelector(".edit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".edit-modal").style.display = "block";
});

document.querySelector(".createAcc-btn").addEventListener("click", (e) => {
  let day = document.querySelector("#day").value;
  let month = document.querySelector("#month").value;
  let year = document.querySelector("#year").value;
  let birthDate = `${day}.${month}.${year}`;
  let city = document.querySelector("#edit_city");
  let phone = document.querySelector("#edit_phone");

  e.preventDefault();
  let user = new User();
  user.username = document.querySelector("#edit_korisnicko_ime").value;
  user.email = document.querySelector("#edit_email").value;
  user.birthDate = birthDate;
  user.phone = phone.value;
  user.city = city.value;

  user.editUser(session_id);
});

// HIDE MODAL
document.querySelector(".closeModal").addEventListener("click", (e) => {
  document.querySelector(".edit-modal").style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelector(".edit-modal").style.display = "none";
  }
});

// DELETE ACCOUNT
document.querySelector(".deleteAcc-btn").addEventListener("click", (e) => {
  e.preventDefault();
  let user = new User();
  user.deleteUser();
  async function deleteUser() {
    let post = new Post();
    post = await post.deleteAllPostOfCurentUser();
  }

  deleteUser();
});

///////////////////////////////////////////////////////////////////////////////////////
// CREATE POST
document.querySelector(".write-post").addEventListener("submit", (e) => {
  e.preventDefault();
  let input = document.querySelector("#post-content");

  let datum = getDate();

  if (input.value !== "") {
    async function populateNewPost() {
      let post = new Post();
      post.post_content = document.querySelector("#post-content").value.trim();
      post.user_id = session_id;
      post.likes = 0;
      post.date = datum;

      post = await post.createPost();

      let user = new User();
      user = await user.getCurrentUser(session_id);
      renderAllPost();

      document.querySelector("#post-content").value = "";
      let html = `
      <div class="single-post" data-post-id="${post.id}">
            <div class="post-info-box">
              <div class="post-info">
                <div class="about-autor">
                  <p>
                    Author:
                    <span class="span-autor">${user.username}</span>
                  </p>
                  <span class="span-date">${post.date}</span>
                </div>
                <div class="about-post-content">
                  <span class="span-post">" ${post.post_content} "</span>
                  ${
                    post.user_id === session_id
                      ? "<button class='btn-remove'><ion-icon class='icon' name='trash-outline'></ion-icon> </button>"
                      : ""
                  }
                </div>
              </div>

              <div class="post-action-btns">
                <button class="btn-like">
                  <span class="numLikes">${post.likes}</span
                  ><ion-icon class="icon" name="thumbs-up-outline"></ion-icon>
                </button>
                <button class="btn-showComment">Comment
                  <ion-icon
                    class="icon"
                    name="chatbox-ellipses-outline"
                  ></ion-icon>
                </button>
              </div>

              <div class="comment-box">
                  <div class="napisi-kom">
                    <input type="text" placeholder="Write a comment..." />
                    <button class="btn-objaviKom" onclick="submitComment(event)">
                      <ion-icon name="send"></ion-icon>
                    </button>
                  </div>
                </div>
            </div>`;

      // document
      //   .querySelector(".posts-parent")
      //   .insertAdjacentHTML("afterbegin", html);
      renderPagination(1);
    }
    populateNewPost();
  }
});

////////////////////////////////////////////////////////////////
// RENDER ALL POSTS
async function renderAllPost(goToPage = 1) {
  document.querySelector(
    ".posts-parent"
  ).innerHTML = `<div class="loader"></div>`;

  let post = new Post();
  let allPosts = await post.pagination(goToPage);

  if (!allPosts || (Array.isArray(allPosts) && allPosts.length === 0)) {
    document.querySelector(".posts-parent").innerHTML =
      "<p>No posts yet! Write a post :)</p>";
  }

  allPosts.forEach((post) => {
    async function getPostInfo() {
      let com = new Comment();
      let allCom = await com.getAllComments(post.id);

      let user = new User();
      let autor = await user.getCurrentUser(post.user_id);
      if (!autor) return;

      let username = `${autor.username[0].toUpperCase()}${autor.username.slice(
        1
      )}`;

      let html = `
      <div class="single-post" data-post-id="${post.id}">
            <div class="post-info-box">
              <div class="post-info">
                <div class="about-autor">
                  <p>
                    Author:
                    <span class="span-autor">${username}</span>
                  </p>
                  <span class="span-date">${post.date}</span>
                </div>
                <div class="about-post-content">
                  <span class="span-post">" ${post.post_content} "</span>
                  ${
                    post.user_id === session_id
                      ? "<button class='btn-remove'><ion-icon class='icon' name='trash-outline'></ion-icon> </button>"
                      : ""
                  }
                </div>
              </div>

              <div class="post-action-btns">
                <button class="btn-like" onclick="likePost(event)">
                  <span class="numLikes">${post.likes}</span
                  ><ion-icon class="icon" name="thumbs-up-outline"></ion-icon>
                </button>
                <button class="btn-showComment">Comment
                  <ion-icon
                    class="icon"
                    name="chatbox-ellipses-outline"
                  ></ion-icon>
                  
                </button>
              </div>
            </div>

            <div class="comment-box">
              <div class="napisi-kom">
                <input type="text" placeholder="Write a comment..." />
                <button class="btn-objaviKom" onclick="submitComment(event)">
                  <ion-icon name="send"></ion-icon>
                </button>
              </div>
            </div>
            <div class="comment-parent">
              <ul class="comment-parent-list">
              ${allCom
                .map((com) => {
                  let username = `${com.author[0].toUpperCase()}${com.author.slice(
                    1
                  )}`;

                  if (com) {
                    return `<li>
                  <p>
                    <span class="comment-author">${username}</span> commented :
                    <span class="comment-content">" ${com.content} "</span>
                  </p>
                  </li>`;
                  } else {
                    return;
                  }
                })
                .reverse()
                .join("")}
              </ul>
            </div>           
      `;

      document
        .querySelector(".posts-parent")
        .insertAdjacentHTML("beforeend", html);
    }
    document.querySelector(".posts-parent").innerHTML = "";

    getPostInfo();
  });
}

/////////////////////////////////////////////////////////////
// POSTS ACTIONS
document.querySelector(".posts-parent").addEventListener("click", (e) => {
  e.preventDefault();

  let singlePost = e.target.closest(".single-post");
  let post_id = singlePost.getAttribute("data-post-id");
  let showCommentBtn = e.target.closest(".btn-showComment");
  let deleteBtn = e.target.closest(".btn-remove");

  if (!singlePost) return;

  // DELETE POST
  if (deleteBtn) {
    async function deletePost() {
      let post = new Post();

      await post.deletePost(post_id);
      singlePost.remove();
      renderAllPost();
    }
    deletePost();
  }

  // SHOW COMMENT FIELD
  if (showCommentBtn) {
    singlePost.querySelector(".napisi-kom").style.display = "flex";
  }
});

function likePost(e) {
  let likeBtn = e.target.closest(".btn-like");
  let likes = +likeBtn.textContent;
  let post_id = +e.target.closest(".single-post").getAttribute("data-post-id");

  likeBtn.setAttribute("disabled", true);
  likeBtn.style.backgroundColor = "#eaebed";

  async function likePosts() {
    let post = new Post();
    post.likes = likes + 1;
    let likePost = await post.likePost(post_id);

    likeBtn.innerHTML = `
<span class="numLikes">${likes + 1}</span
                  ><ion-icon class="icon" name="thumbs-up"></ion-icon>
`;
  }
  likePosts();
}

function getDate() {
  let now = new Date();
  let day = String(now.getDate());
  let month = String(now.getMonth() + 1);
  let year = String(now.getFullYear());

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  let datum = `${day}.${month}.${year}.`;

  return datum;
}

function submitComment(e) {
  let singlePost = e.target.closest(".single-post");
  if (!singlePost) return;
  let post_id = singlePost.getAttribute("data-post-id");
  let commentContent = singlePost.querySelector(".napisi-kom input").value;
  singlePost.querySelector(".napisi-kom input").value = "";

  let commentBox = singlePost.querySelector(".comment-parent");

  async function createComment() {
    let user = new User();
    let currentUser = await user.getCurrentUser(session_id);

    let comment = new Comment();
    comment.post_id = post_id;
    comment.content = commentContent;
    comment.author = currentUser.username;

    comment = await comment.createComment();

    let html = `
<ul class="comment-parent-list">
                <li>
                  <p>
                    <span class="comment-author">${comment.author[0].toUpperCase()}${comment.author.slice(
      1
    )}</span> commented :
                    <span class="comment-content">" ${comment.content} "</span>
                  </p>
                </li>
              </ul>

`;

    commentBox.insertAdjacentHTML("afterbegin", html);
  }
  createComment();
}

/////////////////////////////////////////////////////
// PAGINATION
async function renderPagination(curPage) {
  let post = new Post();
  let postNumber = await post.getAllPost();

  let numPages = Math.ceil(postNumber.length / post.resPerPage);
  let html = "";
  let paginationDiv = document.querySelector(".pagination");
  paginationDiv.innerHTML = "";

  console.log(post.resPerPage);

  if (curPage === 1 && numPages > 1) {
    html = ` 
    <button
      data-goto="${curPage + 1}"
      class="pagination__btn pagination__btn--next"
    >
      <span>Page ${
        curPage + 1
      }</span><ion-icon name="arrow-forward-outline"></ion-icon>
    </button>`;
    curPage++;
    return paginationDiv.insertAdjacentHTML("beforeend", html);
  }

  if (curPage < numPages) {
    html = `  <button data-goto="${
      curPage - 1
    }" class="pagination__btn pagination__btn--prev"><ion-icon name="arrow-back-outline"></ion-icon>
              <span>Page ${curPage - 1}</span>
              </button>
              <button data-goto="${
                curPage + 1
              }" class="pagination__btn pagination__btn--next">
              <span>Page ${
                curPage + 1
              } </span><ion-icon name="arrow-forward-outline"></ion-icon>
              </button>`;
    return paginationDiv.insertAdjacentHTML("beforeend", html);
  }

  if (curPage === numPages && numPages > 1) {
    html = `<button data-goto="${
      curPage - 1
    }" class="pagination__btn pagination__btn--prev"><ion-icon name="arrow-back-outline"></ion-icon>
    <span>Page ${curPage - 1}</span>
    </button>`;
    return paginationDiv.insertAdjacentHTML("beforeend", html);
  } else {
    html = "";
  }
}

document.querySelector(".pagination").addEventListener("click", (e) => {
  e.preventDefault();
  let btn = e.target.closest(".pagination__btn");
  if (!btn) return;

  let goToPage = +btn.getAttribute("data-goTo");

  renderAllPost(goToPage);
  renderPagination(goToPage);
});

function init() {
  renderAllPost();
  renderPagination(1);
  allPrimatelji();
  renderRecivesMessages();
}

init();

////////////////////////////////////////////////////
// SORT POSTS

document.querySelector(".sort-box").addEventListener("change", (e) => {
  let select = e.target.closest("select");

  if (!select) return;

  if (select.value === "allPosts") {
    document.querySelector(".btn-myPosts").style.display = "none";
    document.querySelector(".btn-allPosts").style.display = "block";
    renderAllPost();
  }
  if (select.value === "myPosts") {
    document.querySelector(".btn-allPosts").style.display = "none";
    document.querySelector(".btn-myPosts").style.display = "block";
    renderOnlyMyPost();
  }
});

async function deleteAllPosts(e) {
  let post = new Post();
  post = await post.deleteAllPost();
  init();
}

async function deleteMyPosts() {
  let post = new Post();
  post = await post.deleteAllPostOfCurentUser();

  document.querySelector(".sort-box").innerHTML = `    <select class="sortPost">
  <option value="myPosts">My posts</option>
  <option class="selected" selected value="allPosts">
    All posts
  </option>
</select>
<button class="btn btn-myPosts" onclick="deleteMyPosts(event)">
  <ion-icon class="icon" name="trash-outline"></ion-icon>
</button>
<button class="btn btn-allPosts" onclick="deleteAllPosts(event)">
  <ion-icon class="icon" name="trash-outline"></ion-icon>
</button>`;

  init();
}

// populate dropdown menu

for (let i = 1; i <= 31; i++) {
  document.querySelector(
    "#day"
  ).innerHTML += `<option value=${i}>${i}</option>`;
}

for (let i = 1; i <= 12; i++) {
  document.querySelector(
    "#month"
  ).innerHTML += `<option value=${i}>${i}</option>`;
}

let now = new Date();
let year = now.getFullYear();

for (let i = year; i >= 1905; i--) {
  document.querySelector(
    "#year"
  ).innerHTML += `<option value=${i}>${i}</option>`;
}

async function allPrimatelji() {
  let user = new User();
  let svi = await user.selectPrimatelj();

  svi.forEach((user) => {
    document.querySelector(
      "#odabariPrimatelja"
    ).innerHTML += `<option value="${user.id}">${user.username}</option>`;
  });
}

// MESSAGES //

//////////////////////////////////////////////
// SEND MESSAGE
document.querySelector(".sendMessageBtn").addEventListener("click", (e) => {
  async function sendMessage() {
    let primatelj_id = document.querySelector("#odabariPrimatelja").value;
    let messageInput = document.querySelector(".message-content");

    let datum = getDate();
    let user = new User();
    let posiljatelj = await user.getCurrentUser(session_id);

    let primatelj = await user.getCurrentUser(primatelj_id);

    let dugme = document.querySelector(".sendMessageBtn");
    let input = document.querySelector(".message-content");
    let select = document.querySelector("#odabariPrimatelja");

    if (
      primatelj_id &&
      primatelj_id !== session_id &&
      messageInput.value !== ""
    ) {
      let message = new Message();

      message.posiljatelj_id = posiljatelj.id;
      message.posiljatelj_username = posiljatelj.username;
      message.primatelj_id = primatelj_id;
      message.primatelj_username = primatelj.username;
      message.message_content =
        document.querySelector(".message-content").value;
      message.date = datum;

      document.querySelector(".message-content").value = "";

      dugme.classList.add("green");
      dugme.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon>`;
      setTimeout(() => {
        dugme.classList.remove("green");
        dugme.innerHTML = ` <ion-icon name="send-outline"></ion-icon>`;
      }, 800);

      message.sendMessage();
    } else {
      dugme.classList.add("red");
      dugme.innerHTML = `<ion-icon name="close-outline"></ion-icon>`;
      input.classList.add("red-border");
      select.classList.add("red-border");
      setTimeout(() => {
        dugme.classList.remove("red");
        dugme.innerHTML = ` <ion-icon name="send-outline"></ion-icon>`;
        input.classList.remove("red-border");
        select.classList.remove("red-border");
      }, 600);
    }
  }

  sendMessage();
});

////////////////////
// RENDER ALL RECIVED MESSAGE
async function renderRecivesMessages() {
  let messageBox = document.querySelector(".message-list");
  messageBox.innerHTML = "";

  let message = new Message();
  let allMessage = await message.getMessageOfCurrentUser();

  if (allMessage.length === 0) {
    messageBox.innerHTML = `<li><p>No messages.</p></li>`;
    document.querySelectorAll(".numberOfMessage").forEach((box) => {
      box.style.display = "none";
    });
  } else {
    document.querySelectorAll(".numberOfMessage").forEach((box) => {
      box.style.display = "flex";
      box.textContent = `${allMessage.length}`;
    });

    allMessage.forEach((message) => {
      let html = `
<li class="message" data-message-id="${message.id}">
<div class="message-item">
  <div>
    <ion-icon class="inbox-icon" name="mail-outline"></ion-icon>
  </div>

  <div>
    <p class="message-sender">${message.posiljatelj_username[0].toUpperCase()}${message.posiljatelj_username.slice(
        1
      )}</p>
    <p class="message-content">${message.message_content}</p>
  </div>
</div>
<div class="message-delete-box">
  <div class="message-date">${message.date}</div>
  <button class="btn-remove-message">
    <ion-icon class="icon" name="trash-outline"></ion-icon>
  </button>
</div>
</li>
`;

      messageBox.insertAdjacentHTML("afterbegin", html);
    });
  }
}

/// SHOW / HIDE INBOX WINDOW

document.querySelectorAll(".inboxBtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    document.querySelector(".modal-message").style.display = "block ";
    document.querySelector(".overlay").style.display = " block";
  });
});

document.querySelector(".closeModalMessage").addEventListener("click", (e) => {
  e.preventDefault();

  document.querySelector(".modal-message").style.display = "none ";
  document.querySelector(".overlay").style.display = " none";
});

// DELETE MESSAGE

document.querySelector(".message-list").addEventListener("click", (e) => {
  e.preventDefault();

  async function deleteMessage() {
    let messageItem = e.target.closest(".message");
    let message_id = +messageItem.getAttribute("data-message-id");

    let deleteBtn = e.target.closest(".btn-remove-message");

    if (!deleteBtn) return;
    if (deleteBtn) {
      let message = new Message();
      let delMessage = await message.deleteMessage(message_id);
      messageItem.remove();
      renderRecivesMessages();
    }
  }
  deleteMessage();
});

// NAV

document.querySelector(".navBtn").addEventListener("click", (e) => {
  e.preventDefault();

  document.querySelector(".profile-container-left").style.transform =
    " translateX(0)";
  document.querySelector(".overlay").style.display = "block";
});

document.querySelector(".closeNav").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".profile-container-left").style.transform =
    " translateX(-100%)";
  document.querySelector(".overlay").style.display = "none";
});

async function renderOnlyMyPost(goToPage = 1) {
  document.querySelector(
    ".posts-parent"
  ).innerHTML = `<div class="loader"></div>`;

  let post = new Post();
  let allPosts = await post.paginationMyPost(goToPage);

  if (allPosts.length == 0) {
    document.querySelector(".posts-parent").innerHTML =
      "<p>No posts yet! Write a post :)</p>";
  }

  allPosts.forEach((post) => {
    async function getPostInfo() {
      let com = new Comment();
      let allCom = await com.getAllComments(post.id);

      let user = new User();
      let autor = await user.getCurrentUser(post.user_id);

      let username = `${autor.username[0].toUpperCase()}${autor.username.slice(
        1
      )}`;

      let html = `
      <div class="single-post" data-post-id="${post.id}">
            <div class="post-info-box">
              <div class="post-info">
                <div class="about-autor">
                  <p>
                    Author:
                    <span class="span-autor">${username}</span>
                  </p>
                  <span class="span-date">${post.date}</span>
                </div>
                <div class="about-post-content">
                  <span class="span-post">" ${post.post_content} "</span>
                  ${
                    post.user_id === session_id
                      ? "<button class='btn-remove'><ion-icon class='icon' name='trash-outline'></ion-icon> </button>"
                      : ""
                  }
                </div>
              </div>

              <div class="post-action-btns">
                <button class="btn-like" onclick="likePost(event)">
                  <span class="numLikes">${post.likes}</span
                  ><ion-icon class="icon" name="thumbs-up-outline"></ion-icon>
                </button>
                <button class="btn-showComment">Comment
                  <ion-icon
                    class="icon"
                    name="chatbox-ellipses-outline"
                  ></ion-icon>
                  
                </button>
              </div>
            </div>

            <div class="comment-box">
              <div class="napisi-kom">
                <input type="text" placeholder="Write a comment..." />
                <button class="btn-objaviKom" onclick="submitComment(event)">
                  <ion-icon name="send"></ion-icon>
                </button>
              </div>
            </div>
            <div class="comment-parent">
              <ul class="comment-parent-list">
              ${allCom
                .map((com) => {
                  let username = `${com.author[0].toUpperCase()}${com.author.slice(
                    1
                  )}`;

                  if (com) {
                    return `<li>
                  <p>
                    <span class="comment-author">${username}</span> commented :
                    <span class="comment-content">" ${com.content} "</span>
                  </p>
                  </li>`;
                  } else {
                    return;
                  }
                })
                .reverse()
                .join("")}
              </ul>
            </div>           
      `;
      document.querySelector(".pagination").innerHTML = "";
      document
        .querySelector(".posts-parent")
        .insertAdjacentHTML("beforeend", html);
    }
    document.querySelector(".posts-parent").innerHTML = "";

    getPostInfo();
  });
}
