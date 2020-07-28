'use strict';

// set up libraries

const express = require('express');
const app = express();
const md5 = require('md5');
console.log(md5(`${Date.now()}3a8da8275c6b32fab8d943182873cdd09a0e9fc843a8be537a93bcd1dc393a50768c3f41`));


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
app.get('/searchresults', renderResultsPage);
app.post('/results', collectResults); //searches : Search Results (POST)
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
function renderResultsPage(request, response){
  response.render('pages/searchresults.ejs')
}

function collectResults(request, response){
  console.log('I am the request.query', request.body);
  let url = 'https://gateway.marvel.com/v1/public/comics';

  let hashValue = md5(`${Date.now()}${process.env.MARVEL_API}${process.env.MARVEL_PUBLIC_API}`);
  let comicParams = {
    apikey: process.env.MARVEL_PUBLIC_API,
    title: request.body.search,
    format: 'comic',
    formatType: 'comic',
    hash: hashValue,
    ts: Date.now()
  }


  superagent.get(url)
    .query(comicParams)
    .then(results => {
      let comicArray = results.body.data.results;
      console.log('the comic array', comicArray[0].thumbnail);
      let finalComicArray = comicArray.map(comic => {
        return new Comic(comic); //not sure about this, in book app its book.volumeInfo
      });

      // console.log('this is the final comic array:', finalComicArray);
      response.render('pages/results.ejs', {searchResults: finalComicArray})
    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('sorry the results are broken')
      // handleErrors(request,response);
    });
}



// /favorites : Saved Favorites (GET)




// /edit/:id : Editable of Selected Comic (GET)




// /addcomic : Add a new favorite comic (POST) // This is the Form with a surprise cat being added




// /edit/:id : Make Changes to Selected Comic (PUT)




// /delete/:id : Remove Selected Comic from Favorites (DELETE)




// /aboutus : Details About the Team (GET)




// /error : 404 Cat (GET)





// ---------------------------------------CONSTRUCTOR FUNCTION---------------------------------------------

function Comic(obj){
  this.title = obj.title ? obj.title : 'no title available';
  this.description = obj.description ? obj.description : 'no description available';
  this.comic_url = obj.thumbnail.path ? `${obj.thumbnail.path}.${obj.thumbnail.extension}` : 'no image available'
}

// console.log('the comic array', comicArray[0].thumbnail);

// Connect to Postgres and turn on the PORT

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    })
  });
