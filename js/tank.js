const canvas = document.getElementById("fortress");
const ctx = canvas.getContext("2d");
const width = canvas.width; // 캔버스 가로
const height = canvas.height; // 캔버스 세로
const tankWidth = 50; // 탱크의 가로길이
const tankHeight = 50; // 탱크의 세로길이
let tankX = 0; //탱크의 위치(왼쪽 위 꼭지점) , canvas 상에서의 (0,0)은 왼쪽위 상단이다.
const tankDx = 3; //탱크가 움직이는속도(px)
let tankLeftPressed = false; //왼쪽 방향키가 눌렸는지 여부
let tankRightPressed = false; // 오른쪽 방향키가 눌렸는지 여부 
let tankCenterX; // 탱크의 중심 x 좌표
let tankCenterY; // 탱크의 중심 y 좌표
let cannonAngle = Math.PI / 4; // 포신의 각도 (45도)
const cannonAngleDIF = Math.PI / 60; // 각도의 변화량
const cannonLength = tankWidth * Math.sqrt(2); // 포신의 길이
const targetWidth = Math.floor(Math.random() * 100 + 30); //표적의 가로길이
const targetHeight = Math.floor(Math.random() * 100 + 10); // 표적의 세로길이
const targetX = Math.floor(Math.random() * (500 - targetWidth) + 500); // 표적의 x 좌표
const targetY = height - targetHeight; // 표적의 y좌표
let missileRadius = 5; // 미사일의 반지름
let missileX; // 미사일의 x 좌표
let missileY; // 미사일의 y좌표
let isCharging = false; // 미사일 파워게이지 차징 여부
let isFired = false; // 마시일이 발사되었는지 여부
let isHitted = false; // 공이 목표물에 명중했는지 여부
let gauge = Math.PI; // 파워게이지
const gaugeDIF = Math.PI / 60; // 파워게이지가 충전되는 속도
const gaugeBarRadius = 30; // 파워게이지바의 반지름
let missilePower; // 미사일 파워
let missileDx; //미사일 x방향 속도
let missileDy; //미사일 y방향 속도 
const GRAVITY_ACCELERATION = 0.098; // 공이 중력의 영향을 받는 힘

const draw = () => {
  ctx.clearRect(0, 0, width, height); //캔버스의 모든그림을 지우고
  tankCenterX = tankX + 0.5 * tankWidth;
  tankCenterY = height - 0.5 * tankHeight;
  if (tankLeftPressed && tankX > 0) { // 탱크의 위치 변화 탱크의 기본위치(왼쪽위 꼭지점)를 벗어나지않은조건
    tankX -= tankDx;
  }
  if (tankRightPressed && tankX + tankWidth < width) { //탱크가 오른쪽으로 이동할때 캔버스 넓이를 벗어나지 않는조건
    tankX += tankDx;
  }
  if (isCharging && !isFired) { // 게이지 충전을 표기
    if (gauge < Math.PI * 2) { // 게이지는 초기값에서 시작해 Math.PI*2 까지 충전
      gauge += gaugeDIF;
    };
    drawGausing();
  }
  if (!isFired) { //미사일이 발사중이 아닐때 포신의 끝에 미사일이 위치하도록 위치 지정해준다.
    missileX = tankCenterX + cannonLength * Math.cos(cannonAngle);
    missileY = tankCenterY - cannonLength * Math.sin(cannonAngle);
  } else { //발사되었을때의 미사일의 움직임을 그리기 위함
    missileDy -= GRAVITY_ACCELERATION; //중력가속도
    missileX = missileX + missileDx; //x방향으로 동일한힘을 받고
    missileY = missileY - missileDy; //y방향으로 아래쪽으로 점점 큰힘을 받는다.
  }
  checkMissile();
  drawTank();
  drawTarget();
  drawMissile();
  if (!isHitted) {
    drawTarget();
    drawMissile();
  }
};
const drawGausing = () => {
  ctx.beginPath();
  ctx.arc( // 게이지가 그려지는것을 보여준다
    tankCenterX,
    tankCenterY - cannonLength,
    gaugeBarRadius,
    Math.PI,
    gauge,
    false,
  );
  ctx.stroke();
}
const checkMissile = () => {
  // canvas 왼쪽, 오른쪽, 아래 벽에 닿으면
  if (missileX <= 0 || missileX >= width || missileY >= height) {
    isFired = false;
  } // target 명중
  if (
    missileX >= targetX &&
    missileX <= targetX + targetWidth &&
    missileY >= targetY
  ) {
    isHitted = true; //true 가 되면 목표물과 미사일이 더이상 보이지 않는다.
    clearInterval(start);
    if (confirm("명중입니다. 다시 하시겠습니까?")) {
      location.reload();
    }
  }
}
const drawTank = () => {
  ctx.lineWidth = 1; // 선의 두께
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tankX, height - tankHeight); //펜의 동선표기
  ctx.lineTo(tankX + tankWidth, height - tankHeight); //선그릴때 직선 표기
  ctx.lineTo(tankX + tankWidth, height);
  ctx.lineTo(tankX, height);
  ctx.lineTo(tankX, height - tankHeight);
  ctx.moveTo(tankCenterX, tankCenterY); // 포신의 위치 
  ctx.lineTo(
    tankCenterX + cannonLength * Math.cos(cannonAngle),
    tankCenterY - cannonLength * Math.sin(cannonAngle)
  );
  ctx.stroke();
  ctx.closePath();
};
const drawTarget = () => {
  ctx.fillRect(targetX, targetY, targetWidth, targetHeight);
  ctx.fillStyle = "red";
};
const drawMissile = () => {
  ctx.beginPath();
  ctx.arc(missileX, missileY, missileRadius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
};

draw();



const keydownHandler = event => { //방향키를 눌렀을때 발동
  if (event.keyCode === 37) {
    tankLeftPressed = true;
  } else if (event.keyCode === 39) {
    tankRightPressed = true;
  } else if (event.keyCode === 38 && cannonAngle <= Math.PI) {
    cannonAngle += cannonAngleDIF;
  } else if (event.keyCode === 40 && cannonAngle >= 0) {
    cannonAngle -= cannonAngleDIF;
  } else if (event.keyCode === 32 && !isFired) { //스페이스바를 누르면 게이지 충전 떼면 발사
    isCharging = true;
  }
};
const keyupHandler = event => { //방향키를 뗐을때 발동
  if (event.keyCode === 37) {
    tankLeftPressed = false;
  } else if (event.keyCode === 39) {
    tankRightPressed = false;
  } else if (event.keyCode === 32 && !isFired) {
    isCharging = false; //키를 뗄때 파워게이지의 충전이 끝남
    isFired = true; // 미사일의 발사를 감지
    missilePower = gauge * 1.6; //미사일이 가지는 힘 
    missileDx = missilePower * Math.cos(cannonAngle);
    missileDy = missilePower * Math.sin(cannonAngle);
    gauge = Math.PI; //스페이스바에서 손을떼면 게이지가 math.Pi 가 되도록 설정
  }
};

const start = setInterval(draw, 10); //10ms 초마다 실행
document.addEventListener('keydown', keydownHandler, false); // 이벤트 추가
document.addEventListener('keyup', keyupHandler, false);