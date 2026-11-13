let currentLane = 0; // -1: 왼쪽, 0: 가운데, 1: 오른쪽
let playerX = 0;
let playerY = 0;
let velY = 0;
let isJumping = false;
let slideTimer = 0;

let objects = [];
let score = 0;
let coins = 0;
let gameOver = false;
let gameSpeed = 0.0085;
let trackOffset = 0;

// 모바일 터치/스와이프 감지용 변수
let touchStartX = 0;
let touchStartY = 0;

function setup() {
  createCanvas(600, 800);
  smooth();
}

function draw() {
  drawBackground();

  if (gameOver) {
    drawTracks();
    drawCuteDog();
    fill(0, 150);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(44);
    text("GAME OVER", width / 2, height / 2 - 50);
    textSize(22);
    text("Score: " + score + "   |   Coins: " + coins, width / 2, height / 2 + 5);
    fill(255, 220, 100);
    text("Tap or Press 'R' to Restart", width / 2, height / 2 + 55);
    return;
  }

  trackOffset += gameSpeed * 12;
  if (trackOffset > 1.0) trackOffset -= 1.0;
  drawTracks();

  let targetX = currentLane * 145;
  playerX = lerp(playerX, targetX, 0.18);

  if (isJumping) {
    playerY += velY;
    velY += 1.05;
    if (playerY >= 0) {
      playerY = 0;
      isJumping = false;
    }
  }
  if (slideTimer > 0) slideTimer--;

  if (frameCount % 68 === 0) {
    let randLane = int(random(-1, 2));
    let r = random(1);
    let randType;
    if (r < 0.35) randType = 0;
    else if (r < 0.60) randType = 1;
    else if (r < 0.80) randType = 2;
    else randType = 3;

    objects.push(new GameObject(randLane, randType));

    if (gameSpeed < 0.018) {
      gameSpeed += 0.00012;
    }
  }

  for (let i = objects.size() - 1; i >= 0; i--) {
    let obj = objects[i];
    obj.update();
    obj.display();

    if (obj.z > 0.89 && obj.z < 0.97 && obj.lane === currentLane && !obj.collected) {
      if (obj.type === 3) {
        obj.collected = true;
        coins++;
        score += 50;
      } else if (obj.type === 0) {
        gameOver = true;
      } else if (obj.type === 1 && playerY > -38) {
        gameOver = true;
      } else if (obj.type === 2 && slideTimer === 0) {
        gameOver = true;
      }
    }

    if (obj.z > 1.12) {
      objects.splice(i, 1);
      if (obj.type !== 3) score += 10;
    }
  }

  drawCuteDog();
  drawUI();
}

function drawBackground() {
  background(135, 206, 250);
  noStroke();
  fill(175, 225, 255);
  rect(0, 120, width, 110);

  fill(255, 240);
  ellipse(120, 90, 90, 45);
  ellipse(155, 85, 70, 40);
  ellipse(90, 95, 60, 35);

  ellipse(460, 110, 100, 45);
  ellipse(495, 105, 75, 40);

  fill(110, 195, 95);
  rect(0, 220, width, height - 220);
}

function drawTracks() {
  let horizonY = 220;

  noStroke();
  fill(95, 90, 88);
  quad(width / 2 - 65, horizonY, width / 2 + 65, horizonY, width + 40, height, -40, height);

  for (let i = 0; i < 14; i++) {
    let t = (i + trackOffset) / 14.0;
    let p = pow(t, 2.2);
    let y = lerp(horizonY, height, p);
    let halfW = lerp(55, width * 0.48, p);
    let thick = lerp(1.5, 12, p);

    fill(70, 50, 35);
    rect(width / 2 - halfW, y, halfW * 2, thick);
  }

  stroke(210, 215, 220);
  for (let lane = -1; lane <= 1; lane++) {
    let topCenter = width / 2 + lane * 22;
    let botCenter = width / 2 + lane * 145;
    strokeWeight(2.5);
    line(topCenter - 7, horizonY, botCenter - 42, height);
    line(topCenter + 7, horizonY, botCenter + 42, height);
  }
}

