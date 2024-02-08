//! Spotify WebApp (Marco H.L.)

//* Application plan:
//? 1. Raw structure
// 1. Make an API call to https://striveschool-api.herokuapp.com/api/deezer/search?q=my_search with Postman
// 2. Make an API call to endpoint above with fetch, fill song's details into a proper template, then inject it into results box.
//? 2. Refactored code
// - search fn (async)
// - cycle res fn
// - create template and inject fn
//? 3. Query params for dedicated artist page
// - Next lesson...

// Area endpoints:
const songEndpoint = "https://striveschool-api.herokuapp.com/api/deezer/search";

// Nodi utili per la nostra WebApp:
// Input di ricerca:
const inputSearch = document.getElementById("searchField");

// Tasto di ricerca:
const btnSearch = document.getElementById("button-search");

// Box dei risultati:
const resultsBox = document.getElementById("searchSection");

// Risultato globale:
const myGlobalResult = "";

// Funzione di ricerca:
function getResults() {
    // Acquisisco il valore dell'input di ricerca della canzone:
    let searchValue = inputSearch.value;
    // Effettuo una AJAX verso l'enpoint particolarizzato col testo ricercato come parametro q:
    fetch(`${songEndpoint}?q=${searchValue}`) // Emette una promise
    .then(res => res.json()) // Emette una promise...
    .then(json => cycleResp(json.data))
    .catch(err => console.log(err))
}

// Funzione per ciclare l'array del payload:
function cycleResp(jsonData) {
    jsonData.forEach((song) => {
        createTemplate(song);
    });
}

// Funzione per creare il template della canzone:
function createTemplate(song) {
    // My song template:
    // <div class="text-light p-3 text-center">
    //   <img src="" alt="No image here...">
    //   <h6 class="mt-2 mb-0">Flower</h6>
    //   <a href="index.html?q=[song.artist.id]">Artista</a>
    // </div>

    let songBox = document.createElement("div");
    songBox.classList.add("text-light", "p-3", "text-center");
    let songImg = document.createElement("img");
    songImg.src = song.album.cover_medium;
    let songTitle = document.createElement("h6");
    songTitle.classList.add("mt-2", "mb-0");
    songTitle.innerText = song.title;
    let songArtist = document.createElement("a");
    songArtist.href = `index.html?q=${song.artist.id}`;

    songBox.appendChild(songImg);
    songBox.appendChild(songTitle);
    songBox.appendChild(songArtist);
}

