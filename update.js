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

//aliens
	aliens.forEach(drawAlien);

	//move the aliens

	for (var i=0; i<aliens.length; i++) {
		let alien = aliens[i];

		if (alien.flankLeft && alien.x <= shipSize) {
			aliens.forEach(alienAdvance);
			continue;
		} else if (alien.flankRight && alien.x >= canvas.width-shipSize) {
			aliens.forEach(alienAdvance);
			continue;
		}

		if (alien.moveLeft) {
			alien.x -= alienSpeed / FPS;
		} else if (alien.moveRight) {
			alien.x += alienSpeed / FPS;
		}
	}

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