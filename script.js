const FPS = 30; // frames per second

const shipSize = 40; // ship's size in pixels
const shipSpeed = 350; // ship's speed in px/sec

const laserSpeed = 350; // speed of lasers in px/sec
const laserColors = {
	ship: "lightgreen",
	alien: "orange"
};

const alienSize = 25; // min size of alien in pixels;
const alienSpeed = 20; // alien speed in px/sec
const alienColors = ['purple', 'blue', 'yellow'];

const gameLives = 3; // number of lives before game over

var canvas = document.querySelector('#gameCanvas');
var ctx = canvas.getContext('2d');

// set up event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// gameplay controls
function keyDown(e) {
	if (ship.dead) {
		return
	}

    switch(e.keyCode) {
    	case 32: // spacebar (shoot laser)
    		shootLaser(ship, ship.lasers);
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
	if (ship.dead) {
		return
	}

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

function distBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// set up aliens
var aliens = [];
var alienLasers = [];
var grid = [];


var direction = {
	x: 1,
	y: 0
};

var numCols = 10;
var numRows = 5;

class Alien {
	constructor (type, xIndex, yIndex) {
		this.type = type;
		this.color = alienColors[type];
		this.x = alienSize + xIndex*45;
		this.y = alienSize + yIndex*40;
		this.r = (alienSize/2) + (type*2);
		this.row = yIndex;
		this.col = xIndex;

		this.currentY == this.y;

		this.laserMax = 2;
		this.canShoot = false;
	}
}

//draw the aliens
function drawAlien(item) {
	ctx.strokeStyle = "black";
	ctx.fillStyle = item.color;
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.arc(item.x, item.y, item.r, 0, Math.PI*2, false);
	ctx.stroke();
	ctx.fill();
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
function drawLaser(color, laser) {
	ctx.fillStyle = color;
	ctx.fillRect(laser.x-2, laser.y-shipSize, 4, ship.r);
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

			aliens.push(alien);
			grid[i][j] = alien;
		}
	}
}

function newShip() {
	return {
		x: canvas.width/2,
		y: canvas.height - canvas.height/10,
		r: shipSize/2,

		moveLeft: false,
		moveRight: false,

		lasers: [],
		laserMax: 2,
		canShoot: true,

		dead: false,
		win: false
	}
}

function checkAlienFlanks() {
	var alienFlank = {
		left: [],
		right: []
	};

	//check for left and right flanks
	for (var i=0; i<grid.length; i++) {
		var row = grid[i];

		if (row.length == 0) {
			continue
		}

		alienFlank.left.push(row[0]);
		alienFlank.right.push(row[row.length-1]);
	}

	return alienFlank;
}

function alienAdvance(alien) {
	alien.currentY = alien.y;
}

function alienShooting() {
	var shooter = Math.floor(Math.random() * aliens.length);
	let alien = aliens[shooter];

	if (!ship.win) {
		alien.canShoot = true;
		shootLaser(alien, alienLasers);
	}	
}

function shootLaser(shooter, laserArray) {
	if (shooter.canShoot && laserArray.length < shooter.laserMax) {
		laserArray.push({
			x: shooter.x,
			y: shooter.y,
			yv: laserSpeed / FPS,
		}) 
	}
	shooter.canShoot = false;
}

function destroyAlien(index) {
	let alien = aliens[index];

	let rowIndex = grid[alien.row].findIndex((a) => a === alien)

	grid[alien.row].splice(rowIndex, 1);
	aliens.splice(index, 1);
}

function laserHit(laserArray, index) {
	laserArray.splice(index, 1);
}

function newGame() {
	lives = gameLives;

	ship = newShip();
	newAlienFleet();
}

function destroyShip() {
	lives--;

	if (lives == 0) {
		gameOver()
	} else {
		ship = newShip();
	}
}

function playerWins() {
	ship.win = true;
}

function gameOver() {
	ship.dead = true;
}



newGame();

