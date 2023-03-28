import {
  Subject, catchError, of, interval, mergeMap, map,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import CreateNewPost from './CreateNewPost';

import background from '../img/cell.jpg';

document.querySelector('body').style.backgroundImage = `url(${background})`;

const postBox = document.querySelector('.container-posts');

const post = new CreateNewPost(postBox);

const PERIOD = 10000;
const BASE_URL = 'https://posts-with-comments-backend.onrender.com/posts';

const checkPostSubject$ = new Subject();

// function getRequest(url) {
//   return new Observable((observer) => {
//     const controller = new AbortController();

//     fetch(url, {
//       signal: controller.signal,
//     })
//       .then(res => res.json())
//       .then((data) => {
//         observer.next(data);
//         observer.complete();
//       })
//       .catchError(err => observer.error(err));
//     return () => controller.abort();
//   })
// }

let responsePost;

interval(PERIOD)
  .pipe(
    mergeMap(() => ajax.getJSON(`${BASE_URL}/latest`)
      .pipe(
        catchError((error) => {
          console.log('error: ', error);
          return of(null);
        }),
        map((value) => {
          responsePost = value;
          return value;
        }),
      )),
    mergeMap((value) => {
      const postId = value.data[0].id;
      return ajax.getJSON(`${BASE_URL}/comments/latest/?id=${postId}`)
        .pipe(
          map((responseComments) => ({ responsePost, responseComments })),
          catchError((error) => {
            console.log('error: ', error);
            return of(null);
          }),
        );
    }),
  )
  .subscribe(checkPostSubject$);

checkPostSubject$.subscribe({
  next: (value) => {
    const idList = Array.from(document.querySelectorAll('.container-post')).map((item) => item.getAttribute('id'));

    if (value.responsePost) {
      value.responsePost.data.forEach((item) => {
        if (!idList.includes(item.id)) {
          post.renderPost(item);
        }
      });
    }

    if (value.responseComments) {
      value.responseComments.data.forEach((item) => {
        CreateNewPost.renderComment(item);
      });
    }
  },
  error: (err) => console.log(err),
});

// checkPostSubject$.subscribe({
//   next: (value) => {
//     console.log(value);
//     if (value) {
//       value.value.data.forEach((item) => {
//         post.renderComment(item);
//       });
//     }
//   },
//   error: (err) => console.log(err),
// });
