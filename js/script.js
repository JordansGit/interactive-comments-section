// fetch('./data.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

// Import Data + Global Variables 
import data from '../data.json' with { type: 'json' };

let {currentUser, comments: commentData} = data
console.log(currentUser);
console.log(commentData);

const modalCancelBtn = document.getElementById('modal-cancel-btn')
const modalDeleteBtn = document.getElementById('modal-delete-btn')
const deleteModal = document.getElementById('delete-modal')

let commentsAndRepliesCount = 0

// Event Listeners 
document.addEventListener('click', function(e) {
  // console.log(e.target.id === 'user-comment-submit')
  if (e.target.dataset.plus) {
    handleIncrement(e.target.dataset.plus)
  } else if (e.target.dataset.minus) {
    handleDecrement(e.target.dataset.minus)
  } else if (e.target.classList.contains('comment-delete-btn')) {
    openDeleteModal(e)
  } else if (e.target.id === 'user-comment-submit') {
    handleSubmitCommentBtn(e)
  } else if (e.target.classList.contains('comment-reply-btn')) {
    handleOpenReplyEl(e.target)
  } else if (e.target.id === 'user-reply-submit') {
    handleSubmitReply(e)
  }
})

// Functions 
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
    if (targetCommentObj.score > 1) {
      targetCommentObj.score -= 2
      targetCommentObj.isLiked = false
      targetCommentObj.isDisliked = true  
    } else {
      targetCommentObj.score = 0
    }
  } else if (!targetCommentObj.isDisliked) {
    if (targetCommentObj.score > 0) {
      targetCommentObj.score--
      targetCommentObj.isLiked = false
      targetCommentObj.isDisliked = true  
    }
  } else {
    targetCommentObj.score++
    targetCommentObj.isLiked = false
    targetCommentObj.isDisliked = false

  }

  render()
}

function openDeleteModal(e) {
  // get targetTweetEl and targetTweetObj, save them to variables
  const targetTweetEl = e.target.parentElement.parentElement

  let targetCommentObj = {}
  let commentId = Number(targetTweetEl.dataset.comment)

  targetCommentObj = commentData.filter(comment => comment.id === commentId)[0]
  if (targetCommentObj === undefined) {
    commentData.forEach(comment => {
      // targetCommentObj = comment.replies.filter(reply => reply.id === commentId)
      // not sure why it works with forEach() but doesn't work with filter()
      comment.replies.forEach(reply => {
        if (reply.id === commentId) {
          targetCommentObj = reply
        }
      })
    })
  }

  // open modal
  deleteModal.classList.add('show-modal')
  // click event listener, if cancel clicked run close modal func, if del click, run del btn func
  document.getElementById('modal-content').addEventListener('click', function(e) {
    if (e.target === modalCancelBtn) {
      handleCloseModal() 
    } else if (e.target === modalDeleteBtn) {
      handleDeleteComment(targetCommentObj)
    }
  })
}

function handleCloseModal() {
  deleteModal.classList.remove('show-modal')
}

function handleDeleteComment(targetCommentObj) {
  // console.log(targetCommentObj)
  let arr = [...commentData]
  // commentData.pop() // this removes the last comment and all it's replies. we only want to remove the specific comment or reply. 

  let newCommentData = []
  commentData.forEach(comment => {
    if (comment.id !== targetCommentObj.id) {
      if (comment.replies.length > 0) {
        comment.replies = comment.replies.filter(reply => {
          return reply.id !== targetCommentObj.id
        })
      }
      newCommentData.push(comment)
    }
  })
  console.log(newCommentData)
  commentData = newCommentData

  // targetTweetObj.remove() // this removes the element from the dom, we want to remove the obj from commentData then call render(). 
  deleteModal.classList.remove('show-modal')
  render()
}

function handleSubmitCommentBtn(e) {
  e.preventDefault()
  const submitCommentInput = document.getElementById('user-comment-input')
  // let tempId = commentsAndRepliesCount + 1
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
    console.log(commentData)
    render()
  }
}

let commentIndex = 0
let replyUsername = ''

function handleOpenReplyEl(replyBtn) {
  const targetTweetEl = replyBtn.parentElement

  console.log(commentData)
  console.log(targetTweetEl)
  // get target comment object 
  let targetCommentObj = {}
  let commentId = Number(targetTweetEl.dataset.comment)
  targetCommentObj = commentData.filter(comment => comment.id === commentId)[0]

  // get comment index if target comment is a parent comment (not a reply)
  if (commentData.indexOf(targetCommentObj) > -1) {
    commentIndex = commentData.indexOf(targetCommentObj)
  }
  if (targetCommentObj === undefined) {
    commentData.forEach(comment => {
      // get target reply obj. 
      let i = 0
      // targetCommentObj = comment.replies.filter(reply => reply.id === commentId)[0]
      // the filter method isn't working, something about it returns [object Object] instead of the actual object because it's workign w/ json data. idk. 
      comment.replies.forEach(reply => {
        if (reply.id === commentId) {
          targetCommentObj = reply
        }
      })
      // get parent object index for target reply obj. 
      comment.replies.forEach(reply => {
        if (reply.id === commentId) {
          commentIndex = commentData.indexOf(comment)
        }
      })
    })
  }
  
  // const replyUsername = targetCommentObj.user.username
  replyUsername = targetCommentObj.user.username
  const replyEl = targetTweetEl.nextElementSibling
  const ReplyTextArea = replyEl.querySelector('.user-comment-input')

  ReplyTextArea.value = `@${replyUsername}, `
  replyEl.classList.toggle('hide')
}

