Summary:

Comic Cats is an application that allows users to search for comics and save them, update them and shows a random cat with saved comic.

What Problem or Pain Point does it solve?

Allows you to save a reference to comics that you want to keep track of (favorites, to read, etc)
Pairs each comic with a thematically appropriate cat image, because we could all use some levity

Minimum MVP Definition

Be able to search for and save specific comics based on title or category
Each comic will be paired with a cat image.


Scope (In/Out)

IN:
- will show Marvel comics only from the Marvel API
- will show a random cat from the CAT API with saved comic
- will allow users to save a comic to the favorites page
- will allow users to edit comic details on the details view which will be visible on the favorites page
- will allow users to remove saved comics from favorites page

OUT:
- will not allow users to create a comic
- will not allow users to share across social media platforms
- will not allow users to upload personal cat photos


MVP:
- allow user to search Marvel API for comics
- allow user to save comics to favorites page
- allow user to edit saved comic in favorites page
- allow user to view saved comics in favorites page
- allow user to delete comics from favorites page
- allow user to navigate to different pages with nav bar
- allow user to have clean UI navigate through pages
- allow user to receive a random cat photo on saved comic

STRETCH:
- create username experience to save favorites to specific username
- load the search results on the main page
- in the edit/details page have a reading progress drop down menu to indicate if its a comic to read, have read or in progress
- add a field in the edit/details page to indicate what page you left off on in your comic
- make function so that user cannot duplicate a comic to the favorites page
- add an indicator on comic if it is already in favorites "already saved to favorites"
- tablet specific UI design
- ability to select from 10 cats when presented with a random cat so that user can pick which is the cat they most feel matches their feelings
- prevents duplicates of random cats when choosing a new cat
- prevents duplicates of random cats on the favorites page

Functional Requirements

1. A user can search Marvel API
1. A user can save to the database
1. A user can update to the database
1. A user can delete from the database

DATA FLOW

The user will enter the application and be presented with a search field with a radio to choose between Title or Hero to search the Marvel API for a comic. The user will receive a list of matches to the search and have the option to save chosen comics to the favorites page. The user can navigate to the favorites page from the nav bar to view the favorites page. The user can click on a saved favorite and be given an option to edit the comic or delete the comic from the favorites page. The user can click the edit button and be taken to a details page to allow the user to add or edit information about comic. The user can click the delete button and be brought back to the favorites page with the updated list. The user can go back to the nav bar to navigate to the main page to make more searches, go to the about me page or go to the favorites page. 

Non-Functional Requirements

Security:
- our application will have safeValues

Reusability:
- our application will have ejs partials to keep it DRY

Usability:
- our application will create an easy intuitive navigable user friendly experience 



