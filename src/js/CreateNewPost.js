import getCreationDate from './getCreationDate';

export default class CreateNewPost {
  constructor(conteiner) {
    this.container = conteiner;
  }

  renderPost(item) {
    const containerPost = document.createElement('DIV');
    const postHeader = document.createElement('DIV');
    const avatarContainer = document.createElement('DIV');
    const avatar = document.createElement('IMG');
    const authorContainer = document.createElement('DIV');
    const author = document.createElement('P');
    const timeStamp = document.createElement('P');
    const imageContainer = document.createElement('DIV');
    const image = document.createElement('IMG');
    const commentsBody = document.createElement('DIV');
    const commentsTitle = document.createElement('P');
    const commentsContainer = document.createElement('DIV');

    containerPost.classList.add('container-post');
    containerPost.setAttribute('id', item.id);
    postHeader.classList.add('post-header');
    avatarContainer.classList.add('avatar-container');
    avatar.classList.add('avatar');
    authorContainer.classList.add('author-container');
    author.classList.add('autor');
    timeStamp.classList.add('time-stamp');
    imageContainer.classList.add('image-container');
    image.classList.add('image');
    commentsBody.classList.add('comments-body');
    commentsTitle.classList.add('comments-title');
    commentsContainer.classList.add('comments-container');

    avatar.src = item.avatar;
    author.textContent = item.author;
    timeStamp.textContent = getCreationDate(item.created);
    image.src = item.image;
    commentsTitle.textContent = 'Latest comments';

    this.container.prepend(containerPost);
    containerPost.append(postHeader);
    containerPost.append(imageContainer);
    containerPost.append(commentsBody);
    postHeader.append(avatarContainer);
    postHeader.append(authorContainer);
    avatarContainer.append(avatar);
    authorContainer.append(author);
    authorContainer.append(timeStamp);
    imageContainer.append(image);
    commentsBody.append(commentsTitle);
    commentsBody.append(commentsContainer);
  }

  static renderComment(comment) {
    const requestedPost = Array.from(document.querySelectorAll('.container-post'))
      .filter((item) => item.getAttribute('id') !== comment.postId);

    const containerComment = document.createElement('DIV');
    const avatarContainer = document.createElement('DIV');
    const avatar = document.createElement('IMG');
    const textContainer = document.createElement('DIV');
    const author = document.createElement('P');
    const text = document.createElement('P');
    const timeStampContainer = document.createElement('DIV');
    const timeStamp = document.createElement('P');

    containerComment.classList.add('container-comment');
    containerComment.setAttribute('id', comment.id);
    avatarContainer.classList.add('avatar-container');
    avatar.classList.add('avatar');
    textContainer.classList.add('text-container');
    author.classList.add('author');
    text.classList.add('text');
    timeStampContainer.classList.add('time-stamp-container');
    timeStamp.classList.add('time-stamp');

    avatar.src = comment.avatar;
    author.textContent = comment.author;
    text.textContent = comment.content;
    timeStamp.textContent = getCreationDate(comment.created);

    requestedPost[0].querySelector('.comments-container').prepend(containerComment);
    containerComment.append(avatarContainer);
    containerComment.append(textContainer);
    containerComment.append(timeStampContainer);
    avatarContainer.append(avatar);
    textContainer.append(author);
    textContainer.append(text);
    timeStampContainer.append(timeStamp);
  }
}
