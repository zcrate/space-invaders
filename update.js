function update() {
// draw the background
	// sky
	var skyGrad = ctx.createLinearGradient(0,0,0, canvas.height);
	skyGrad.addColorStop(0, "black");
	skyGrad.addColorStop(1, "darkblue");
	ctx.fillStyle = skyGrad;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// ground
	ctx.fillStyle = "green";
	ctx.fillRect(0, canvas.height - canvas.height/10, canvas.width, canvas.height);

// ship
	drawShip();

	// move the ship
	if (ship.moveLeft && ship.x > shipSize) {
		ship.x -= shipSpeed / FPS;
	} else if (ship.moveRight && ship.x < canvas.width-shipSize) {
		ship.x += shipSpeed / FPS;
	}

	// move ship laser
	for (var i=ship.lasers.length-1; i>=0; i--) {

		//remove laser at top of screen
		if (ship.lasers[i].y < 0) {
			ship.lasers.splice(i, 1); 
			continue;
		} 

	drawLaser(i); 
	ship.lasers[i].y += ship.lasers[i].yv;
	}
}