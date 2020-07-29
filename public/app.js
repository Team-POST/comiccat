'use strict'

$('.favorites-button').on("click", function(){
    event.preventDefault();
    console.log('this is this thing this way', this)
    $(this).text('This title has been added to favorites');
});