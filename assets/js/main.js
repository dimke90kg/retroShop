
window.onload = () => {
  /* ucitavanje proizvoda prilikom otvaranja stranice  */ 
  getData("kategorija.json", showCategorie);
  getData("izvodjaci.json", showArtists);
  getData("albumi.json", showAlbums);
    
  /* prazni nizovi koje kasnije popunjavamo */
  let izvodjaci = [];
  let kategorija = [];

  /* Postavljeni osluskivaci za filter pretrage i sortiranje po ceni*/
  document.getElementById("sort1").addEventListener("change", filterChange);
  document.getElementById("searchProducts").addEventListener("search", filterChange);
  document.getElementById("searchProducts").addEventListener("keyup", filterChange);
  document.getElementById("sort3").addEventListener("change", filterChange);
  document.getElementById("sortcategory").addEventListener("change", filterChange);
  
  /*Dohvatanje iz JSON-a  */
  function getData(file, callback) {
    $.ajax({
      url: "assets/data/" + file,
      method: "get",
      dataType: "json",
      success: function (response) {
        callback(response);
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  
  /* dinamicko iscitavanje proizvoda iz JSON-a */
  function showCategorie(data) {
    let html = "";
    kategorija = data;
    data.forEach((element) => {
      
      html += `<h5 class="card-title" value="${element.id}"> ${element.naziv}</h5>`; 
    });
    document.getElementById("products").innerHTML = html;
    document.getElementById("products").addEventListener("change",filterChange);
  }
  
  function showArtists(data) {
    let html = "";
    izvodjaci = data;
    data.forEach((element) => {
      html += `<p class="card-text" alue="${element.id}" >${element.ime}${element.prezime} <br><br></p>`;
    });
    document.getElementById("products").innerHTML = html;
    document.getElementById("products").addEventListener("change", filterChange);
  }

  function showAlbums(data) {
    data = filterCategory(data);
    data = filterStatus(data);
    data = searchProducts(data);
    data = sort(data);
    let html = "";
    data.forEach((element) => {
      html += `<div class="card" style="width: 15rem; style="hight: 10rem; ">
          <img class="imgCart" src="${
            element.slika.src
          }" alt="{element.slika.alt}">
          <div class="card-body">
          <h5 class="card-title"> ${element.naslov}</h5>
          <p>${catchArtistNameByID(element.id)}</p>
          <h5> ${element.cena} RSD</h5>
        
          <p id="${element.id}" value="${element.naStanju}"> ${
            element.naStanju ? "Proizvod je dostupan" : "Proizvod nije na stanju"
          }</p>
          <p class="card-text">
                ${catchCategory(element.kategorija)}
          </p>
          <a class="btn btn-outline-secondary" id="buttonBuy" data-id="${element.id}" data-available="${element.naStanju}">Dodaj u korpu</a>
        </div>
        </div>
        </div>`;
    });

    if (!data.length) {
      html = "Proizvod nema na stanju";
    } else {
      document.getElementById("products").innerHTML = html;
    }
    const basket = document.getElementById("addBasket");

    var button = document.getElementsByClassName("btn btn-outline-secondary");

    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener("click", () => {addToBasket(button[i]);});
    }
  }
    

  /*dohvatanje izvodjaca ime i prezime po  id-u */
  function catchArtistNameByID(id) {
    let izvodjaciI = izvodjaci.filter((obj) => obj.id == id);
    if (!izvodjaciI[0]) return '';
    let imeP = izvodjaciI[0].ime;
    let prezimeP = izvodjaciI[0].prezime;
    return imeP + " " + prezimeP;
  }
  
  /*dohvatanje izvodjaca po id-u */
  function catchArtistByID(id) {
    return ( izvodjaci.filter((obj) => obj.id == id)[0]);
  }

  /*dohvatanje kategorije po id-u */
  function catchCategory(ids) {
    let html = "";
    let kategorijeIzvodjaci = kategorija.filter((elem) => ids.includes(elem.id));
    for (let i in kategorijeIzvodjaci) {
      html += kategorijeIzvodjaci[i].naziv;
      if (i != kategorijeIzvodjaci.length - 1) {
        html += ", ";
      }
    }
    return html;
  }
  
  /* funkcija sortiranje dostupno,nije dostupno  */
  function filterStatus(data) {
    const el = document.getElementById("sort3").value;
    if (el == "asc2") {
      return data.filter((x) => x.naStanju);
    }
    if (el == "desc2") {
      return data.filter((x) => !x.naStanju);
    }
    return data;
  }

  /* funkcija sortiranje cene opadajuce,rastuce  */
  function sort(data) {
    const sortTip = document.getElementById("sort1").value;

    if (sortTip == "asc1") {
      return data.sort((a, b) =>
        parseInt(a.cena) > parseInt(b.cena) ? 1 : -1
      );
    }

    return data.sort((a, b) =>
      parseInt(a.cena) < parseInt(b.cena) ? 1 : -1
    );
  }

  /* filter sort po kategoriji */
  function filterCategory(data) {
    document.getElementById("sortcategory").value;
    const chek = document.getElementById("sortcategory").value;

    if(chek == 0){
      return data;
    }
      
    return data.filter((x) => x.kategorija == chek);
  }
    
  /* Uradjena pretraga proizvoda po naslovu i po izvodjacu*/
  function searchProducts(data) { 
    const dataByAlbumName = searchProductsByAlbumName(data);
    const dataByFirstName = searchProductsByArtistFirstName(data);
    const dataByLastName = searchProductsByArtistLastName(data);
  
    return dataByAlbumName.concat(dataByFirstName).concat(dataByLastName);
  }
  
  function  searchProductsByAlbumName(data) {
  var value = document.getElementById("searchProducts").value.toLowerCase();
    if (value) {
      return data.filter(function (el) {
        return el.naslov.toLowerCase().indexOf(value) !== -1;
      });
    }
    return data;
  };
      
  function searchProductsByArtistFirstName(data) {
  var value = document.getElementById("searchProducts").value.toLowerCase();
    if (value) {
      return data.filter(function (el) {
        return catchArtistByID(el.izvodjacID).ime.toLowerCase().indexOf(value) !== -1;
      });
    }
    return [];
  }

  function searchProductsByArtistLastName(data) {
    var value = document.getElementById("searchProducts").value.toLowerCase();
    if (value) {
      return data.filter(function (el) {
        return catchArtistByID(el.izvodjacID).prezime.toLowerCase().indexOf(value) !== -1;
      });
    }
    return [];
  }
    
  /*  sakriveno dugme za odjavljivanje */
  logoutbutton = document.getElementById('logOut');
  logoutbutton.addEventListener('click', () => {
    setCookie("cart", null, -1); //pitaj
    setCookie("login", null, -1);
    window.location = '/projects.html';
  });

  /* promena broja artikala u korpi  */ 
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

/* parsiranje logovanja*/
  const parsirajLogin = () => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("login="));

    let loginInformacije;
    if (cookies) {
      loginInformacije = JSON.parse(cookies.split("=")[1]);
    }

    if (loginInformacije) {
      document.getElementById('logOut').hidden = false;
  
      document.getElementById('badge1').innerHTML = 'Zdravo, ' + loginInformacije.ime + '!';
    } else {
      document.getElementById('logOut').hidden = true;
    }
  }
  parsirajLogin();
  
  /* korpa */
  function addToBasket(button) {
    console.log('dataset: ' + button.dataset.available);
    if (button.dataset.available == 'false') {
      window.alert('Nije na stanju!');
      return;
    }
    
    const loginCookies = document.cookie
      .split('; ')
      .find((row) => row.startsWith("login="));
    if (!loginCookies) {
      window.alert("Niste ulogovani!");
      return;
    }

    const artistId = button.dataset.id;
    let cart = [];

    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart="));
    if (cookies) {
      cart = JSON.parse(cookies.split("=")[1]);
    }

    if (cart.some((x) => x.id == artistId)) {
      window.alert('vec postoji u korpi!');
        //cart.find((x) => x.id == artistId).quantity++;
    }   
    else {
      cart.push({ id: artistId });
    }

    setCookie("cart", JSON.stringify(cart), 5);
    dohvatiBrojArtikala();
  } 

  /* setovanje kolacica */
  function setCookie(name, value, exDays) {
    let today = new Date();
    today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * exDays);
    document.cookie = name + "=" + value + "; " + "expires=" + today.toUTCString();
  }
  /*kontakt forma na samom sajtu*/
  let buttonForm = document.getElementById("buttonSend");
  buttonForm.addEventListener("click",()=>{
    let formIme = document.getElementById("name").value;
    let formPrezime = document.getElementById("last").value;
    let formEmail = document.getElementById("email").value;
    let formMessage = document.getElementById("message").value;

    if(formIme.length==0|| formPrezime.length==0 || formEmail.length==0 || formMessage.length==0 ){  
      window.alert("Neispravan unos");
      return;
    };

    window.alert("Poruka poslata");
    window.location = '/projects.html';
  });

  function filterChange() {
    getData("albumi.json",showAlbums);
  }
}
  
