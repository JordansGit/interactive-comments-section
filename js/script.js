// fetch('./data.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

import data from '../data.json' with { type: 'json' };

const {currentUser, comments: commentData} = data
console.log(currentUser);
console.log(commentData);
let commentsAndRepliesCount = 0

document.addEventListener('click', function(e) {
  if (e.target.dataset.plus) {
    handleIncrement(e.target.dataset.plus)
  } else if (e.target.dataset.minus) {
    handleDecrement(e.target.dataset.minus)
  } else if (e.target.classList.contains('comment-delete-btn')) {
    handleDeleteCommentBtn(e)
  } else if (e.target.classList.contains('user-comment-submit')) {
    handleSubmitCommentBtn(e)
  }
})

function handleIncrement(id) {
  let targetCommentObj = {}
  let commentId = Number(id)

  targetCommentObj = commentData.filter(comment => comment.id === commentId)[0]
  if (targetCommentObj === undefined) {
    commentData.forEach(comment => {
      targetCommentObj = comment.replies.filter(reply => reply.id === commentId)[0]
    })
  }

  if (targetCommentObj.isDisliked) {
    targetCommentObj.score += 2
    targetCommentObj.isLiked = true
    targetCommentObj.isDisliked = false
  } else if (!targetCommentObj.isLiked) {
    targetCommentObj.score++
    targetCommentObj.isLiked = true
    targetCommentObj.isDisliked = false
  } else {
    targetCommentObj.score--
    targetCommentObj.isLiked = false
    targetCommentObj.isDisliked = false
  }
  // extra logic here so that if i've already clicked increment and I now click decrement, it now decrements by 2. so -1 to go back to og value, and -1 to go back to new minus value. 
  render()
}

function handleDecrement(id) {
  let targetCommentObj = {}
  let commentId = Number(id)

  targetCommentObj = commentData.filter(comment => comment.id === commentId)[0]
  if (targetCommentObj === undefined) {
    commentData.forEach(comment => {
      targetCommentObj = comment.replies.filter(reply => reply.id === commentId)[0]
    })
  }

  if (targetCommentObj.isLiked) {
    targetCommentObj.score -= 2
    targetCommentObj.isLiked = false
    targetCommentObj.isDisliked = true
  } else if (!targetCommentObj.isDisliked) {
    targetCommentObj.score--
    targetCommentObj.isLiked = false
    targetCommentObj.isDisliked = true
  } else {
    targetCommentObj.score++
    targetCommentObj.isLiked = false
    targetCommentObj.isDisliked = false

  }

  render()
}

function handleDeleteCommentBtn(e) {
  console.log(e.target.parentElement.parentElement)
  e.target.parentElement.parentElement.remove()
  /* 
    need to do pop up modal
    need to actually delete it from local storage or data.json file. 
  */ 
}

function handleSubmitCommentBtn(e) {
  e.preventDefault()
  const submitCommentInput = document.getElementById('user-comment-input')
  let tempId = commentsAndRepliesCount + 1
  commentsAndRepliesCount++

  if (submitCommentInput.value.length > 0) {
    commentData.push(
      {
        "id": commentsAndRepliesCount,
        "content": submitCommentInput.value,
        "createdAt": "just now",
        "score": 0,
        "isLiked": false,
        "isDisliked": false, 
        "user": {
          "image": { 
            "png": "./images/avatars/image-juliusomo.png",
            "webp": "./images/avatars/image-juliusomo.webp"
          },
          "username": "juliusomo"
        },
        "replies": []
      }
    )
    console.log(commentData[commentData.length-1])
    render()
  }
}


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

  commentsAndRepliesCount = 0

  commentData.forEach(comment => {
    const displayCommentBtns = checkUser(comment) ? editAndDeleteButtonsHtml : replyButtonHtml
    const displayHighlightUserDiv = checkUser(comment) ? highlightUserDiv : ''

    const incrementActive = comment.isLiked ? 'active' : ''
    const decrementActive = comment.isDisliked ? 'active' : ''
  
    commentsAndRepliesCount++ 

    // individual comments
    commentsHtml += `
      <article class="comment">
        <section class="comment-info">
          <img class="comment-avatar" src="${comment.user.image.png}">
          <p class="comment-username">${comment.user.username}</p>
          ${displayHighlightUserDiv}
          <p class="comment-date">${comment.createdAt}</p>  
        </section>
        <p class="comment-description">${comment.content}</p>
        <section class="comment-score">
          <button class="plus ${incrementActive}" data-plus=${comment.id}>
            <svg class="plus-icon" width="11" height="11" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor"/>
            </svg>              
          </button>
          <p class="comment-score-count">${comment.score}</p>
          <button class="minus ${decrementActive}" data-minus=${comment.id}>
            <svg class="minus-icon" width="11" height="3" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="currentColor"/>
            </svg>
          </button>
        </section>
        ${displayCommentBtns}
      </article>    
    `

    // each reply to a comment. 
    if (comment.replies.length > 0) {
      comment.replies.forEach(reply => {

        const displayCommentBtnsReply = checkUser(reply) ? editAndDeleteButtonsHtml : replyButtonHtml
        const displayHighlightUserDivReply = checkUser(reply) ? highlightUserDiv : ''

        const incrementActiveReply = reply.isLiked ? 'active' : ''
        const decrementActiveReply = reply.isDisliked ? 'active' : '' 

        commentsAndRepliesCount++

        commentsHtml += `
          <article class="comment nested-comment">
            <section class="comment-info">
              <img class="comment-avatar" src="${reply.user.image.png}">
              <p class="comment-username">${reply.user.username}</p>
              ${displayHighlightUserDivReply}
              <p class="comment-date">${reply.createdAt}</p>  
            </section>
            <p class="comment-description">
              <span class="reply-handle">@${reply.replyingTo}</span> <!-- change this!!!! --> 
              ${reply.content}
            </p>
            <section class="comment-score">
              <button class="plus ${incrementActiveReply}" data-plus=${reply.id}>
                <svg class="plus-icon" width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentColor"/>
                </svg>              
              </button>
              <p class="comment-score-count">${reply.score}</p>
              <button class="minus ${decrementActiveReply}" data-minus=${reply.id}>
                <svg class="minus-icon" width="11" height="3" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="currentColor"/>
                </svg>
              </button>
            </section>
            ${displayCommentBtnsReply}
            </article>    
        `
      })
    }
  })
  
  // submit new comment. 
  commentsHtml += `
  <form class="comment add-comment">
    <img class="user-avatar" src="${currentUser.image.png}">
    <textarea class="user-comment-input" id="user-comment-input" rows="4" cols="50" placeholder="Add a comment..."></textarea>
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
  js: delete btn 
    js: delete modal 
  js: edit btn
  js: add comment btn 

  js: reply btn 

  css: desktop design / rwd 
  css: the vertical line for replies + make reply box smaller. 
*/ 

/* Notes: 
targetTweetObj()
 so far this seems to loop through each obj, but it seems abit janky to me. it might break if I try and more comments and more replies. 
 also, i'm thinking maybe the above code can be made into a seperate function called getTargetCommentObj(). 
  I think the code might be jank and it might break/run super slower if you had a proper full scale app w/ millions of comments. but for now it gets the job done and I cba to figure the correct way to do it at this point in time because I have other things to prioritise in my learnings. 

*/ 