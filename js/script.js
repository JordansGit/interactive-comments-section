// fetch('./data.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

import data from '../data.json' with { type: 'json' };

const {currentUser, comments: commentData} = data
console.log(currentUser);
console.log(commentData);

function displayComments() {
  let commentsHtml = ``

  commentData.forEach(comment => {
    // individual comments
    commentsHtml += `
      <article class="comment">
        <section class="comment-info">
          <img class="comment-avatar" src="${comment.user.image.png}">
          <p class="comment-username">${comment.user.username}</p>
          <p class="comment-date">${comment.createdAt}</p>  
        </section>
        <p class="comment-description">${comment.content}</p>
        <section class="comment-score">
          <button class="+">+</button>
          <p class="comment-score-count">${comment.score}</p>
          <button class="-">-</button>
        </section>
        <button class="comment-reply-btn">Reply</button>
      </article>    
    `

    // each reply to a comment. 
    if (comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        commentsHtml += `
          <article class="comment nested-comment">
            <section class="comment-info">
              <img class="comment-avatar" src="${reply.user.image.png}">
              <p class="comment-username">${reply.user.username}</p>
              <p class="comment-date">${reply.createdAt}</p>  
            </section>
            <p class="comment-description">${reply.content}</p>
            <section class="comment-score">
              <button class="+">+</button>
              <p class="comment-score-count">${reply.score}</p>
              <button class="-">-</button>
            </section>
            <button class="comment-reply-btn">Reply</button>
          </article>    
        `
      })
    }
  })
  
  // submit new comment. 
  commentsHtml += `
  <form class="comment add-comment">
    <img class="user-avatar" src="${currentUser.image.png}">
    <textarea class="user-comment-input" rows="4" cols="50" placeholder="Add a comment..."></textarea>
    <button class="user-comment-submit">SEND</button>
  </form>
  `

  return commentsHtml
}

function render() {
  let commentsDiv = document.querySelector('.comment-thread')

  commentsDiv.innerHTML = displayComments()
}

render()