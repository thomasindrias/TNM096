var ctx = null;

let solution = [];
let currentMap = null;

var tileW = 100,
  tileH = 100;
var mapW = 3,
  mapH = 3;
var currentSecond = 0,
  frameCount = 0;

window.onload = function () {
  const puzzle = new Puzzle(3);
  solution = puzzle.solve();
  ctx = document.getElementById("game").getContext("2d");
  requestAnimationFrame(drawGame);
  ctx.font = "bold 10pt sans-serif";
};

function setCurrentMap(map) {
  currentMap = map;
}

function drawGame() {
  if (ctx == null) {
    return;
  }

  var sec = Math.floor(Date.now() / 1000);
  if (sec != currentSecond) {
    currentSecond = sec;
  } else {
    frameCount++;
  }

  const solutionIndex = Math.round((frameCount / 30) % solution.length);

  currentMap = solution[solutionIndex].map;

  for (var x = 0; x < mapH; x++) {
    for (var y = 0; y < mapW; y++) {
      if (currentMap[x][y] === 0) ctx.fillStyle = "#1c1c1c";
      else ctx.fillStyle = "#30e661";

      ctx.fillRect(y * tileW, x * tileH, tileW, tileH);
      ctx.strokeStyle = "#1c1c1c";
      ctx.strokeRect(y * tileW, x * tileH, tileW, tileH);
      ctx.font = "28px Roboto";
      ctx.fillStyle = "#ff0000";

      if (currentMap[x][y] !== 0) {
        ctx.fillText(
          currentMap[x][y],
          y * tileW + tileW / 2 - 7,
          (x + 1) * tileH - tileH / 2 + 14
        );
      }
    }
  }

  if (solutionIndex === solution.length - 1) {
    setTimeout(() => {
      frameCount = 0;
      requestAnimationFrame(drawGame);
    }, 3000);
  } else {
    requestAnimationFrame(drawGame);
  }
}