function drawCuteDog() {
  push();
  translate(width / 2 + playerX, height - 95 + playerY);

  let runBounce = (isJumping || slideTimer > 0) ? 0 : abs(sin(frameCount * 0.28)) * 6;
  let legSwing = sin(frameCount * 0.28) * 9;
  let earWiggle = sin(frameCount * 0.35) * 0.12;
  let tailWag = sin(frameCount * 0.45) * 0.35;

  noStroke();
  fill(0, 70);
  let shadowScale = map(playerY, 0, -180, 1.0, 0.45);
  ellipse(0, -playerY + 38, 68 * shadowScale, 22 * shadowScale);

  translate(0, -runBounce);

  if (slideTimer > 0) {
    stroke(90, 50, 20);
    strokeWeight(2);

    fill(245, 235, 220);
    ellipse(-18, 32, 16, 12);
    ellipse(18, 32, 16, 12);

    fill(230, 155, 70);
    ellipse(0, 22, 66, 32);
    ellipse(0, 10, 50, 34);

    push();
    translate(-22, 2);
    rotate(-0.4);
    triangle(-8, 0, 4, -16, 10, 4);
    pop();

    push();
    translate(22, 2);
    rotate(0.4);
    triangle(-10, 4, -4, -16, 8, 0);
    pop();

    fill(255);
    ellipse(0, 24, 16, 16);

  } else {
    stroke(90, 50, 20);
    strokeWeight(2);

    fill(245, 235, 220);
    ellipse(-15, 28 + legSwing, 16, 20);
    ellipse(15, 28 - legSwing, 16, 20);

    noStroke();
    fill(255, 160, 170);
    ellipse(-15, 31 + legSwing, 7, 6);
    ellipse(15, 31 - legSwing, 7, 6);

    stroke(90, 50, 20);
    strokeWeight(2);
    fill(230, 155, 70);
    rect(-25, -14, 50, 44, 22);

    noStroke();
    fill(250, 245, 235);
    arc(0, 15, 44, 28, 0, PI);

    push();
    translate(0, 12);
    rotate(tailWag);
    stroke(90, 50, 20);
    strokeWeight(2);
    fill(255);
    ellipse(0, -4, 18, 18);
    pop();

    fill(230, 155, 70);
    ellipse(0, -28, 48, 42);
    noStroke();
    fill(250, 245, 235);
    ellipse(0, -34, 10, 22);

    stroke(90, 50, 20);
    strokeWeight(2);
    push();
    translate(-16, -42);
    rotate(-0.15 + earWiggle);
    fill(215, 130, 50);
    triangle(-10, 6, -4, -22, 10, 4);
    pop();

    push();
    translate(16, -42);
    rotate(0.15 - earWiggle);
    fill(215, 130, 50);
    triangle(-10, 4, 4, -22, 10, 6);
    pop();
  }
  pop();
}

function drawUI() {
  noStroke();
  fill(0, 110);
  rect(15, 15, 210, 75, 12);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text("SCORE : " + score, 30, 25);

  fill(255, 220, 60);
  text("COINS  : " + coins, 30, 55);
}

// 공통 액션 함수 (키보드 & 터치 공용)
function resetGame() {
  objects = [];
  score = 0;
  coins = 0;
  currentLane = 0;
  gameSpeed = 0.0085;
  gameOver = false;
}

function moveLeft() {
  if (currentLane > -1) currentLane--;
}

function moveRight() {
  if (currentLane < 1) currentLane++;
}

function doJump() {
  if (!isJumping) {
    velY = -19;
    isJumping = true;
    slideTimer = 0;
  }
}

function doSlide() {
  if (!isJumping) {
    slideTimer = 38;
  }
}

// PC 키보드 입력
function keyPressed() {
  if (gameOver && (key === 'r' || key === 'R')) {
    resetGame();
    return;
  }
  if (keyCode === LEFT_ARROW) moveLeft();
  if (keyCode === RIGHT_ARROW) moveRight();
  if (keyCode === UP_ARROW) doJump();
  if (keyCode === DOWN_ARROW) doSlide();
}

