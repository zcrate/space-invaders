const FPS = 30; // frames per second

const shipSize = 40; // ship's size in pixels
const shipSpeed = 350; // ship's speed in px/sec

const laserSpeed = 400; // speed of lasers in px/sec
const laserMax = 3; // max number of lasers on screen

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

newGame();

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
}



