const FPS = 30; // frames per second

const shipSize = 40; // ship's size in pixels
const shipSpeed = 350; // ship's speed in px/sec

const laserSpeed = 400; // speed of lasers in px/sec
const laserMax = 3; // max number of lasers on screen

const alienSize = 25; // min size of alien in pixels;
const alienSpeed = 25; // alien speed in px/sec
const alienColors = ['purple', 'blue', 'yellow'];

var canvas = document.querySelector('#gameCanvas');
var ctx = canvas.getContext('2d');


// set up event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// gameplay controls
function keyDown(e) {
    switch(e.keyCode) {
    	case 32: // spacebar (shoot laser)
    		shootLaser();
    		break;
        case 37: // left arrow (move left)
        	ship.moveLeft = true;
            break;
        case 38: // up arrow
            break;
        case 39: // right arrow (move right)
        	ship.moveRight = true;
            break;
        case 40: // down arrow
        	break;
    }
}

function keyUp(e) {
    switch(e.keyCode) {
    	case 32: 
    		ship.canShoot = true; // spacebar
    		break;
        case 37: 
        	ship.moveLeft = false; // left arrow (move left)
            break;
        case 38: // up arrow
            break;
        case 39: 
        	ship.moveRight = false; // right arrow (move right)
            break;
        case 40: // down arrow
        	break;
    }
}

// set up the game loop
setInterval(update, 1000 / FPS);

// set up aliens
var aliens = [];
var grid = [];

var direction = {
	x: 1,
	y: 0
};

var numCols = 11;

var numRows = 5;

class Alien {
	constructor (type, xIndex, yIndex) {
		this.type = type;
		this.color = alienColors[type];
		this.x = alienSize + xIndex*45;
		this.y = alienSize + yIndex*40;
		this.r = (alienSize/2) + (type*2);
	}
}

function drawAlien(item) {
	ctx.strokeStyle = "black";
	ctx.fillStyle = item.color;
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.arc(item.x, item.y, item.r, 0, Math.PI*2, false);
	ctx.stroke();
	ctx.fill();
}

function newAlienFleet() {
	aliens = [];
	grid = [];

	for (var i=0; i<numRows; i++) {
		grid[i] = [];

		for (var j=0; j<numCols; j++) {
			var alien;

			if (i==0) {
				alien = new Alien(0, j, i);
			} else if (i==1 || i==2) {
				alien = new Alien(1, j, i);
			} else {
				alien = new Alien(2, j, i);
			}

			aliens.push(alien)
			grid[i].push(alien)
		}
	}
}

function alienAdvance(alien) {
	alien.y += 40;
}


// draw the ship
function drawShip(x, y) {
	ctx.strokeStyle = "black";
	ctx.fillStyle = "limegreen";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI, true);
	ctx.stroke();
	ctx.fill();
}

//draw the lasers
function drawLaser(index) {
	ctx.fillStyle = "lightblue";
	ctx.fillRect(ship.lasers[index].x-2, ship.lasers[index].y-shipSize, 4, ship.r);
}

function newShip() {
	return {
		x: canvas.width/2,
		y: canvas.height - canvas.height/10,
		r: shipSize/2,

		moveLeft: false,
		moveRight: false,

		lasers: [],
		canShoot: true
	}
}

function shootLaser() {
	if (ship.canShoot && ship.lasers.length < laserMax) {
		ship.lasers.push({
			x: ship.x,
			y: ship.y,
			yv: -laserSpeed / FPS,
		})
	}
	ship.canShoot = false; 
}

function newGame() {
	ship = newShip();
	newAlienFleet();
}



newGame();

console.log(aliens);
