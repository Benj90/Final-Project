let socketdata = [];
var socket;

const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let wave = [];
let path = [];
let drawing = [];
let state = -1;





function mousePressed() {
  state = USER;
  drawing = [];
  x = [];
  time = 0;
  path = [];
}

function mouseReleased() {
  state = FOURIER;
  const skip = 1;
  for (let i = 0; i < drawing.length; i+= skip) {
   x.push(new Complex(drawing[i].x, drawing[i].y));
 
}

  fourierX = dft(x);

  fourierX.sort((a, b) => b.amp - a.amp);
}

function setup() {
  createCanvas(800,600);

 socket = io.connect('http://localhost:3000');
 socket.on('mouse', 
  function (data){
  socketdata.push(data);

  });

}


//function newDrawing(data) {
 



function epicycles(x, y, rotation, fourier) {

for (let i = 0; i < fourier.length; i++) {
  let prevx = x;
  let prevy = y;


  let freq = fourier[i].freq;

  let radius = fourier[i].amp;

  let phase = fourier[i].phase;


   x  += radius * cos(freq * time + phase + rotation);
   y  += radius * sin(freq * time + phase + rotation);


  stroke(255,100);
  noFill(); 
  ellipse(prevx, prevy, radius * 2);
  stroke(255);
  line(prevx, prevy, x, y);

  }

  return createVector(x,y);

}


function draw() {
  background(0);

 if (!socketdata == []) {
   fill(255,0,0,10);
  noStroke();
  for (var i = 0; i < socketdata.length; i++) {
    ellipse(socketdata[i].x, socketdata[i].y, 10,10);
  }
 }
 




if (state == USER) {
  let point = createVector(mouseX - width / 2, mouseY - height / 2);
  drawing.push(point);
  stroke(255);
  noFill();
  beginShape();
  for(let v of drawing) {
    vertex(v.x + width / 2, v.y + height / 2);
     //console.log('sending ' + mouseX + ',' + mouseY);

     var data = {
      x:  mouseX,
      y:  mouseY
     }
     socket.emit('mouse',data);
  }
endShape();

} else if (state == FOURIER) {

 
 let v = epicycles(width/2, height/2, 0, fourierX);

 path.unshift(v); 

beginShape();
noFill();

  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }

endShape();



  //fill(0, 0, 0, 5);
    
      //rect(-400,-400, width/2, height/2);

      //fill(100,0,0,10);

      //rect(-400,-400,width/2,height/2);

      //fill(0,0,0,5);

      //rect(-400,-400,width/2,height/2);


  const dt = TWO_PI / fourierX.length;
  time += dt;

  if (time > TWO_PI) {
    time = 0;
    path = [];
  }
}

 // if (wave.length> 250) {
    //wave.pop();
//}

}  