function handleSubmitReply(e) {
  e.preventDefault()
  
  const replyInputForm = e.target.parentElement
  const submitReplyInput = replyInputForm.querySelector('.user-reply-input')
  commentsAndRepliesCount++

  const replyingTo = commentData[commentIndex].user.username

  if (submitReplyInput.value.length > replyUsername.length + 3) {
    commentData[commentIndex].replies.push(
      {
        "id": commentsAndRepliesCount,
        "content": submitReplyInput.value.substr(replyUsername.length + 2),
        "createdAt": "just now",
        "score": 0,
        "isLiked": false,
        "isDisliked": false, 
        "replyingTo": replyUsername,
        "user": {
          "image": { 
            "png": "./images/avatars/image-juliusomo.png",
            "webp": "./images/avatars/image-juliusomo.webp"
          },
          "username": "juliusomo"
        },
      }
    )
    console.log(commentData)
    render()  
  }


  /* we want to add the reply to commentData. 
      if it comment is a comment obj, get the reply obj
      if the comment is a reply obj, get the comment obj (the parent of reply obj)
      push reply to comment.replies or reply.replies. 
      render()
  */ 

  /* 
    the above works, we just need to change the commentData.push to push it to a comment obj or reply obj. 
    
  */ 
}

// reply function 
/*
  when reply btn clicked,       ******* done 
    open reply div              ***** done 
  when submitReply btn clicked
    add reply to commentData 
*/ 


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
        <img class="delete-icon" src="./images/icon-delete.svg">
        Delete
      </button>
      <button class="comment-edit-btn">
        <img class="edit-icon" src="./images/icon-edit.svg">
        Edit
      </button>
    </div> 
  `

  let highlightUserDiv = `
    <p class="comment-highlight-user">you</p> <!-- need to add conditional statement. if user == true && ... --> 
  `

  let replySectionHtml = `
    <form class="comment add-comment hide" id="add-reply">
      <img class="user-avatar" src="${currentUser.image.png}">
      <textarea class="user-comment-input user-reply-input" rows="4" cols="50" placeholder="Add a reply..."></textarea>
      <button class="submit-btn" id="user-reply-submit">REPLY</button>
    </form>
  `

  commentsAndRepliesCount = 0

  commentData.forEach(comment => {
    const displayCommentBtns = checkUser(comment) ? editAndDeleteButtonsHtml : replyButtonHtml
    const displayHighlightUserDiv = checkUser(comment) ? highlightUserDiv : ''

    const incrementActive = comment.isLiked ? 'active' : ''
    const decrementActive = comment.isDisliked ? 'active' : ''

    const displayReplySection = !checkUser(comment) ? replySectionHtml : ''
  
    commentsAndRepliesCount++ 

    // individual comments
    commentsHtml += `
      <article class="comment" data-comment=${comment.id}>
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
      ${displayReplySection}    
    `

    // each reply to a comment. 
    if (comment.replies.length > 0) {
      comment.replies.forEach(reply => {

        const displayCommentBtnsReply = checkUser(reply) ? editAndDeleteButtonsHtml : replyButtonHtml
        const displayHighlightUserDivReply = checkUser(reply) ? highlightUserDiv : ''

        const incrementActiveReply = reply.isLiked ? 'active' : ''
        const decrementActiveReply = reply.isDisliked ? 'active' : '' 

        const displayReplySection = !checkUser(reply) ? replySectionHtml : ''

        commentsAndRepliesCount++

        // console.log(reply.replyingTo)
        commentsHtml += `
          <article class="comment nested-comment" data-comment=${reply.id}>
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
            ${displayReplySection}    
        `
      })
    }
  })
  
  // submit new comment. 
  commentsHtml += `
  <form class="comment add-comment" id="add-comment">
    <img class="user-avatar" src="${currentUser.image.png}">
    <textarea class="user-comment-input" id="user-comment-input" rows="4" cols="50" placeholder="Add a comment..."></textarea>
    <button class="submit-btn" id="user-comment-submit">SEND</button>
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
  js: edit btn

  css: desktop design / rwd 
  css: the vertical line for replies + make reply box smaller. 
*/ 

/* Notes: 
targetTweetObj()
 so far this seems to loop through each obj, but it seems abit janky to me. it might break if I try and more comments and more replies. 
 also, i'm thinking maybe the above code can be made into a seperate function called getTargetCommentObj(). 
  I think the code might be jank and it might break/run super slower if you had a proper full scale app w/ millions of comments. but for now it gets the job done and I cba to figure the correct way to do it at this point in time because I have other things to prioritise in my learnings. 


handleDeleteComment()
  probably not the cleanest code, but it's working. took me multiple sessions lasting a few hours each to figure it out. 
  i had to change commentData from a const to a let. I feel like this is bad practice just from tuts i've watched but it was the only way (that I currently know of) to get it to work. and it makes sense if I think about it, ofc I need to change the data when deleting an item from it. 

Delete Btn
  need to actually delete it from local storage or data.json file. But I won't do it this time around. 

user-comment-input and user-reply-input
  poor and overlapped naming. need a grp naming like user-text-input for css styling for both classes, then have the unique individual classes for js. 
*/ 

/* Bugs: 
Reply Btn
  after I've replied to any object 2nd or below in the list, it adds all future replies to that same list. 
  reply btn adds all replies to maxblagun replies list. 

replies left border
  there is a gap between each border. cba to fix it because it would require me to rewrite the whole code and although it would add some learning, it puts me further away from what I'm currently focused on learning. 

need to clean up / refactor js code 
*/ 