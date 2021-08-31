window.onload = () => {
  let izvodjaci = [];
  let albumi = [];
  let kategorija = [];
/*uradjeno log out dugme koje se pojavi kad je korisnik logavan.
kad se izloguje brisu se kolacici i vraca na pocetnu stranu*/
  logoutbutton = document.getElementById('logOut');
logoutbutton.addEventListener('click', () => {
  setCookie("cart", null, -1);
  setCookie("login", null, -1);
  window.location = '/projects.html';
});
/* dohvatanje broja artikala da bi pored korpe pisalo koliko artikala ima u korpi*/
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
/* od 50 linije do 123 iskopiran kod iz main.js ,da bi korpa mogla da radi*/
  getData("kategorija.json", showCategorie);
  getData("izvodjaci.json", showArtists);
  getData("albumi.json", (data) => {
    albumi = data;
    albumi.forEach((album) => {
      cene[album.id] = album.cena;
    });
    chekKorpa();
  });
  
  let cena = 0;
  let cene = [];

  var dugmiciZaBrisanjeProizvoda;
  var kolicine;

  let korpa;

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

  function showCategorie(data) {
    let html = "";
    kategorija = data;
    data.forEach((element) => {
      html += `<h5 class="card-title" value="${element.id}"> ${element.naziv}</h5>`; 
    });
  }

  function showArtists(data) {
    let html = "";
    izvodjaci = data;
    data.forEach((element) => {
      html += `<p class="card-text" alue="${element.id}" >${element.ime}${element.prezime} <br><br></p>`;
    }); 
  }
    
  function catchArtistNameByID(id) {
    let izvodjaciI = izvodjaci.filter((obj) => obj.id == id);
    if (izvodjaciI[0] == undefined) return '';
    var ime = izvodjaciI[0].ime;
    var prezime = izvodjaciI[0].prezime;
    return ime + " " + prezime;
  }
  
  const catchAlbumByID = (id) => {
    console.log('id albuma: ' + id);
    albumi.forEach((album) => {
      console.log(album.id);
    });
    console.log('length: ' + albumi.length);
    return albumi.filter((album) => album.id == id)[0];
  }

  function catchCategory(ids) {
    let html = "";
    let kategorijeIzvodjaci = kategorija.filter((elem) => ids.includes(elem.id));
    for (let i = 0; i < kategorijeIzvodjaci.length; i++) {
      html += kategorijeIzvodjaci[i].naziv;
      if (i != kategorijeIzvodjaci.length - 1) {
        html += ", ";
      }
    }
    return html;
  }
/* brisanje korpe,kada se obrise korpa automatski se brisu i kolacici*/
  const deleteProduct = (el) => {
    const id = el.dataset.id;
    const cookies = document.cookie.split("; ").find((row) => row.startsWith("cart="));

    if (cookies) {
      const cart = JSON.parse(cookies.split("=")[1]);
      const filtered = cart.filter((item) => item.id != id);

      if (filtered.length == 0) {
        deleteAll();
      } else {
        setCookie("cart", JSON.stringify(filtered), 5);
      }

      chekKorpa();
    }
  }
/*menjanje cene promenom kolicine */
  const changePrice = (el) => {
    if (el.value == 0) { el.value = 1; };
    cene[el.dataset.id] = el.value * catchAlbumByID(el.dataset.id).cena;
 
    chekKorpa();
  }
/*glavna funkcija za korpu  */
  function chekKorpa() {
    dohvatiBrojArtikala();
    cena = 0;
    let html = "";
    html += `<div class="addBasket">
    <main class="page">
      <section class="shopping-cart dark">
        <div class="container">
            <div class="block-heading">
              <h2 style="color: rgb(122, 118, 118);" >Korpa</h2>
            </div>
            <div class="content">
            <div class="row">
              <div class="col-md-12 col-lg-8">
                <div class="items">`;
    
    korpa = document.getElementById("addToBasket");

    const cookieCart = document.cookie.split("; ").find((row) => row.startsWith("cart="));

    if (cookieCart) {
      for (const item of JSON.parse(cookieCart.split("=")[1])) {
        html += `<div class="product">
                        <div class="row">
                          <div class="col-md-3">
                            <img class="img-fluid mx-auto d-block image imgSize" src="${catchAlbumByID(item.id).slika.src}">
                          </div>
                          <div class="col-md-8">
                            <div class="info">
                              <div class="row">
                                <div class="col-md-5 product-name">
                                  <div class="product-name">
                                    <a class="basketText" href="#">${catchArtistNameByID(catchAlbumByID(item.id).izvodjacID)}</a>
                                    <div class="product-info">
                                      <div>Album: <span class="value">${catchAlbumByID(item.id).naslov}</span></div>
                                      <div>Kategorija: <span class="value">${catchCategory(catchAlbumByID(item.id).kategorija)}</span></div>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-md-4 quantity">
                                  <label for="quantity">Kolicina:</label>
                                  <input id="quantity" data-id="${item.id}" type="number" value ="${cene[item.id] / catchAlbumByID(item.id).cena}" class="form-control quantity-input">
                                </div>
                                <div class="col-md-3 price">
                                  <span>${cene[item.id] ?? 0} RSD</span>
                                <span><button type="button" data-id="${item.id}" class="btn btn-outline-secondary brisanje">obrisi</button></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>`;
        cena += cene[item.id];
      }
      
      html +=`<div class="col-md-12 col-lg-4">
      <div class="summary">
        <h3>Summary</h3>
        <div class="summary-item"><span class="text">CENA</span><span class="price">${cena},00 RSD</span></div>
        <div class="summary-item"><span class="text">POŠTARINA:</span><span class="price">300,00 RSD</span></div>
        <div class="summary-item"><span class="text">UKUPNA CENA</span><span class="price">${cena + 300},00 RSD</span></div>
        <button type="button" id="buy" class="btn btn-outline-secondary">Kupi</button>
        <button type="button" id="delete-all" class="btn btn-outline-secondary">Obrisi korpu </button>
        </div>
      </div>
      </div> 
      </div>
      </div>
      </section>
      </main>
      </div>`;
 
      korpa.innerHTML = html;
/*dugmici za kupovinu,kolicinu */
      kolicine = document.getElementsByClassName('form-control quantity-input');
      for (let i = 0; i < kolicine.length; i++) {
        kolicine[i].addEventListener("click", () => {changePrice(kolicine[i])});
      }

      dugmiciZaBrisanjeProizvoda = document.getElementsByClassName("btn btn-outline-secondary brisanje");
      for (let i = 0; i < dugmiciZaBrisanjeProizvoda.length; i++) {
        dugmiciZaBrisanjeProizvoda[i].addEventListener("click", () => {deleteProduct(dugmiciZaBrisanjeProizvoda[i])});
      }
      
      document.getElementById('delete-all').addEventListener('click', deleteAll);
      document.getElementById('buy').addEventListener('click', () => {window.location='/contactForm.html';});
    } 
    else {
      html = "<div class=basketEmpty>Korpa je prazna</div>";
      korpa.innerHTML = html;
    }
  }
/* setovanje kolacica (ovakva funkcija postoji i u main.js)*/
  function setCookie(name, value, exDays) {
    let today = new Date();
    today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * exDays);
    document.cookie = name + "=" + value + "; " + "expires=" + today.toUTCString();
  }
  /*Brosanje kolacica (postoji u main.js u) */
  function deleteAll() {
    setCookie("cart", null, -1);
    chekKorpa();
  }
}


