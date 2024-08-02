const movieContainer = document.getElementById('movie-container');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const noData = document.getElementById('no-data');

function fetchData() {
    fetch(`http://www.omdbapi.com/?s=${searchInput.value}&apikey=f33ec139`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.Response === 'False') {
            movieContainer.innerHTML = '<h2>No data found</h2>';
            return;
        }

        // Clear previous results
        movieContainer.innerHTML = '';

        // Iterate over the 'Search' array
        data.Search.forEach(movie => {
            fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=f33ec139`)
            .then(response => response.json())
            .then(movieDetails => {
                movieContainer.innerHTML += `
                <div class="movie">
                    <img class="poster" src="${movieDetails.Poster}" alt="${movieDetails.Title}">
                    <div>
                    <h3>${movieDetails.Title}</h3>
                    <p><strong>Year:</strong> ${movieDetails.Year}</p>
                    <p><strong>IMDb Rating ⭐:</strong> ${movieDetails.imdbRating}</p>
                    <p><strong>Description:</strong> ${movieDetails.Plot}</p>
                    <p><strong>Runtime:</strong> ${movieDetails.Runtime}</p>
                    <div class="add-container">
                    <p>Add Watchlist</p>
                    <img class="add-icon" src="${"/assets/add.svg"}" >
                    </div>
                    </div>
                </div>
                
                `;
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

searchButton.addEventListener('click', fetchData);
