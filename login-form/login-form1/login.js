const users = JSON.parse(localStorage.getItem("users"));
console.log(users);
const username = document.getElementById("username");
const password = document.getElementById("password");
const submit = document.getElementById("form-submit");
const passwordVisibilityOff = document.querySelectorAll(".visibility_off");
const template = document.querySelector("template");

let user;

submit.addEventListener("click", (e) => {
  e.preventDefault();
  checkUser();
});
passwordVisibilityOff.forEach((button) => {
  button.addEventListener("click", toggleOff);
});

function checkUser() {
  user = users.find(
    (user) => user.username == username.value && user.password == password.value
  );
  if (user) {
    console.log("user successully found");
    localStorage.setItem("user", JSON.stringify(user));

    setSuccessFor(username);
    setSuccessFor(password);

    showSuccessfulLogin();

    setTimeout(() => {
      window.location.href = "http://localhost:5500/main.html";
    }, 2000);
  } else if (users.find((user) => user.username == username.value)) {
    setSuccessFor(username);
    let message = "password is incorrect";
    setErrorFor(password, message);
  } else {
    let message = "username does not exist";
    setErrorFor(username, message);
    setErrorFor(password, "");
  }
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

function showSuccessfulLogin() {
  document.body.append(template.content);
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
