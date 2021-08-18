

window.onload = () => {
  /* ucitavanje proizvoda prilikom otvaranja stranice  */ 
  
  
    getData("kategorija.json", showCategorie);
    getData("izvodjaci.json", showArtists);
    getData("albumi.json", showAlbums);
    
  /* prazni nizovi koje kasnije popunjavamo */
  
    let izvodjaci = [];
    let albumi = [];
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
        html += `<div class="card" style="width: 15rem;">
           <img src="${
             element.slika.src
           }" alt="{element.slika.alt}">
           <div class="card-body">
           <h5 class="card-title"> ${element.naslov}</h5>
           <p>${catchArtistNameByID(element.id)}</p>
           <h5> ${element.cena} RSD</h5>
          
           <p id="${element.id}" value="${element.naStanju}"> ${
             element.naStanju ? "Proizvod je dostupna" : "Proizvod nema na stanju"
           }</p>
           <p class="card-text">
                 ${catchCategory(element.kategorija)}
           </p>
           <a class="btn btn-primary" data-id="${element.id}">Dodaj u korpu</a>
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

      var button = document.getElementsByClassName("btn btn-primary");
  
      for (let i = 0; i < button.length; i++) {
      button[i].addEventListener("click", addToBasket);
  
      }
      }
    

/*dohvatanje izvodjaca ime i prezime po  id-u */

    function catchArtistNameByID(id) {

      let izvodjaciI = izvodjaci.filter((obj) => obj.id == id);
      imeP = izvodjaciI[0].ime;
      prezimeP = izvodjaciI[0].prezime;
      return imeP + " " + prezimeP;
    }
  
  
  /*dohvatanje izvodjaca po id-u */


    function catchArtistByID(id) {
      console.log( izvodjaci.filter((obj) => obj.id == id));
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
      document.getElementById ("sortcategory").value;
        const chek = document.getElementById ("sortcategory").value;
  
       if(chek==0){
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
        console.log(value);
        if (value) {
          return data.filter(function (el) {
            return el.naslov.toLowerCase().indexOf(value) !== -1;
          });
        }
        return data;
      };
  
      
      function searchProductsByArtistFirstName(data) {
        var value = document.getElementById("searchProducts").value.toLowerCase();
          console.log(value);
          if (value) {
            return data.filter(function (el) {
              return catchArtistByID(el.izvodjacID).ime.toLowerCase().indexOf(value) !== -1;
            });
          }
          return [];
        }
        function searchProductsByArtistLastName(data) {
          var value = document.getElementById("searchProducts").value.toLowerCase();
            console.log(value);
            if (value) {
              return data.filter(function (el) {
                return catchArtistByID(el.izvodjacID).prezime.toLowerCase().indexOf(value) !== -1;
              });
            }
            return [];
          }
  
  /*pocetak rada korpe */

      function addToBasket() {

        const artistId = this.dataset.id;
      
         let cart = [];

       const cookies = document.cookie
         .split("; ")
          .find((row) => row.startsWith("cart="));
       if (cookies) {
         cart = JSON.parse(cookies.split("=")[1]);
    }

        if (cart.some((x) => x.id == artistId)) {
          cart.find((x) => x.id == artistId).quantity++;
     }   
    else {
      cart.push({ id: artistId, quantity: 1 });
    }

    setCookie("cart", JSON.stringify(cart), 5);
    
}

/* setovanje kolacica */
function setCookie(name, value, exDays) {
  let today = new Date();



  today.setTime(today.getTime() + 1000 * 60 * 60 * 24 * exDays);
  document.cookie =
    name + "=" + value + "; " + "expires=" + today.toUTCString();
}


    function filterChange() {
      getData("albumi.json",showAlbums);
    }
  
}
  
