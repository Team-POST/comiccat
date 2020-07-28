'use strict';

// set up libraries

const express = require('express');
const app = express();

require('dotenv').config();
const pg = require('pg');
require('ejs');
const superagent = require('superagent');
const methodOverride = require('method-override');

// set up middleware

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// set up global variables

const PORT = process.env.PORT || 3001;
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => {
  console.log('ERROR', error);
});

// set up view engine

app.set('view engine', 'ejs');

// ---------------------------------------ROUTES---------------------------------------------

// / : Homepage (GET)
// /searches : Search Results (POST)
// /favorites : Saved Favorites (GET)
// /edit/:id : Editable of Selected Comic (GET)
// /addcomic : Add a new favorite comic (POST) // This is the Form with a surprise cat being added
// /edit/:id : Make Changes to Selected Comic (PUT)
// /delete/:id : Remove Selected Comic from Favorites (DELETE)
// /aboutus : Details About the Team (GET)
// /error : 404 Cat (GET)
// * ERROR (GET)

// ---------------------------------------FUNCTIONS---------------------------------------------

// / : Homepage (GET)




// /searches : Search Results (POST)




// /favorites : Saved Favorites (GET)




// /edit/:id : Editable of Selected Comic (GET) TODO:

app.get('/edit/:id', editComic);

function editComic(request, response){
  // response.send('howdy!')
  let id = request.params.id;
  let sql = 'SELECT * FROM comics WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(results => {
      console.log(results);
      let bookToEdit = results.rows[0]; // as of 07-28 only one object within rows will be returned, hence is known w finality that the only response will be rows 0 of that array.
      response.status(200).render('pages/edit.ejs', {incomingComic:bookToEdit});
    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('MEOW!!! %*.*%');
    })
}




// /addcomic : Add a new favorite comic (POST) // This is the Form with a surprise cat being added




// /edit/:id : Make Changes to Selected Comic (PUT)




// /delete/:id : Remove Selected Comic from Favorites (DELETE)




// /aboutus : Details About the Team (GET)




// /error : 404 Cat (GET)





// ---------------------------------------CONSTRUCTOR FUNCTION---------------------------------------------



// Connect to Postgres and turn on the PORT

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    })
  });
