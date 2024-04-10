let cv, ctx;
let amp = 0.5;
let freq = 3;
let cp = 0.5;
let mem = [];

window.onload = function() {
  setup();
}

const setup = function() {
  cv = document.querySelector('canvas');
  ctx = cv.getContext('2d');
  document.getElementById('range1').oninput = () => {
    freq = Number(document.getElementById('range1').value);
    document.getElementById('frequency').innerHTML = freq;
    getGraph();
  };
  document.getElementById('range2').oninput = () => {
    amp = Number(document.getElementById('range2').value);
    document.getElementById('amplitude').innerHTML = amp;
  };
  document.getElementById('range3').oninput = () => {
    cp = Number(document.getElementById('range3').value);
    document.getElementById('cp').innerHTML = cp;
  };
  getGraph();
  // draw();
  setInterval(draw, 100);
};

const draw = function() {
  background(cv, 'black');
  let settings = {
    minX: 0,
    maxX: 4.5,
    minY: 0,
    maxY: 1.2,
    xC1: 50,
    xC2: cv.width - 50,
    yC1: 150,
    yC2: 50,
    deltaX: 0.01,
    axesOn: true,
    axesColor: 'white',
    graphColor: 'yellow',
    unitX: 0.5,
    unitY: 0.5
  };
  graph(cv, x => sinusoid(x + 1 / 4 / freq) + 0.6, settings);
  drawCircle();
  drawCMGraph();
}

function sinusoid(t) {
  return amp * Math.sin(2 * Math.PI * freq * t);
}

const drawCircle = function(cycles = cp) {
  let angle = Math.PI * 1.5;
  ctx.save();
  let origin = createVector(150, 400);
  ctx.translate(origin.x, origin.y);
  ctx.strokeStyle = 'white';
  ctx.ellipse(0, 0, 2, 2);
  let b = 0;
  let angle1 = (b + 1 / 4 / freq) * 2 * Math.PI * cycles;
  let angle2 = angle1;
  let mag = 100;
  let massX = [];
  let massY = [];
  for (let x = b; x < 4.5; x += 0.001) {
    let r = (sinusoid(x + 1 / 2 / freq) + 0.6) * mag;
    let angle1 = (x + 1 / 4 / freq) * 2 * Math.PI * cycles;
    ctx.line(r * Math.cos(angle1), r * Math.sin(angle1), r * Math.cos(angle2), r * Math.sin(angle2));
    massX.push(Math.cos(angle1));
    massY.push(Math.sin(angle1));
    angle2 = angle1;
  }
  let cm = createVector(mean(massX), mean(massY));
  ctx.fillStyle = 'red';
  ctx.ellipse(cm.x, cm.y, 4, 4);
  ctx.restore();
  return cm;
}

const getCM = function(cycles) {
  let b = 0;
  let mag = 100;
  let massX = [];
  let massY = [];
  for (let x = b; x < 4.5; x += 0.05) {
    let r = (sinusoid(x + 1 / 2 / freq) + 0.6) * mag;
    let angle1 = (x + 1 / 4 / freq) * 2 * Math.PI * cycles;
    massX.push(r * Math.cos(angle1));
    massY.push(r * Math.sin(angle1));
  }
  return createVector(mean(massX), mean(massY));
}

const getGraph = function() {
  mem = [];
  for (let c = 0; c < 4.5; c += 0.001) {
    mem.push(getCM(c).x);
  }
}

const drawCMGraph = function() {
  let settings = {
    minX: 0,
    maxX: mem.length - 1,
    minY: -14,
    maxY: 60,
    xC1: 300,
    xC2: cv.width - 10,
    yC1: 450,
    yC2: 300,
    deltaX: 1,
    axesOn: true,
    axesColor: 'white',
    graphColor: 'yellow',
    unitX: 1000,
    unitY: 10
  };
  graph(cv, cycle => mem[cycle], settings);
}