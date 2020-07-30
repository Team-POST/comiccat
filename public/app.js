'use strict'

$('.favorites-button').on("click", function(){
  // event.preventDefault(); // Why does this need to be turned off, for the route to work (because it doesn't save the comic book), but the rest of the function does?
  $(this).text('This title is in favorites');
  // location.href = '/addComic'; // this does work for routes as well as other "usual" urls.
});

// TODO: when user clicks addToFavorites we want to see if title already exists in database.

// let sql = 'SELECT * FROM comics;';
// client.query (sql)
//   .then

// TODO: if title exists then create an alert stating "congratulations this title has already been entered into your favorites."
// else continue on as usual.
