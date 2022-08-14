const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password-confirm");
const submitInput = document.getElementById("form-submit");

/* //! do later 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkInputs();
});
*/

submitInput.addEventListener("click", (e) => {
  e.preventDefault();
  checkInputs();
});

function checkInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();
  console.log("metu mail: ", isMetuMail(emailValue));
  console.log("password", isPassword(passwordValue));
}

function isMetuMail(email) {
  return /^e[0-9]{6}@metu\.edu\.tr$/.test(email);
}

function isPassword(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password);
}

function setSuccessFor(input) {
  input.classList.add("success");
}

function setErrorFor(input, message) {}
