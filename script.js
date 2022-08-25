const mainContainer = document.querySelector('.main-container');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

const renderErrorMessage = function (errorMessage) {
  const errorMarkup = `
    <div class="error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon-error"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
      <p class="error-message">${errorMessage}</p>
    </div>
  `;

  const wordContainer = document.querySelector('.word-container');
  const errorEl = document.querySelector('.error');
  if (wordContainer || errorEl) mainContainer.removeChild(wordContainer);

  // Add error message to screen
  mainContainer.insertAdjacentHTML('beforeend', errorMarkup);
};

const getWordData = async function (wrd) {
  try {
    // Sending request to API for data about word
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${wrd}`
    );

    console.log(res);
    if (!res.ok) throw new Error('Could not find word');

    return res.json();
  } catch (err) {
    renderErrorMessage(err.message);
    console.error(err.message);
  }
};

const renderSearchResult = function () {
  const word = searchInput.value;

  if (!word) return;

  // Make request to API with the inputted word
  getWordData(word);

  // Clear search input field
  searchInput.value = '';

  console.log(word);
};

searchButton.addEventListener('click', renderSearchResult);
