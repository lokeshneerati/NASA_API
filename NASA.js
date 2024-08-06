const apiKey = 'eU4edquiSm1cDdu5U2HIoCfMBh3E4dG9l7vHmac2';
const currentImageContainer = document.getElementById('current-image-container');
const searchHistory = document.getElementById('search-history');

// Fetch and display the current image of the day
async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    await fetchImage(currentDate);
}

// Fetch image of the day for a specific date
async function getImageOfTheDay(date) {
    await fetchImage(date);
    saveSearch(date);
    addSearchToHistory();
}

// Fetch image from NASA API
async function fetchImage(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
        const data = await response.json();

        if (data.media_type === 'image') {
            currentImageContainer.innerHTML = `
                <h3>${data.title}</h3>
                <img src="${data.url}" alt="${data.title}">
                <p>${data.explanation}</p>
            `;
        } else {
            currentImageContainer.innerHTML = `<p>Sorry, the media for this date is not an image.</p>`;
        }
    } catch (error) {
        currentImageContainer.innerHTML = `<p>Sorry, there was an error retrieving the image.</p>`;
    }
}

// Save the date to local storage
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

// Display search history
function addSearchToHistory() {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searchHistory.innerHTML = '';
    searches.forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        li.addEventListener('click', () => getImageOfTheDay(date));
        searchHistory.appendChild(li);
    });
}

// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('search-input').value;
    getImageOfTheDay(date);
});

// Load current image and search history on page load
window.onload = function() {
    getCurrentImageOfTheDay();
    addSearchToHistory();
};
