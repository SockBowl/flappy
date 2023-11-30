document.addEventListener('DOMContentLoaded', () => {
  const bird = document.querySelector('.bird');
  const gameContainer = document.querySelector('.game-container');
  const scoreContainer = document.querySelector('.score-container');
  const startContainer = document.querySelector('.start-container');
  const restartBtn = document.querySelector('.restart-btn');
  const restartModal = document.querySelector('.modal');
  const currentScore = document.querySelector('.current-score');
  const bestScore = document.querySelector('.best-score');
  const flapArr = ['downflap', 'midflap', 'upflap'];

  let birdLeft = 220;
  let birdBottom = 225;
  let gravity = 3;
  let gap = 430;
  let isGameOver = false;
  let score = 0;
  let flapNum = 2;
  let birdTimer;
  let pipeTimer;
  let flapTimer;

  // function oscheck() {
  //   let os = navigator.userAgent;
  //   let finalOs = '';
  //   if (os.search('Windows') !== -1) {
  //     finalOs = 'Windows';
  //   } else if (os.search('Mac') !== -1) {
  //     gravity = 3;
  //     // } else if (os.search('X11') !== -1 && !(os.search('Linux') !== -1)) {
  //     //   finalOs = 'UNIX';
  //     // } else if (os.search('Linux') !== -1 && os.search('X11') !== -1) {
  //     //   finalOs = 'Linux';
  //     // }
  //   } else {
  //   }
  // }

  function jumpControl(e) {
    if (e.keyCode === 32 || e.type === 'click') {
      jump();
    }
  }

  function jump() {
    if (birdBottom < 500) {
      birdBottom += 53;
      bird.style.bottom = birdBottom + 'px';
    }
  }

  function birdGravity() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + 'px';
  }

  function birdFlap() {
    flapNum--;
    if (flapNum < 0) flapNum = 2;
    bird.style.backgroundImage =
      "url('./flappy-bird-assets-master/sprites/yellowbird-" +
      flapArr[flapNum] +
      ".png')";
  }

  function startGame() {
    gameContainer.removeChild(startContainer);
    bird.style.opacity = 1;
    bird.style.left = birdLeft + 'px';
    gameSetup();
    generatePipe();
  }

  function restartGame() {
    restartModal.style.zIndex = '-1';
    const pipes = document.getElementsByClassName('.pipe');
    while (pipes.length > 0) {
      pipes[0].parentNode.removeChild(pipes[0]);
    }
    gameSetup();
    generatePipe();
  }

  function gameSetup() {
    score = 0;
    isGameOver = false;
    birdBottom = 225;
    scoreContainer.innerHTML = '';
    const zero = document.createElement('img');
    zero.src = './flappy-bird-assets-master/sprites/0.png';
    scoreContainer.appendChild(zero);
    document.addEventListener('keydown', jumpControl);
    document.addEventListener('click', jumpControl);
    birdTimer = setInterval(birdGravity, 20);
    flapTimer = setInterval(birdFlap, 20);
  }

  function generatePipe() {
    let pipeBottom = Math.floor(Math.random() * 80);
    let pipeLeft = 500;
    const lowerPipe = document.createElement('div');
    const upperPipe = document.createElement('div');
    if (!isGameOver) {
      lowerPipe.classList.add('lower-pipe', '.pipe');
      upperPipe.classList.add('upper-pipe', '.pipe');
      lowerPipe.style.left = pipeLeft + 'px';
      lowerPipe.style.bottom = pipeBottom + 'px';
      upperPipe.style.left = pipeLeft + 'px';
      upperPipe.style.bottom = pipeBottom + gap + 'px';
      gameContainer.appendChild(lowerPipe);
      gameContainer.appendChild(upperPipe);
    }

    function movePipe() {
      pipeLeft -= 4;
      lowerPipe.style.left = pipeLeft + 'px';
      upperPipe.style.left = pipeLeft + 'px';

      if (pipeLeft === -52) {
        clearInterval(moveTimer);
        gameContainer.removeChild(lowerPipe);
        gameContainer.removeChild(upperPipe);
      }

      if (collisionCheck(pipeLeft, pipeBottom)) {
        clearInterval(moveTimer);
        gameOver();
      }

      if (pipeLeft < 186 && pipeLeft > 182) {
        updateScore();
      }
    }
    let moveTimer = setInterval(movePipe, 15);
    if (!isGameOver) pipeTimer = setTimeout(generatePipe, 3000);
  }

  function gameOver() {
    clearInterval(birdTimer);
    clearInterval(flapTimer);
    clearTimeout(pipeTimer);
    isGameOver = true;
    document.removeEventListener('keydown', jumpControl);
    document.removeEventListener('click', jumpControl);
    setModal();
  }

  function collisionCheck(pipeLeft, pipeBottom) {
    if (
      pipeLeft > 186 &&
      pipeLeft < 254 &&
      (birdBottom < pipeBottom + 210 || birdBottom > pipeBottom + gap - 134)
      //134 is .ground height and .bird height combined.
      //210 is .pipe height subtract .ground height
    )
      return true;
    if (birdBottom <= 0) return true;
    return false;
  }

  function setModal() {
    restartModal.style.zIndex = '11';
    const currentBest = bestScoreCheck();
    setScoreImg(score, currentScore);
    setScoreImg(currentBest, bestScore);
  }

  function updateScore() {
    score += 1;
    setScoreImg(score, scoreContainer);
  }

  function setScoreImg(scoreNum, parent) {
    parent.innerHTML = '';
    const scoreArr = String(scoreNum).split('');
    for (let i = 0; i < scoreArr.length; i++) {
      const num = document.createElement('img');
      num.src = './flappy-bird-assets-master/sprites/' + scoreArr[i] + '.png';
      parent.appendChild(num);
    }
  }

  function bestScoreCheck() {
    let currentBest = window.localStorage.getItem('flappyBestScore');
    if (score > currentBest) {
      window.localStorage.setItem('flappyBestScore', score);
      currentBest = score;
    }
    return currentBest;
  }

  startContainer.addEventListener('click', startGame);
  restartBtn.addEventListener('click', restartGame);
});
