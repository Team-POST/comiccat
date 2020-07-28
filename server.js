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
app.get('/favorites', savedFavorites);
function savedFavorites(request, response){
  let sql = 'SELECT * FROM comics;';
  client.query(sql)
    .then(results => {
      let comics = results.rows;
      response.status(200).render('pages/favorites', {allTheFavorites : comics})
    }).catch( error => console.log('air ROAR', error))
}



// /edit/:id : Editable of Selected Comic (GET)




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
