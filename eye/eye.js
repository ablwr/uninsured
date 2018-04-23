var c, eye, finger, fingerImg, current, previous;

var clr = 225;
var worries = [];
var thoughts = ["Is my eye twitching?", "Does my eye look red?", "Is my eye more pink than usual?", "Do I look normal?", "What does a normal eye look like?"];
var painting = false;
var next = 0;

function preload() {
  fingerImg = loadImage('img/pointing-finger.png');
}

function setup() {
  c = color('rgb(255,245,245)');
  createCanvas(windowWidth, windowHeight);
  noStroke();
  eye = new Eye(windowWidth/2, windowHeight/2, 220);
  finger = new Finger();
  current = createVector(0,0);
  previous = createVector(0,0);
}

function draw() {
  background(200,220,255);
  noStroke();
  eye.update(mouseX, mouseY);
  eye.display(c);
  finger.display();
  
  if (millis() > next && painting) {     
    current.x = mouseX;
    current.y = mouseY;
    var force = p5.Vector.sub(current, previous);
    force.mult(0.05);
    worries[worries.length - 1].add(current, force);
    next = millis() + random(1000);
    previous.x = current.x;
    previous.y = current.y;
  }
  for( var i = 0; i < worries.length; i++) {
    worries[i].update();
    worries[i].display();
  }
}


function getWorse () {
  if ( mouseX >= windowWidth/2 - 135 && mouseX <= windowWidth/2 + 135 &&
    mouseY >= windowHeight/2 - 115 && mouseY <= windowHeight/2 + 115) {
    clr = (clr <= 10 ? 0 : clr-10);
    c = color('rgb(219,'+clr+','+clr+')');
    redraw();
  } else {
    next = 0;
    painting = true;
    previous.x = mouseX;
    previous.y = mouseY;
    worries.push(new Worry());
  }
};
    

function Worry() {
  this.bubbles = [];
  this.hue = random(100);
}

Worry.prototype.add = function(position, force) {
  this.bubbles.push(new Particle(position, force, this.hue, this.thought));
}


Worry.prototype.update = function() {  
  for (var i = 0; i < this.bubbles.length; i++) {
    this.bubbles[i].update();
  }
}  


Worry.prototype.display = function() {
  for (var i = this.bubbles.length - 1; i >= 0; i--) {
    if (this.bubbles[i].lifespan <= 0) {
      this.bubbles.splice(i, 1);
    } else {
      this.bubbles[i].display(this.bubbles[i+1]);
    }
  }
}  


function Particle(position, force, hue, thought) {
  this.position = createVector(position.x, position.y);
  this.velocity = createVector(force.x, force.y);
  this.drag = 0.95;
  this.lifespan = 255;
  this.thought = random(thoughts);
}


Particle.prototype.update = function() {
  this.position.add(this.velocity);
  this.velocity.mult(this.drag);
  this.lifespan--;
}

Particle.prototype.display = function() {
  noStroke();
  fill(250,0,0, this.lifespan/2);   
  textSize(24);
  textStyle(ITALIC);
  text(this.thought, this.position.x,this.position.y); 
}

function Finger () {
  this.display = function () {
    push();
    image(fingerImg, mouseX, mouseY, 200, 120);
    rotate(180);
    pop();
  }
}

function mousePressed () {
  getWorse();
}

function mouseReleased() {
  painting = false;
}


 
function Eye (tx, ty, ts) {
  this.x = tx;
  this.y = ty;
  this.size = ts;
  this.angle = 0;

  this.update = function (mx, my) {
    this.angle = atan2(my - this.y, mx - this.x);
  };

  this.display = function (eyeColor) {
    push();
    translate(this.x, this.y);
    fill(0);
    arc(0, 0, this.size + 65, this.size + 10, HALF_PI + HALF_PI, 0, PIE);
    fill(eyeColor);
    ellipse(0, 0, this.size + 45, this.size - 15);
    fill(70, 115, 160);
    ellipse(0, 0, this.size / 1.25 + this.angle, this.size / 1.25);
    rotate(this.angle);
    fill(0,0,0);
    ellipse(20, 0, this.size / 3, this.size / 3);
    pop();
  };  
}


