const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password-confirm");
const submitInput = document.getElementById("form-submit");
const passwordVisibilityOff = document.querySelectorAll(".visibility_off");
const template = document.querySelector("template");

let users = [];
if (localStorage.getItem("users"))
  users = JSON.parse(localStorage.getItem("users"));
console.log("users: ", users);

//! events
submitInput.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkInputs()) {
    const user = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    showSuccessfulSignin();

    setTimeout(() => {
      window.location.href = "http://localhost:5500/login.html";
    }, 2000);
  }
});
passwordVisibilityOff.forEach((button) => {
  button.addEventListener("click", toggleOff);
});

function checkInputs() {
  let correctInputCount = 0;

  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  console.log("username: ", isUsername(usernameValue));
  console.log("email: ", isMetuMail(emailValue));
  console.log("password: ", isPassword(passwordValue));
  console.log("password2: ", isPassword2(password2Value));

  const usernameMessage = isUsername(usernameValue);
  const emailMessage = isMetuMail(emailValue);
  const passwordMessage = isPassword(passwordValue);
  const password2Message = isPassword2(password2Value);

  if (usernameMessage === true) {
    setSuccessFor(username);
    correctInputCount++;
  } else setErrorFor(username, usernameMessage);

  if (emailMessage === true) {
    setSuccessFor(email);
    correctInputCount++;
  } else setErrorFor(email, emailMessage);

  if (passwordMessage === true) {
    setSuccessFor(password);
    correctInputCount++;
  } else setErrorFor(password, passwordMessage);

  if (password2Message === true) {
    setSuccessFor(password2);
    correctInputCount++;
  } else setErrorFor(password2, password2Message);

  if (correctInputCount == 4) return true;

  return false;
}

function isUsername(username) {
  //! this username already exist
  if (users.find((user) => user.username == username))
    return "this username already exist";

  if (username.length > 16) {
    return "username cannot be longer than 16 characters";
  }
  if (/^(?=^[^_]+_?[^_]+$)\w{3,16}$/.test(username)) return true;
  return "username can only contain alphanumerical characters and _ ";
}

function isMetuMail(email) {
  //! you already created an account

  if (users.find((user) => user.email == email))
    return "this email is already in use";

  if (/^e[0-9]{6}@metu\.edu\.tr$/.test(email)) return true;
  return "username can only be a metu mail: exxxxxx@metu.edu.tr";
}

function isPassword(password) {
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password))
    return true;
  if (password.length < 8) return "password must has at least 8 characters";
  return "password must contain only alphanumericals and at least one uppercase character";
}

function isPassword2(password2) {
  if (password2 === password.value) return true;
  return "passwords does not match";
}

function setSuccessFor(input) {
  const parent = input.parentElement;
  const parentClassList = input.parentElement.classList;

  if (parentClassList.contains("error-border")) {
    parentClassList.remove("error-border");
    parent.parentElement
      .querySelector(".alert .error")
      .classList.replace("visible", "hidden");
    parent.parentElement.parentElement
      .querySelector("small")
      .classList.replace("visible", "hidden");
  }
  parentClassList.add("success-border");
  parent.parentElement
    .querySelector(".alert .check_circle")
    .classList.replace("hidden", "visible");
}

function toggleOff() {
  this.classList.replace("visibility_off", "visibility_on");
  this.innerText = "visibility";
  this.parentElement.firstChild.nextSibling.type = "text";
  this.addEventListener("click", toggleOn);
  this.removeEventListener("click", toggleOff);
}

function toggleOn() {
  this.classList.replace("visibility_on", "visibility_off");
  this.innerText = "visibility_off";
  this.parentElement.firstChild.nextSibling.type = "password";
  this.addEventListener("click", toggleOff);
  this.removeEventListener("click", toggleOn);
}

function setErrorFor(element, message) {
  const parent = element.parentElement;
  parent.parentElement
    .querySelector(".alert .error")
    .classList.replace("hidden", "visible");
  parent.classList.add("error-border");
  const errorMessage =
    parent.parentElement.parentElement.querySelector("small");
  errorMessage.classList.replace("hidden", "visible");
  errorMessage.innerText = message;
}

function showSuccessfulSignin() {
  document.body.append(template.content);
}
