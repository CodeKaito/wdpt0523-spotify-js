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
// Songs endpoint:
const songEndpoint = "https://striveschool-api.herokuapp.com/api/deezer/search";

// Artists endpoint:
const artistEndpoint = "https://striveschool-api.herokuapp.com/api/deezer/artist/";

// Nodi utili per la nostra WebApp:
// Input di ricerca:
const inputSearch = document.getElementById("searchField");

// Tasto di ricerca:
const btnSearch = document.getElementById("button-search");

// Box dei risultati (canzoni):
const resultsBox = document.getElementById("searchSection");

// Box dei risultati (artista):
const artistArea = document.getElementById("artistSection");

// Input di live search:
const liveSearchInput = document.getElementById("live-search");

// Elemento spinner loader:
const spinner = document.getElementById("spinner");

// Risultati correntemente attivi:
let activeResults;

// Crea la pagina di show dell'artista, ma solo se l'URL contiene un parametro!
if(window.location.search) {
    let activeParams = window.location.search; // ?q=123
    let objParam = new URLSearchParams(activeParams);
    let artistId = objParam.get("q");

    fetch(`${artistEndpoint}${artistId}`) // Emette una promise
    .then(res => res.json()) // Emette una promise...
    .then(json => createArtistTemplate(json))
    .catch(err => {
        console.log(err);
    })
}

// Funzione di ricerca:
function getResults() {
    // Rendo visibile lo spinner:
    spinner.classList.toggle("d-none");
    // Acquisisco il valore dell'input di ricerca della canzone:
    let searchValue = inputSearch.value;
    // Effettuo una AJAX verso l'enpoint particolarizzato col testo ricercato come parametro q:
    fetch(`${songEndpoint}?q=${searchValue}`) // Emette una promise
    .then(res => res.json()) // Emette una promise...
    .then(json => cycleResp(json.data))
    .catch(err => {
        console.log(err);
        spinner.classList.toggle("d-none");
    })
}

// Funzione per ciclare l'array del payload:
function cycleResp(jsonData, savedResults = true) {
    if(savedResults) {
        activeResults = jsonData;
    }
    resultsBox.innerHTML = "";
    jsonData.forEach((song) => {
        createTemplate(song);
    });
    spinner.classList.toggle("d-none");
}

// Funzione per creare il template della canzone:
function createTemplate({ title, artist, album, preview }) {
    // My song template:
    // <div class="text-light p-3 text-center">
    //   <img src="" alt="No image here...">
    //   <h6 class="mt-2 mb-0">Flower</h6>
    //   <a href="index.html?q=[song.artist.id]">Artista</a>
    // </div>

    // <i class="fa-regular fa-circle-play"></i>

    let songBox = document.createElement("div");
    songBox.classList.add("text-light", "p-3", "text-center");
    let songImg = document.createElement("img");
    songImg.src = album.cover_medium;
    let songTitle = document.createElement("h6");
    songTitle.classList.add("mt-2", "mb-0");
    songTitle.innerText = title;
    let songArtist = document.createElement("a");
    songArtist.href = `index.html?q=${artist.id}`;
    songArtist.innerText = artist.name;
    let playBtn = document.createElement("i");
    playBtn.classList.add("fa-regular", "fa-circle-play", "ml-2");
    playBtn.addEventListener("click", () => {
        playSong(preview);
    });

    songBox.appendChild(songImg);
    songBox.appendChild(songTitle);
    songBox.appendChild(songArtist);
    songBox.appendChild(playBtn);

    resultsBox.appendChild(songBox);    
}

// Funzione per creare il template dell'artista:
function createArtistTemplate(artist) {
    // My song template:
    // <div class="text-light p-3 text-center">
    //   <img src="" alt="No image here...">
    //   <h6 class="mt-2 mb-0">Artist Name</h6>
    //   <h6 class="mt-2 mb-0">Fans Number</h6>
    //   <h6 class="mt-2 mb-0">Album Number</h6>
    // </div>

    let artistBox = document.createElement("div");
    artistBox.classList.add("text-light", "p-3", "text-center");
    let artistImg = document.createElement("img");
    artistImg.classList.add("mb-2");
    artistImg.src = artist.picture_medium;
    let artistName = document.createElement("h6");
    artistName.innerText = `Nome artista: ${artist.name}`;
    let artistFans = document.createElement("h6");
    artistFans.innerText = `Numero di fans: ${artist.nb_fan}`;
    let artistAlbums = document.createElement("h6");
    artistAlbums.innerText = `Numero di album: ${artist.nb_album}`;

    artistBox.appendChild(artistImg);
    artistBox.appendChild(artistName);
    artistBox.appendChild(artistFans);
    artistBox.appendChild(artistAlbums);

    artistArea.appendChild(artistBox);
}

// Funzione per riprodurre la demo del brano:
function playSong(url) {
    // console.log(url);
    let mySong = new Audio(url);
    mySong.play();
}

// Funzione per cercare in tempo reale fra i risultati restituiti dall'endpoint (activeResults):
function liveSearch() {
    if(activeResults) {
        let liveSearchValue = liveSearchInput.value;
        let filteredResults = activeResults.filter((song) => {
            return song.title.toLowerCase().includes(liveSearchValue.toLowerCase().trim());
        });

        cycleResp(filteredResults, false);

        // console.log(`Active results ${activeResults.length}`);
        // console.log(`Filtered results ${activeResults.length}`);
    }
}

