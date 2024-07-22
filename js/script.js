// fetch('./data.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

import data from '../data.json' with { type: 'json' };

const {currentUser, comments: commentData} = data
console.log(currentUser);
console.log(commentData);

function checkUser(comment) {
  return currentUser.username === comment.user.username
}

function displayComments() {
  let commentsHtml = ``

  let replyButtonHtml = `
    <button class="comment-reply-btn">
      <img class="reply-icon" src="./images/icon-reply.svg">
      Reply
    </button>
  `

  let editAndDeleteButtonsHtml = `
    <div class="comment-btns">
      <button class="comment-delete-btn">
        <img class="reply-icon" src="./images/icon-delete.svg">
        Delete
      </button>
      <button class="comment-edit-btn">
        <img class="reply-icon" src="./images/icon-edit.svg">
        Edit
      </button>
    </div> 
  `

  let highlightUserDiv = `
    <p class="comment-highlight-user">you</p> <!-- need to add conditional statement. if user == true && ... --> 
  `

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
          <button class="plus">
            <img class="plus-icon" src="./images/icon-plus.svg">              
          </button>
          <p class="comment-score-count">${comment.score}</p>
          <button class="minus">
            <img class="minus-icon" src="./images/icon-minus.svg">
          </button>
        </section>
        ${replyButtonHtml}
      </article>    
    `

    // each reply to a comment. 
    if (comment.replies.length > 0) {
      comment.replies.forEach(reply => {

        const displayCommentBtns = checkUser(reply) ? editAndDeleteButtonsHtml : replyButtonHtml
        const displayHighlightUserDiv = checkUser(reply) ? highlightUserDiv : ''

        commentsHtml += `
          <article class="comment nested-comment">
            <section class="comment-info">
              <img class="comment-avatar" src="${reply.user.image.png}">
              <p class="comment-username">${reply.user.username}</p>
              ${displayHighlightUserDiv}
              <p class="comment-date">${reply.createdAt}</p>  
            </section>
            <p class="comment-description">
              <span class="reply-handle">@maxblagun</span> <!-- change this!!!! --> 
              ${reply.content}
            </p>
            <section class="comment-score">
              <button class="plus">
                <img class="plus-icon" src="./images/icon-plus.svg">              
              </button>
              <p class="comment-score-count">${reply.score}</p>
              <button class="minus">
                <img class="minus-icon" src="./images/icon-minus.svg">
              </button>
            </section>
            ${displayCommentBtns}
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


/* To do 
  js: increment, decrement 
  js: delete btn 
    js: delete modal 
  js: edit btn
  js: add comment btn 

  js: reply btn 

  css: desktop design / rwd 
  css: the vertical line for replies + make reply box smaller. 
*/ 