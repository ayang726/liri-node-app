# Liri Node App
Harcam Homework Unit 10

## Pre-requisits
* Create .env file which contains Spotify ID and Spotify Secret in the following format:
    * SPOTIFY_ID=[your-spotify-id],
    * SPOTIFY_SECRET=[your-spotify-secret]

* Do a npm i to install the dependances.

## Running The APP
Run node liri.js will show a list of instructions as follows:

Welcome to Liri Bot!
I can help you search for a concert event using the following command:
    
    node liri.js concert-this <artist/band name here>

Or search for a song:

    node liri.js spotify-this-song <song title here>

Or a movie:

    node liri.js movie-this <movie title here>

If you would like to access pre-programmed random commands,you could do so using this line:

    node liri.js do-what-it-says