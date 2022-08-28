const welcome = document.querySelector(".welcome");
const user = JSON.parse(localStorage.getItem("user"));
console.log(user);

welcome.innerText = `welcome ${user.username}`;
