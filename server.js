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


app.get('/', renderHomePage);
app.post('/results', collectResults); //searches : Search Results (POST)
app.get('/favorites', savedFavorites);
// /edit/:id : Editable of Selected Comic (GET)
app.post('/addcomic', addComicToFavorites); // This is the Form with a surprise cat being added
// /edit/:id : Make Changes to Selected Comic (PUT)
app.delete('/delete/:id', deleteOneFavorite) 
app.get('/about', renderAboutPage);
app.get('/error', renderErrorPage);
app.get('*', (request, response) => {
  response.status(500).send('Paw-don us, something un-fur-tunate seems to have occured.')
})
// app.get('/table', showData);
// ---------------------------------------FUNCTIONS---------------------------------------------

function renderHomePage(request, response){
  response.render('pages/index.ejs')
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
      // console.log('the comic array', comicArray[0].thumbnail);
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
function addComicToFavorites(request, response){
  let { title, description, image_url } = request.body;

  let url = 'https://api.thecatapi.com/v1/images/search';

  superagent.get(url)
    .then(results => {

      let randomCat = results.body[0].url;

      let sql = 'INSERT INTO comics (title, comic_url, description, cat_url) VALUES ($1, $2, $3, $4);';
      let safeValues = [title, image_url, description, randomCat];

      client.query(sql, safeValues)
    })


}



// /edit/:id : Make Changes to Selected Comic (PUT)




// /delete/:id : Remove Selected Comic from Favorites (DELETE)
function deleteOneFavorite(request, response){
  console.log(request.params.id, "hahahahahahahah");
  let sql = 'DELETE FROM comics WHERE ID=$1;';
  let id = request.params.id;
  let safeValues = [id];
  client.query(sql, safeValues)
    .then(result => response.status(200).redirect('/favorites'))
      .catch(error => console.log(error))
}



function renderAboutPage(request, response){
  response.render('pages/about.ejs')
}



function renderErrorPage(request, response){
  response.render('pages/error.ejs')
}


// function showData(request, response){
//   let sql = 'SELECT * FROM comics;';
//   client.query(sql)
//     .then(resultsFromPostgres => {
//       let comics = resultsFromPostgres.rows;
//       response.send(comics);
//     }).catch(err => console.log(err));
// }


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
