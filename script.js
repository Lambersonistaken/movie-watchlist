// movie-container ve diğer öğeleri al
const movieContainer = document.getElementById('movie-container');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const noData = document.getElementById('no-data');
const watchlistContainer = document.getElementById('watchlist-container');
const watchlistBody = document.getElementById('watchlist-body');
const watchlistNoData = document.getElementById('watchlist-no-data');

// index.html'de çalışacak kodlar
if (movieContainer && searchButton && searchInput && noData) {
    searchButton.addEventListener('click', fetchData);

    function fetchData() {
        fetch(`http://www.omdbapi.com/?s=${searchInput.value}&apikey=f33ec139`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.Response === 'False') {
                    movieContainer.innerHTML = '<h2>No data found</h2>';
                    return;
                }

                movieContainer.innerHTML = ''; // Önceki sonuçları temizle

                data.Search.forEach(movie => {
                    fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=f33ec139`)
                        .then(response => response.json())
                        .then(movieDetails => {
                            const movieDiv = document.createElement('div');
                            movieDiv.classList.add('movie');

                            movieDiv.innerHTML = `
                                <img class="poster" src="${movieDetails.Poster}" alt="${movieDetails.Title}">
                                <div>
                                    <h3>${movieDetails.Title}</h3>
                                    <p><strong>Year:</strong> ${movieDetails.Year}</p>
                                    <p><strong>IMDb Rating ⭐:</strong> ${movieDetails.imdbRating}</p>
                                    <p><strong>Description:</strong> ${movieDetails.Plot}</p>
                                    <p><strong>Runtime:</strong> ${movieDetails.Runtime}</p>
                                    <div class="add-container">
                                        <p>Add Watchlist</p>
                                        <img class="add-icon" src="/assets/add.svg">
                                    </div>
                                </div>
                            `;

                            const addIcon = movieDiv.querySelector('.add-icon');
                            addIcon.addEventListener('click', function () {
                                if (addIcon.src.includes('add.svg')) {
                                    addToWatchlist(movieDetails);
                                    addIcon.src = '/assets/remove.svg';
                                } else {
                                    removeToWatchlist(movieDetails);
                                    addIcon.src = '/assets/add.svg';
                                }
                            });

                            movieContainer.appendChild(movieDiv);
                        })
                        .catch(error => {
                            console.error('Error fetching movie details:', error);
                            movieContainer.innerHTML += '<h2>Error loading movie details</h2>';
                        });
                });

                searchInput.value = '';
                noData.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                movieContainer.innerHTML = '<h2>Error loading data</h2>';
            });
    }
}

// watchlist.html'de çalışacak kodlar
if (watchlistContainer && watchlistBody && watchlistNoData) {
    document.addEventListener('DOMContentLoaded', function () {
        if (localStorage.length === 0) {
            watchlistNoData.style.display = 'block';
            return;
        } else {
            watchlistNoData.style.display = 'none';
        }

        for (let i = 0; i < localStorage.length; i++) {
            const movieKey = localStorage.key(i);
            const movie = JSON.parse(localStorage.getItem(movieKey));

            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie-w');

            movieDiv.innerHTML = `
                <img class="poster" src="${movie.Poster}" alt="${movie.Title}">
                <div>
                    <h3>${movie.Title}</h3>
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>IMDb Rating ⭐:</strong> ${movie.imdbRating}</p>
                    <p><strong>Description:</strong> ${movie.Plot}</p>
                    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                    <div class="add-container">
                        <p>Remove from Watchlist</p>
                        <img class="remove-icon" src="/assets/remove.svg">
                    </div>
                </div>
            `;


            const removeIcon = movieDiv.querySelector('.remove-icon');
            removeIcon.addEventListener('click', function () {
                localStorage.removeItem(movie.Title);
                movieDiv.remove();

                if (localStorage.length === 0) {
                    watchlistNoData.style.display = 'block';
                }
            });

            watchlistBody.appendChild(movieDiv);
        }
    });
}

function addToWatchlist(movie) {
    const movieObj = {
        Title: movie.Title,
        Year: movie.Year,
        imdbRating: movie.imdbRating,
        Plot: movie.Plot,
        Runtime: movie.Runtime,
        Poster: movie.Poster
    };

    localStorage.setItem(movieObj.Title, JSON.stringify(movieObj));
}

function removeToWatchlist(movie) {
    localStorage.removeItem(movie.Title);
    console.log('removeToWatchlist', movie);
}
