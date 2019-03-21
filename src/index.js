// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', () => {
  const ulQuoteList = document.getElementById('quote-list')
  const newQuoteForm = document.getElementById('new-quote-form')
  const newQuoteText = document.getElementById('new-quote')
  const newQuoteAuthor = document.getElementById('author')

  // fetch to get ALL quotes
  function getAllQuotes() {
    fetch('http://localhost:3000/quotes')
    .then(function(quoteData) {
      return quoteData.json()
    }).then(function(jsonData) {
      console.log(jsonData)
      renderAllQuotes(jsonData)
    })
  }

  // render all quotes to the ul quote list
  // clear out html first
  // iterate over quotes
  // add each one as a list item
  function renderAllQuotes(jsonData) {
    ulQuoteList.innerHTML = ''
    jsonData.forEach(function(quote) {
      ulQuoteList.innerHTML += `
      <li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
          <button class='btn-danger' data-id=${quote.id}>Delete</button>
        </blockquote>
      </li>
      `
    })
  }

  // add event listener for submitting form
  // send back quote and author from the form values
  // get all quotes again and render to the page
  newQuoteForm.addEventListener('submit', function(e) {
    e.preventDefault()
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({quote: newQuoteText.value, author: newQuoteAuthor.value, likes: 0})
    }).then(getAllQuotes)
  })

  // add event listener to ul quote list - either like or delete
  // if like, update likes in data (patch) and render
  // if delete, delete from database and render
  ulQuoteList.addEventListener('click', function(e) {
    let wantedId = parseInt(e.target.dataset.id)
    if (e.target.className === 'btn-success') {
      let likes = parseInt(e.target.lastChild.innerText)
      likes++
      fetch(`http://localhost:3000/quotes/${wantedId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({likes: likes})
      }).then(getAllQuotes)
    } else if (e.target.innerText === 'Delete') {
      console.log('delete button')
      fetch(`http://localhost:3000/quotes/${wantedId}`, {
        method: 'DELETE'
      }).then(getAllQuotes)
    }
  })

  getAllQuotes()

})
