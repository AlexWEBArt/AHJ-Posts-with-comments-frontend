import {
  interval, mergeMap, map, from, forkJoin, toArray,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import CreateNewPost from './CreateNewPost';

import background from '../img/cell.jpg';

document.querySelector('body').style.backgroundImage = `url(${background})`;

const postBox = document.querySelector('.container-posts');

const postView = new CreateNewPost(postBox);

const PERIOD = 10000;
const BASE_URL = 'https://posts-with-comments-backend.onrender.com/posts';

const postsIds = new Set();

const latestPosts$ = from(ajax.getJSON(`${BASE_URL}/latest`))
  .pipe(
    mergeMap((posts) => {
      const commentObservables = posts.data.map((post) => from(ajax.getJSON(`${BASE_URL}/comments/latest/?id=${post.id}`))
        .pipe(
          map((response) => {
            const comments = response.data;
            return ({
              ...post,
              comments,
            });
          }),
        ));
      return forkJoin(commentObservables);
    }),
    toArray(),
  );

interval(PERIOD)
  .pipe(
    mergeMap(() => latestPosts$),
  ).subscribe((posts) => {
    const newPosts = posts[0].reduce((acc, post) => {
      if (postsIds.has(post.id)) {
        return acc;
      }

      postsIds.add(post.id);
      acc.push(post);
      return acc;
    }, []);

    for (const post of newPosts) {
      postView.renderPost(post);
      if (post.comments) {
        post.comments.forEach((comment) => {
          CreateNewPost.renderComment(comment);
        });
      }
    }
  });
