/**
 * Copyright (c) 2022
 * |   arschedev                |
 * |   MaksymMNM                |
 * |   A. Proydenko (wert1x),   |
 * https://github.com/wert1x
 * https://github.com/arschedev
 * https://github.com/MaksymMNM
 */

const DEV = false;

/**
 * ! UTILS
 */
function $getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * ! COUNTERS
 */

let balls_counter = document.getElementById('balls');
let caught_counter = document.getElementById('caught');

/**
 * ! PARAMETERS
 */

let params = {
  fps: 35,
  size: () => 40 /* medium */,
  border: false
};

// to default
document.getElementById('fps').value = params.fps;
document.getElementById('size').value = params.size();
document.getElementById('border').checked = params.border;

// fps
function onFpsSelect(e) {
  params.fps = +e.options[e.selectedIndex].value;
  update();
}

// size
function onSizeSelect(e) {
  // random
  if (e.options[e.selectedIndex].value === 'random') {
    params.size = () =>
      // from "tiny" to "medium"
      $getRandomInt(10, 40);
  } else {
    // static
    params.size = () => +e.options[e.selectedIndex].value;
  }
}

// border
function onBorderCheck(e) {
  if (!e.checked) {
    document.getElementById('container').style.border = '0';
  } else {
    document.getElementById('container').style.border = '2px dashed #000';
  }
}

/**
 * ! GAME
 */

let container = document.getElementById('container');

// click event
document.getElementById('container').addEventListener('mousedown', click);

// balls data array
let balls = [];

// game update interval
let interval;

//! click
function click(event) {
  // was caught?
  if (wasCaught(event)) return;

  // create ball
  let ball = createBall(event);
  ball.element.className = 'ball';
  ball.element.style.width = ball.w + 'px';
  ball.element.style.height = ball.h + 'px';

  // add ball to container
  container.append(ball.element);

  // add ball data to the array of balls
  balls.push(ball);

  // increment Balls counter
  balls_counter.textContent = String(+balls_counter.textContent + 1).length < 2 ? '0' + String(
      +balls_counter.textContent + 1) : String(+balls_counter.textContent + 1);

  // start Update
  if (!interval)
    update();
}

// createBall
function createBall(event) {
  return {
    x: event.clientX,
    y: event.clientY,
    xS: Math.floor(Math.random() * 20) - 10,
    yS: Math.floor(Math.random() * 20) - 10,
    w: Math.floor(Math.random() * 20) + params.size(),
    h: Math.floor(Math.random() * 20) + params.size(),
    element: document.createElement('div')
  };
}

// wasCaught
function wasCaught(event) {
  for (let i = 0; i < balls.length; i++) {
    if (event.clientX >= balls[i].x && event.clientX <= balls[i].x + balls[i].w && event.clientY >= balls[i].y && event.clientY <= balls[i].y + balls[i].h) {
      DEV && console.log('Caught');

      // remove ball from screen
      balls[i].element.remove();

      // remove ball data from the array of balls
      balls.splice(i, 1);

      // increment Caught counter
      caught_counter.textContent = String(+caught_counter.textContent + 1).length < 2 ? '0' + String(
          +caught_counter.textContent + 1) : String(+caught_counter.textContent + 1);

      // decrement Balls counter
      balls_counter.textContent = String(+balls_counter.textContent - 1).length < 2 ? '0' + String(
          +balls_counter.textContent - 1) : String(+balls_counter.textContent - 1);

      return true;
    }
  }
}

//! interval
function update() {
  clearInterval(interval);
  interval = setInterval(Update, Math.floor(1000 / params.fps));
}

//! Update
function Update() {
  for (let i = 0; i < balls.length; i++) {
    // change position
    balls[i].x += balls[i].xS;
    balls[i].y += balls[i].yS;

    // make visible
    if (balls[i].element.style.display !== 'initial')
      balls[i].element.style.display = 'initial';

    // bounce off container walls
    /* collision check && change position */
    if (balls[i].x < 0 || balls[i].x > window.innerWidth - balls[i].w - 8 * 2) /* FIXME */
      balls[i].xS *= -1;
    /* collision check && change position */
    if (balls[i].y < 0 || balls[i].y > window.innerHeight - balls[i].h - 8 * 2) /* FIXME */
      balls[i].yS *= -1;

    // apply position
    balls[i].element.style.top = balls[i].y + 'px';
    balls[i].element.style.left = balls[i].x + 'px';
  }

  // bounce off balls
  for (let single in balls) {
    for (let others in balls) {
      if (others === single) continue;
      // collision check
      if ((Math.abs(balls[single].x - balls[others].x) + Math.abs(balls[single].y - balls[others].y)) <= 60) {
        DEV && console.log('Collision');

        // change position FIXME
        balls[single].xS *= -1;
        balls[single].yS *= -1;

        // apply position
        balls[single].element.style.top = balls[single].y + 'px';
        balls[single].element.style.left = balls[single].x + 'px';
      }
    }
  }
}

/**
 * ! TIMER
 * by MaksymMNM
 */

let min = 0;
let hour = 0;
let timer = document.getElementById("timer");

function init_timer() {
    sec = 0;
    setInterval(tick, 1000);
}

function tick() {
    sec++;
    if (sec >= 60) {
        min++;
        sec = sec - 60;
    }
    if (min >= 60) {
        hour++;
        min = min - 60;
    }
    if (sec <= 9) {
        if (min <= 9) {
            if (hour <= 9) {
                timer.innerHTML = "0" + hour + ":0" + min + ":0" + sec;
            } 
            else {
                timer.innerHTML = hour + ":0" + min + ":0" + sec;
            }
        } 
        else {
            if (hour <= 9) {
                timer.innerHTML = "0" + hour + ":" + min + ":0" + sec;
            } 
            else {
                timer.innerHTML = hour + ":" + min + ":0" + sec;
            }
        }
    } 
    else {
        if (min < 10) {
            if (hour <= 9) {
                timer.innerHTML = "0" + hour + ":0" + min + ":" + sec;
            } 
            else {
                timer.innerHTML = hour + ":0" + min + ":" + sec;
            }
        } 
        else {
            if (hour <= 9) {
                timer.innerHTML = "0" + hour + ":" + min + ":" + sec;
            } 
            else {
                timer.innerHTML = hour + ":" + min + ":" + sec;
            }
        }
    }
}