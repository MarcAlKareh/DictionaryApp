const mainContainer = document.querySelector('.main-container');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

const clearMainContainer = function () {
  const wordContainer = document.querySelector('.word-container');
  const errorEl = document.querySelector('.error');
  if (wordContainer) mainContainer.removeChild(wordContainer);
  if (errorEl) mainContainer.removeChild(errorEl);
};

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

  clearMainContainer();

  // Render error message to screen
  mainContainer.insertAdjacentHTML('beforeend', errorMarkup);
};

const getWordData = async function (wrd) {
  try {
    // Sending request to API for data about word
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${wrd}`
    );

    // console.log(res);
    if (!res.ok) throw new Error('Could not find word');

    return res.json();
  } catch (err) {
    renderErrorMessage(err.message);
    console.error(err.message);
  }
};

const generateMarkup = function (wrdData) {
  if (!wrdData.sentenceExample) {
    return `
    <div class="word-container">
      <h2 class="word">${wrdData.word}</h2>
      <p class="word-type-pronunciation">${wrdData.partOfSpeech} ${wrdData.pronunciation}</p>
      <p class="word-definition">${wrdData.definition}</p>
    </div>
  `;
  }

  return `
    <div class="word-container">
      <h2 class="word">${wrdData.word}</h2>
      <p class="word-type-pronunciation">${wrdData.partOfSpeech} ${wrdData.pronunciation}</p>
      <p class="word-definition">${wrdData.definition}</p>
      <p class="word-example">${wrdData.sentenceExample}</p>
    </div>
  `;
};

const renderSearchResult = async function () {
  const word = searchInput.value;

  if (!word) return;

  // Make request to API with the inputted word
  const [data] = await getWordData(word);
  // console.log(data);
  const wordData = {
    word: data.word,
    definition: data.meanings[0].definitions[0].definition,
    partOfSpeech: data.meanings[0].partOfSpeech,
    sentenceExample: data.meanings[0].definitions[0].example,
    pronunciation: data.phonetics.find(obj => obj.text).text,
    audioUrl: data.phonetics.find(obj => obj.text).audio,
  };
  // console.log(wordData.sentenceExample);

  clearMainContainer();

  // Render data about word
  const wordMarkup = generateMarkup(wordData);
  mainContainer.insertAdjacentHTML('beforeend', wordMarkup);

  // Clear search input field
  searchInput.value = '';
};

searchButton.addEventListener('click', renderSearchResult);
