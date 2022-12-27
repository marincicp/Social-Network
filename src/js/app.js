"use strict";

// get id of current user
let session = new Session();
let session_id = session.getSessionOfCurrentUser();

if (session_id !== "") {
  window.location.href = "profile.html";
}

// SHOW - HIDE MODAL
document.querySelector(".create-acc-btn").addEventListener("click", (e) => {
  document.querySelector(".modal").style.display = "block";
});

document.querySelector(".closeModal").addEventListener("click", (e) => {
  document.querySelector(".modal").style.display = "none";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelector(".modal").style.display = "none";
  }
});

////////////////////////////////////////
const korisnickoIme_regInput = document.querySelector("#korisnicko_ime");
const email_regInput = document.querySelector("#email");
const lozinka_regInput = document.querySelector("#lozinka");
const ponoviLozinku_regInput = document.querySelector("#ponovi_lozinku");

/* 
VALIDACIJA
*/

const config = {
  korisnicko_ime: {
    required: true,
    minlength: 5,
    maxlength: 15,
  },

  register_email: {
    email: true,
    required: true,
    minlength: 5,
    maxlength: 15,
  },

  register_lozinka: {
    required: true,
    minlength: 5,
    maxlength: 15,
    matching: "ponovi_lozinku",
  },

  ponovi_lozinku: {
    required: true,
    minlength: 5,
    maxlength: 15,
    matching: "register_lozinka",
  },
};

const validator = new Validator(config, "#registrationForm");

// CREATE NEW USER
document.querySelector(".createAcc-btn").addEventListener("click", (e) => {
  e.preventDefault();
  let username = document.querySelector("#korisnicko_ime");
  let email = document.querySelector("#email");
  let password = document.querySelector("#lozinka").value;

  if (username !== "" || email !== "" || password !== "") {
    if (validator.validatePassed()) {
      async function create() {
        let user = new User();
        user.username = username.value;
        user.email = email.value;
        user.password = password;

        let allUsers = await user.getAllUser();

        let userEmailExist = allUsers.find(
          (user) => user.email === email.value
        );
        let userUsernameExist = allUsers.find(
          (user) => user.username === username.value
        );

        if (userEmailExist || userUsernameExist) {
          alert("Username or email already taken !");
        }

        if (!userEmailExist && !userUsernameExist) {
          user.createUser();
        }
      }
      create();
    } else {
      alert("Fields are empty!");
    }
  }
});

// LOGIN
document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.querySelector("#login_email").value;
  let password = document.querySelector("#login_lozinka").value;

  if (email !== "" || password !== "") {
    async function checkUser() {
      let user = new User();
      user.email = email;
      user.password = password;

      let ulogiraj = await user.loginUser();

      if (!ulogiraj) {
        setTimeout(() => {
          document.querySelector(".notification").style.display = "flex";
          document.querySelector(".overlay").style.display = "block";
          document.querySelector(".container").classList.add("blur");
        }, 500);
      }
    }

    checkUser();
  } else {
    alert("Fields are empty!");
  }
});

// CLOSE NOTIFICATION

document.querySelector(".notiBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".notification").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".container").classList.remove("blur");
  document.querySelector("#login_email").focus();
  document.querySelector("#login_lozinka").value = "";
});
