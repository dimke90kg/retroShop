/* importovane bib */
const express = require("express");
const bodyParser = require("body-parser");
const mySql = require("mysql");

/*podesavanja za bazu */
const connection = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "retroshop",
});

/*konektovanje na bazu */
connection.connect(function (error) {
  if (error) throw error;
  console.log("Konektovani ste na bazu");
});

const app = express();
const port = 5000;
/*podizanje servera */
app.listen(port, function () {
  console.log("Server je dignut na portu " + port);
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/*podesavanja servera,koji zahtevi su dozvoljeni */
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-control-Allow-Methods", "POST");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(__dirname, { index: "projects.html" }));
/* sta se radi na log in zahtevu */
app.post("/login", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  console.log("Pristigao login zahtev za email " + email);
  connection.query(
    "SELECT email,ime,prezime from korisnici where email=? and sifra=?",
    [ email, password],
    function (err, result, field) {
      if (result.length > 0) {
        if (err) throw err;
        console.log("Uspesan login za email " + email);
        res.json({
          result: "OK",
          data: result[0],
        });
      } else {
        console.log("Neuspesan login za email " + email);
        res.json({
          result: "Pogresni kredencijali",
        });
        return;
      }
    }
  );
});

app.post("/register", function (req, res) {
  var ime = req.body.ime;
  var prezime = req.body.prezime;
  var email = req.body.email;
  var sifra = req.body.password;
 
  console.log('Pristigao zahtev za registraciju sa mejlom ' + email);
  
  /* trazi korisnika sa unetim emai-om ,proverava da li postoji vec registrovan korisnik*/
  connection.query(
    "select * from korisnici where email=?",
    [email],

    function (err, result, filed) {
      console.log(err);
      if (result.length > 0) {
        console.log('Vec postoji korisnik!');
        res.json({
          result: "korisnik sa tim emailom postoji"
        });
      } else {
        connection.query(
          "INSERT INTO korisnici(ime,prezime,email,sifra) values(?,?,?,?)",
          [ime, prezime, email, sifra],
          function (err, result, field) {
            if (err) throw err;
          }
        );
        console.log('Uspesno');
        res.json({
          result: "OK",
          data: "Ubacen korisnik",
        });
      }
    }
  );
});
