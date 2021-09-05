
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

const logoutbutton = document.getElementById('logOut');
if (logoutbutton) logoutbutton.addEventListener('click', () => {
    setCookie("cart", null, -1);
    setCookie("login", null, -1);
    window.location = '/projects.html';
});

var otkaziDugme = document.getElementById("cancelbtn");

if (otkaziDugme) otkaziDugme.addEventListener('click', () => {
     document.getElementById("log-pass").value="";
     document.getElementById("log-email").value="";
});
const parsirajLogin = () => {
    const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("login="));

    let loginInformacije;
    if (cookies) {
        loginInformacije = JSON.parse(cookies.split("=")[1]);
    }

    if (loginInformacije) {
        document.getElementById('logInForm').innerHTML ='<img id="lgnPicture" src="assets/img/slike-za-sajt/logInImg.jpg"></img> Ulogovani ste kao: ' + loginInformacije.ime + ' ' + loginInformacije.prezime;
        document.getElementById('dntPsw').innerHTML = '';
        document.getElementById('logOut').hidden = false;
        document.getElementById('badge1').innerHTML = 'Zdravo, ' + loginInformacije.ime + '!';
        dohvatiBrojArtikala();
    }
}
parsirajLogin();

var dugmePrijava = document.getElementById("logInBtn");
if (dugmePrijava) {
    dugmePrijava.addEventListener("click",logIn);
}

var dugmeRegistracija = document.getElementById("registrationBtn");
if (dugmeRegistracija) {
    dugmeRegistracija.addEventListener("click",signUp);
}

var dugmeReg = document.getElementById("regBtn");
if (dugmeReg) {
    dugmeReg.addEventListener('click', () => { window.location='/signUp.html'; })
}

function logIn() {
    var email=document.getElementById("log-email").value;
    var sifra=document.getElementById("log-pass").value ;

    console.log(email+sifra)
    axios.post("http://localhost:5000/login", {
        email: email,
        password: sifra,
    }).then(function (response) {
        console.log(response.data);
        if (response.data.result == "OK") {
            console.log(response.data);
            window.location.href = "projects.html";
            setCookie("login", JSON.stringify(response.data.data), 5);
        }
        if (response.data.result == "Pogresni kredencijali") {
            alert("Pogresno logovanje");
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function signUp() {
    var email = document.getElementById('reg-email-id').value;
    var sifra = document.getElementById('reg-pass-id').value;
    var sifra2 = document.getElementById('reg-pass2-id').value;
    var ime = document.getElementById('reg-name-id').value;
    var prezime = document.getElementById('reg-surname-id').value;
    var check = document.getElementById('acceptTerms');

    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let emailTest = emailRegex.test(email);
    let imeRegex = /^[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})*$/;
    let imeTest =imeRegex.test(ime);
    let prezimeRegex = /^[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})*$/;
    let prezimeTest = prezimeRegex.test(prezime);

    if (!imeTest) {
        window.alert('Neispravno ime');
        return;
    }

    if (!prezimeTest) {
        window.alert('Neispravno prezime');
        return;
    }

    if (!emailTest) {
        window.alert('Neispravan email format');
        return;
    }
    
    if (sifra != sifra2) {
        window.alert('Ne poklapaju se sifre!');
        return;
    }


    if (sifra.length < 5) {
        window.alert('Šifra mora biti barem 6 karaktera');
        return;
    }

    if (!check.checked) {
        window.alert("uslovi moraju biti čekirani")
        return;
    }

    axios.post("http://localhost:5000/register", {
        email: email,
        password: sifra,
        ime: ime,
        prezime: prezime
    }).then(function (response) {
        if (response.data.result == "OK") {
            window.location.href = "projects.html";
        }
        if (response.data.result == "korisnik sa tim emailom postoji") {
            alert("Korisnik sa datim mejlom već postoji");
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function setCookie(name, value, exDays) {
    let today = new Date();
    today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * exDays);
    document.cookie = name + "=" + value + "; " + "expires=" + today.toUTCString();
}