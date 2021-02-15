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
	//move aliens
	aliens.forEach(drawAlien);

	var edge = false;

	for (var rowIndex=0; rowIndex<grid.length; rowIndex++) {
		var row = grid[rowIndex];

		var leftAlien = row[0];
		var rightAlien = row[row.length-1];

		if (leftAlien.x <= alienSize && direction.x == -1) {
			edge = true;
			direction.x = 1;
		} else if (rightAlien.x >= canvas.width-alienSize  && direction.x == 1) {
			edge = true;
			direction.x = -1;
		}
	}

	if (edge) {
		aliens.forEach(alienAdvance);
	}

	//random alien shooter
	// var shooter = Math.floor(Math.random() * aliens.length-1);
	// aliens.lasers = [];

	for (var i=0; i<aliens.length; i++) {
		let alien = aliens[i];

		if (alien.y < alien.currentY + 40) {
		direction.y = 1;
		} else {
			direction.y = 0;
		}

		alien.x += direction.x * alienSpeed / FPS;
		alien.y += direction.y * alienSpeed/2  / FPS;		
	}

	setTimeout(alienShooting, 1000 / FPS);

	// move alien laser
	for (var i=alienLasers.length-1; i>=0; i--) {

		//remove laser at bottom of screen
		if (alienLasers[i].y >= canvas.height) {
			alienLasers.splice(i, 1);
			continue;
		}

		drawLaser("alien", alienLasers, i); 
		alienLasers[i].y += alienLasers[i].yv;
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

		drawLaser(ship, ship.lasers, i); 
		ship.lasers[i].y -= ship.lasers[i].yv;
	}




}