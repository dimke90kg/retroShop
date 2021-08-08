

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
      /*data = filterIzvodjaci(data);
      data = filterKategorija(data);
      data = filterStanje(data);*/
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
           <p>${catchArtists(element.id)}</p>
           <h5> ${element.cena} RSD</h5>
          
           <p id="${element.id}" value="${element.naStanju}"> ${
             element.naStanju ? "Proizvod je dostupna" : "Proizvod nema na stanju"
           }</p>
           <p class="card-text">
                 ${catchCategory(element.kategorija)}
           </p>
           <a href="#" class="btn btn-primary">Dodaj u korpu</a>
          </div>
          </div>
          </div>`;
      });
  
      if (!data.length) {
        html = "Proizvod nema na stanju";
      } else {
        document.getElementById("products").innerHTML = html;
      }
    }
    function filterChange() {
      getData("albumi.json", showAlbums);
    }
    function catchArtists(id) {
      let izvodjaciI = izvodjaci.filter((obj) => obj.id == id);
      imeP = izvodjaciI[0].ime;
      prezimeP = izvodjaciI[0].prezime;
      return imeP + " " + prezimeP;
    }
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
  
    
  /* Uradjena pretraga proizvoda po naslovu (potrebno je odraditi i po izvodjacu)*/
  
  
    function searchProducts(data) {
      var value = document.getElementById("searchProducts").value.toLowerCase();
        console.log(value);
        if (value) {
          return data.filter(function (el) {
            return el.naslov.toLowerCase().indexOf(value) !== -1;
          });
        }
        return data;
      }
      
  
  
  
    function filterChange() {
      getData("albumi.json",showAlbums);
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  