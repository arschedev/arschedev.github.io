/**
 * Copyright (c) 2022 A. Proydenko
 * Copyright (c) 2022 arschedev
 */

let container = document.getElementById('container');
document.body.addEventListener('mousedown', Click);

let balls = [];

function createBall(event) {
  return {
    x: event.clientX,
    y: event.clientY,
    xS: Math.floor(Math.random() * 20) - 10,
    yS: Math.floor(Math.random() * 20) - 10,
    w: Math.floor(Math.random() * 20) + 20,
    h: Math.floor(Math.random() * 20) + 20,
    div: document.createElement('div')
  };
}

function isCaught(event) {
  for (let i = 0; i < balls.length; i++) {
    if (event.clientX >= balls[i].x && event.clientX <= balls[i].x + balls[i].w && event.clientY >= balls[i].y && event.clientY <= balls[i].y + balls[i].h) {
      console.log('Caught!');
      balls[i].div.remove();
      balls.splice(i, 1);
      return true;
    }
  }
}

function Click(event) {
  // was caught
  if (isCaught(event)) {
    return;
  }

  // create ball
  let ball = createBall(event);
  ball.div.className = 'ball';
  ball.div.style.width = ball.w + 'px';
  ball.div.style.height = ball.h + 'px';

  // add ball to container
  container.append(ball.div);

  // add ball data to an array of balls
  balls.push(ball);
}

/**
 * Frames
 * 24 fps = 42
 * 30 fps = 33
 * 33 fps = 30 <-
 * 60 fps = 17
 */
setInterval(move, 30);

function move() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].xS;
    balls[i].y += balls[i].yS;

    // bouncing off container walls
    if (balls[i].x < 0 || balls[i].x > container.offsetWidth) {
      balls[i].xS *= -1;
    }
    if (balls[i].y < 0 || balls[i].y > container.offsetHeight) {
      balls[i].yS *= -1;
    }

    balls[i].div.style.top = balls[i].y + 'px';
    balls[i].div.style.left = balls[i].x + 'px';
  }

  // bouncing off other balls
  for (let single in balls) {
    for (let others in balls) {
      if (others === single) continue;
      if ((Math.abs(balls[single].x - balls[others].x) + Math.abs(balls[single].y - balls[others].y)) <= 30) {
        console.log('Detected!');
        balls[single].xS *= -1;
        balls[single].yS *= -1;
        balls[single].div.style.top = balls[single].y + 'px';
        balls[single].div.style.left = balls[single].x + 'px';
      }
    }
  }
}
