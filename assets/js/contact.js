/*setovanje kolacica */
function setCookie(name, value, exDays) {
    let today = new Date();
    today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * exDays);
    document.cookie = name + "=" + value + "; " + "expires=" + today.toUTCString();
  }
  /*brisanje kolacica */
function deleteAll() {
  setCookie("cart", null, -1);
}

buyButton = document.getElementById("buyButt");
buyButton.addEventListener('click', () => {
    deleteAll();
    window.alert("Uspesna kupovina");
    window.location = '/projects.html';
});

logoutbutton = document.getElementById('logOut');
logoutbutton.addEventListener('click', () => {
  setCookie("cart", null, -1);
  setCookie("login", null, -1);
  window.location = '/projects.html';
});
/*rasclanjavanje kolacica za logovanje  */
const parsirajLogin = () => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith("login="));

  let loginInformacije;
  if (cookies) {
    loginInformacije = JSON.parse(cookies.split("=")[1]);
  }
/*uradjeno da se vidi ko je logova i da povuce informacije o korisniku */
  if (loginInformacije) {
    document.getElementById('logOut').hidden = false;
    console.log(JSON.stringify(loginInformacije));
    document.getElementById('badge1').innerHTML = 'Zdravo, ' + loginInformacije.ime + '!';
    document.getElementById('form_name1').value = loginInformacije.ime;
    document.getElementById('form_lastname1').value = loginInformacije.prezime;
    document.getElementById('form_email1').value = loginInformacije.email;
  } else {
    document.getElementById('logOut').hidden = true;
  }
}
parsirajLogin();

const dohvatiBrojArtikala = () => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith("cart="));

  let cart = [];
  if (cookies) {
    cart = JSON.parse(cookies.split("=")[1]);
  }

  if (cart) {
    document.getElementsByClassName('badge')[0].innerHTML = cart.length;
  }
}
dohvatiBrojArtikala();



