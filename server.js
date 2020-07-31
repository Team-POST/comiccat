'use strict';

// set up libraries

const express = require('express');
const app = express();
const md5 = require('md5');
require('dotenv').config();
const pg = require('pg');
require('ejs');
const superagent = require('superagent');
const methodOverride = require('method-override');
// const { request, response } = require('express');

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
app.get('/edit/:id', editComic); // /edit/:id : Editable of Selected Comic (GET)
app.post('/addcomic', addComicToFavorites); // This is the Form with a surprise cat being added
app.put('/edit/:id', updateComic); // /edit/:id : Make Changes to Selected Comic (PUT)
app.delete('/delete/:id', deleteOneFavorite);
app.get('/about', renderAboutPage);
app.get('/error', renderErrorPage);
app.get('*', (request, response) => {
  response.status(500).send('Paw-don us, something un-fur-tunate seems to have occured.')
})
app.post('/rollcat', rollCat);
// ---------------------------------------FUNCTIONS---------------------------------------------

function renderHomePage(request, response){
  response.render('pages/index.ejs')
}


function collectResults(request, response){
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
      if (comicArray && comicArray.length) {
        //if there is stuff in the search
        let finalComicArray = comicArray.map(comic => {
          return new Comic(comic);
        })
        response.render('pages/results.ejs', {searchResults: finalComicArray})
      } else {
        //if empty
        response.render('pages/notfound.ejs')
      }

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

function editComic(request, response){
  // response.send('howdy!')
  let id = request.params.id;
  let sql = 'SELECT * FROM comics WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(results => {
      let bookToEdit = results.rows[0]; // as of 07-28 only one object within rows will be returned, hence is known w finality that the only response will be rows 0 of that array.
      response.status(200).render('pages/edit.ejs', {incomingComic:bookToEdit});
    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('MEOW!!! %*.*%');
    })
}

// /addcomic : Add a new favorite comic (POST) // This is the Form with a surprise cat being added
function addComicToFavorites(request, response){
  let { title, description, image_url } = request.body;

  let shafeValues=[title];
  let checkDatabaseSql= 'SELECT * FROM comics WHERE title =$1;';
  client.query(checkDatabaseSql, shafeValues)
    .then(results =>{
      if(results.rowCount){
        let idForCount= results.rows[0].id;
        let newCount= 1 + results.rows[0].favorite_count;
        let safeIllUse = [idForCount, newCount];
        let seaQuill = 'UPDATE comics SET favorite_count=$2 WHERE id=$1;';
        client.query(seaQuill, safeIllUse)
      } else { // Beasley is working here on til 158. TODO:
        let url = 'https://api.thecatapi.com/v1/images/search';

        superagent.get(url)
          .then(results => {
            let randomCat = results.body[0].url;
            let initialCount = 1;
            let sql = 'INSERT INTO comics (title, comic_url, description, cat_url, favorite_count) VALUES ($1, $2, $3, $4, $5);';
            let safeValues = [title, image_url, description, randomCat, initialCount];

            client.query(sql, safeValues)
          })
      }
    });
}



// /edit/:id : Make Changes to Selected Comic (PUT)

function updateComic(request, response) {
  let id = request.params.id;
  let {description, notes, progress} = request.body;
  let sql = 'UPDATE comics SET description=$1, notes=$2, progress=$3 WHERE id=$4;';

  let safeValues = [description, notes, progress, id];

  client.query(sql, safeValues)
    .then(()=> {
      response.status(200).redirect('/favorites')
    }).catch(error => {
      console.log('ERROR', error);
      response.status(500).send('ah, the FURor! no update yet.');
    });
}


// /delete/:id : Remove Selected Comic from Favorites (DELETE)
function deleteOneFavorite(request, response){
  let sql = 'DELETE FROM comics WHERE ID=$1;';
  let id = request.params.id;
  let safeValues = [id];
  client.query(sql, safeValues)
    .then(() => response.status(200).redirect('/favorites'))
    .catch(error => console.log(error))
}



function renderAboutPage(request, response){
  response.render('pages/about.ejs')
}



function renderErrorPage(request, response){
  response.render('pages/error.ejs')
}



function rollCat(request, response){
  let url = 'https://api.thecatapi.com/v1/images/search';

  let {id} = request.body;
  superagent.get(url)
    .then(results => {
      let getCat = results.body[0].url;

      // let sql = 'UPDATE * comics (cat_url) VALUES ($1);';
      let sql = 'UPDATE comics SET cat_url=$1 WHERE id=$2;';
      let safeValues = [getCat, id];

      client.query(sql, safeValues)
      response.status(200).redirect('/favorites')
    })
    .catch(error => console.log(error))
}


// ---------------------------------------CONSTRUCTOR FUNCTION---------------------------------------------

function Comic(obj){
  this.title = obj.title ? obj.title : 'no title available';
  this.description = obj.description ? obj.description : 'no description available';
  this.comic_url = obj.thumbnail.path ? `${obj.thumbnail.path}.${obj.thumbnail.extension}` : 'no image available'
}




// Connect to Postgres and turn on the PORT

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    })
  });