// 모바일 터치 시작
function touchStarted() {
  if (gameOver) {
    resetGame();
    return false;
  }
  if (touches.length > 0) {
    touchStartX = touches[0].x;
    touchStartY = touches[0].y;
  }
  return false;
}

// 모바일 터치 이동 방지
function touchMoved() {
  return false;
}

// 모바일 스와이프 방향 판별
function touchEnded() {
  if (gameOver) return false;

  // changedTouches 또는 마지막 좌표로 이동 거리 계산
  let endX = mouseX;
  let endY = mouseY;
  let dx = endX - touchStartX;
  let dy = endY - touchStartY;

  // 최소 25px 이상 밀었을 때 스와이프로 인식
  if (abs(dx) > 25 || abs(dy) > 25) {
    if (abs(dx) > abs(dy)) {
      if (dx > 0) moveRight();
      else moveLeft();
    } else {
      if (dy < 0) doJump();
      else doSlide();
    }
  }
  return false;
}

class GameObject {
  constructor(l, t) {
    this.lane = l;
    this.type = t;
    this.z = 0.0;
    this.collected = false;
  }

  update() {
    this.z += gameSpeed;
  }

  display() {
    if (this.collected) return;

    let horizonY = 220;
    let perspective = pow(this.z, 2.2);
    let y = lerp(horizonY, height - 55, perspective);
    let x = width / 2 + (this.lane * lerp(22, 145, perspective));
    let sc = lerp(0.14, 1.0, perspective);

    push();
    translate(x, y);
    scale(sc);

    if (this.type === 0) {
      stroke(30);
      strokeWeight(2);
      fill(210, 55, 55);
      rect(-48, -135, 96, 135, 10);
      fill(170, 40, 40);
      rect(-44, -142, 88, 12, 6);
      fill(180, 230, 255);
      rect(-38, -118, 76, 42, 6);
      noStroke();
      fill(255, 150);
      quad(-30, -114, -15, -114, -28, -80, -35, -80);
      fill(255, 200, 40);
      rect(-47, -62, 94, 14);
      stroke(30);
      strokeWeight(2);
      fill(255, 250, 160);
      ellipse(-28, -26, 18, 18);
      ellipse(28, -26, 18, 18);

    } else if (this.type === 1) {
      stroke(40);
      strokeWeight(2);
      fill(90);
      rect(-42, -45, 8, 45);
      rect(34, -45, 8, 45);
      fill(255, 140, 0);
      rect(-48, -42, 96, 22, 4);
      noStroke();
      fill(255);
      quad(-30, -41, -18, -41, -28, -21, -40, -21);
      quad(0, -41, 12, -41, 2, -21, -10, -21);
      quad(28, -41, 40, -41, 30, -21, 18, -21);

    } else if (this.type === 2) {
      stroke(40);
      strokeWeight(2);
      fill(120);
      rect(-44, -125, 7, 125);
      rect(37, -125, 7, 125);
      fill(45, 130, 220);
      rect(-48, -125, 96, 52, 6);
      noFill();
      stroke(255);
      strokeWeight(2);
      rect(-42, -119, 84, 40, 4);
      fill(255, 220, 50);
      noStroke();
      triangle(-12, -105, 12, -105, 0, -88);

    } else if (this.type === 3) {
      let spin = sin(frameCount * 0.12);
      let floatY = sin(frameCount * 0.1) * 5;
      translate(0, -30 + floatY);

      stroke(180, 120, 0);
      strokeWeight(2);
      fill(255, 215, 0);
      ellipse(0, 0, max(12, abs(spin) * 42), 42);

      if (abs(spin) > 0.35) {
        noStroke();
        fill(255, 245, 150);
        ellipse(-4 * spin, -6, abs(spin) * 14, 18);
      }
    }
    pop();
  }
}
