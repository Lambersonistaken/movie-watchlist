const movieContainer = document.getElementById('movie-container');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const noData = document.getElementById('no-data');

// movie-container içeriğini her bir film için oluştururken, add watchlist img'ye click event listener ekleyeceğiz.
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
                // Yeni bir movie div'i oluştur
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');

                // movieDiv'in içeriğini oluştur
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

                // movieDiv'e event listener ekle
                const addIcon = movieDiv.querySelector('.add-icon');
                addIcon.addEventListener('click', function() {
                    // İcon'un src değerini değiştir
                    if (addIcon.src.includes('add.svg')) {
                        addIcon.src = '/assets/remove.svg';
                    } else {
                        addIcon.src = '/assets/add.svg';
                    }
                    // addToWatchlist fonksiyonuna movieDetails'i gönder
                    addToWatchlist(movieDetails);
                });

                // movieDiv'i movieContainer'a ekle
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

searchButton.addEventListener('click', fetchData);

// addToWatchlist fonksiyonu her movie için çağrılır
function addToWatchlist(movie) {
    console.log(movie.Title);
}

