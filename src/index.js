// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', event => {

  // variables list
  const QUOTES_URL = 'http://localhost:3000/quotes';
  let allQuotesAPI; // to store quotes API as a variable
  const quoteListUl = document.getElementById('quote-list');

  // event listeners
  document.addEventListener('click', createQuote);
  document.addEventListener('click', increaseLike);
  document.addEventListener('click', deleteQuote);

  // initiate
  getQuotes().then(renderAllQuotes);

  // control functions
  function renderAllQuotes(quotes) {
    allQuotesAPI = quotes;

    allQuotesAPI.forEach(eachQuote => listQuote(eachQuote));
  }

  function listQuote(eachQuote) {
    quoteListUl.innerHTML += `
    <li class='quote-card' id="quote-${eachQuote.id}">
      <blockquote class="blockquote">
        <p class="mb-0">${eachQuote.quote}</p>
        <footer class="blockquote-footer">${eachQuote.author}</footer>
        <br>
        <button class='btn-success' data-like-id=${eachQuote.id}>Likes: <span>${eachQuote.likes}</span></button>
        <button class='btn-danger' data-delete-id=${eachQuote.id}>Delete</button>
      </blockquote>
    </li>
    `;
  }

  function createQuote(e) {
    e.preventDefault();

    if (e.target.className === 'btn btn-primary') {
      console.log('create');
      // debugger
      let createObj = {
        newQuote: e.target.parentElement[0].value,
        newAuthor: e.target.parentElement[1].value
      };
      postNewQuote(createObj).then(listQuote);
    }
  }

  function increaseLike(e) {
    if (e.target.className === 'btn-success') {
      console.log('like');
      // debugger
      const quoteLikeId = parseInt(e.target.dataset.likeId);
      let numOfLikes = parseInt(e.target.lastElementChild.innerText);
      getSingleQuote(quoteLikeId, numOfLikes)
      .then(singleQuote => {e.target.lastElementChild.innerText = singleQuote.likes});
    }
  }

  function deleteQuote(e) {
    if (e.target.className === 'btn-danger') {
      console.log('delete');
      // debugger
      const quoteDeleteId = parseInt(e.target.dataset.deleteId);
      const deletingList = document.querySelector(`#quote-${e.target.dataset.deleteId}`);
      deleteSingQuote(quoteDeleteId)
      // .then(e.target.parentElement.parentElement.remove());
      .then(deletingList.remove());
    }
  }

  // fetch functions
  function getQuotes() {
    return fetch(QUOTES_URL).then(r => r.json());
  }

  function postNewQuote(object) {
    const postConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quote: object.newQuote,
        likes: 0,
        author: object.newAuthor
      })
    };

    return fetch(QUOTES_URL, postConfig).then(r => r.json());
  }

  function getSingleQuote(id, likes) {
    const patchConfig = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        likes: ++likes
      })
    };

    return fetch(QUOTES_URL+`/${id}`, patchConfig).then(r => r.json());
  }

  function deleteSingQuote(id) {
    const deleteConfig = {method: 'DELETE'};
    return fetch(QUOTES_URL+`/${id}`, deleteConfig).then(r => r.json());
  }

});
