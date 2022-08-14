import { users } from "../users.js";
const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitInput = document.getElementById("form-submit");
const rememberme = document.getElementById("remember-me");

/* //! do later 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkUser();
});
*/

submitInput.addEventListener("click", checkUser);

function checkUser() {
  const emailVal = email.value;
  const passwordVal = password.value;

  const user = users.find(
    (user) => user.email == emailVal && user.password == passwordVal
  );
  console.log(user);
}
