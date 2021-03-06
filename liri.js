require("dotenv").config();
const keys = require("./key.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const fs = require("fs");
const moment = require('moment');

/////////////////////////////////////////////

const command = process.argv[2];
let value = process.argv[3];
/// parse if user input more than two arguments

if (process.argv.length > 4) {
    value = process.argv.splice(3, process.argv.length - 1).join(" ");
}
// console.log(value);


getInput(command, value);


function getInput(command, value) {
    // Check if process.argv[2] exist, then run command
    if (command === undefined) {
        readme();
    } else {
        switch (command) {
            case "concert-this":
                concertThis(value);
                break;
            case "spotify-this-song":
                spotifyThisSong(value || "The Sign Ace of Base");
                break;
            case "movie-this":
                movieThis(value || "Mr. Nobody");
                break;
            case "do-what-it-says":
                doWhatItSays();
                break;
            default:
                readme();
                break;
        }
    }

}
function readme() {
    console.log(`
    Welcome to Liri Bot!
    I can help you search for a concert event using the following command:
    
    node liri.js concert-this <artist/band name here>

    Or search for a song:

    node liri.js spotify-this-song <song title here>

    Or a movie:

    node liri.js movie-this <movie title here>

    If you would like to access pre-programmed random commands,
    you could do so using this line:

    node liri.js do-what-it-says
    `);
    logger("Command Missing...");
}

function concertThis(artist) {
    // console.log(`Artist is ${artist}`);
    artistStr = artist.split(" ").join("+");
    // console.log(artist);

    const url = "https://rest.bandsintown.com/artists/" + artistStr + "/events?app_id=codingbootcamp";
    axios.get(url).then(res => {
        if (res.data.length === 0) {
            console.log('Events not found...');
        } else {
            let result = `
            ===============================================================
            ${artist} have the following concert events coming up
            ===============================================================
            `
            res.data.forEach(event => {
                result += `
                Name of the Venue: ${event.venue.name},
                Venue Location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}
                Date: ${moment(new Date(event.datetime)).format("MM/DD/YYYY")}
                `
            });
            console.log(result);
            logger("Concert This", artist, result);
        }
    });
}

function spotifyThisSong(title) {
    // console.log(`Song's title is ${title}`);

    spotify.search({ type: 'track', query: title, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let result = `
        ===============================================================================
        There are ${data.tracks.total} tracks with the name ${title} in Spotify
        Here are the top ${data.tracks.items.length}
        ===============================================================================
        `
        data.tracks.items.forEach(song => {
            result += `
            Artist(s): ${song.artists.reduce((acc, curr) => acc += curr.name + ", ", "")}
            Name: ${song.name},
            Album: ${song.album.name}
            Preview Url: ${song.preview_url}, `
        });
        console.log(result);
        logger("Spotify This Song", title, result);
    });
}

function movieThis(title) {
    // console.log(title);
    titleStr = title.split(" ").join("+");
    // console.log(title);
    const url = `http://www.omdbapi.com/?apikey=trilogy&t=${titleStr}`;
    axios.get(url).then(res => {
        const data = res.data;
        let result = `
        ================================================
                        Result Found:
        ================================================
        * Title: ${data.Title},
        * Year: ${data.Year},
        * Rating: ${data.imdbRating},
        * Rotten Tomatoes Rating: ${data.Ratings.filter(r => r.source === "Rotten Tomatoes").Value},
        * Country: ${data.Country},
        * Language: ${data.Language},
        * Actors: ${data.Actors},
        * Plot: ${data.Plot}
        `
        console.log(result);
        logger("Movie This", title, result);
    });

}

function doWhatItSays() {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        if (err) {
            console.log('Something went wrong while reading the file');
            console.log(err);
        } else {
            const command = data.split(",")[0];
            const value = data.split(",")[1];
            getInput(command, value);
            const result = `
            ====================================================================================
            Do what it says command issued: ${command}, ${value}
            For result see below
            ====================================================================================
            `
            logger("Do What It Says", "", result);
        }
    });
}

function logger(command, value, result) {
    let data = `
    ====================================================================================
    Time:${moment(new Date())}
    Command: ${command}, Value: ${value},
    Response Data:
    ${result}
    ====================================================================================
    `
    fs.appendFile("./log.txt", data, function (err) {
        if (err) {
            console.log(err);
        }
    });
}