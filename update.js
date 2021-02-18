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

	alienFlank = checkAlienFlanks();

	//check proximity to edge
	for (var i=0; i<alienFlank.left.length; i++) {
		if (alienFlank.left[i].x <= alienSize && direction.x == -1) {
			edge = true;
			direction.x = 1;
		}
	}

	for (var i=0; i<alienFlank.right.length; i++) {
		if (alienFlank.right[i].x >= canvas.width-alienSize && direction.x == 1){
			edge = true;
			direction.x = -1;
		}
	}


	// for (var rowIndex=0; rowIndex<grid.length; rowIndex++) {
	// 	var row = grid[rowIndex];

	// 	var leftAlien = row[0];
	// 	alienFlank.left.push(row[0]);

	// 	var rightAlien = row[row.length-1];
	// 	alienFlank.right.push(row[row.length-1]);


	// 	if (leftAlien.x <= alienSize && direction.x == -1) {
	// 		edge = true;
	// 		direction.x = 1;
	// 	} else if (rightAlien.x >= canvas.width-alienSize && direction.x == 1) {
	// 		edge = true;
	// 		direction.x = -1;
	// 	}
	// }

	if (edge) {
		aliens.forEach(alienAdvance);
	}

	for (var i=0; i<aliens.length; i++) {
		let alien = aliens[i];

		if (alien.y < alien.currentY + 40) {
			direction.y = 1;
		} else {
			direction.y = 0;
		}

		alien.x += direction.x * alienSpeed / FPS;
		alien.y += direction.y * alienSpeed/2  / FPS;

		//check alien landing on ground
		if (alien.y >= ship.y
			&& !ship.dead) {
			gameOver();
			break;
		}

	}

	setTimeout(alienShooting, 1000 / FPS);

	// move alien laser
	if (!ship.win) {
		for (var i=alienLasers.length-1; i>=0; i--) {

			//remove laser at bottom of screen
			if (alienLasers[i].y > canvas.height+shipSize) {
				alienLasers.splice(i, 1);
				continue;
			}

			drawLaser("lightblue", alienLasers[i]); 
			alienLasers[i].y += alienLasers[i].yv;

			// detect alien laser hit on ship
			alx = alienLasers[i].x;
			aly = alienLasers[i].y;

			if (distBetweenPoints(ship.x, ship.y, alx, aly) < ship.r
				&& !ship.dead) {
				destroyShip();
				laserHit(alienLasers, i);
				break;
			}
		}
	}
	

// ship
	if (!ship.dead) {
		drawShip();

		// move the ship
		if (ship.moveLeft && ship.x > shipSize) {
			ship.x -= shipSpeed / FPS;
		} else if (ship.moveRight && ship.x < canvas.width-shipSize) {
			ship.x += shipSpeed / FPS;
		}
	}

	// move ship laser
	for (var i=ship.lasers.length-1; i>=0; i--) {

		//remove laser at top of screen
		if (ship.lasers[i].y < 0) {
			ship.lasers.splice(i, 1); 
			continue;
		} 

		drawLaser("lightgreen", ship.lasers[i]); 
		ship.lasers[i].y -= ship.lasers[i].yv;
	}

	// detect laser hit on aliens
	var ax, ay, ar, lx, ly;
	for (var i=0; i<aliens.length; i++) {

		ax = aliens[i].x;
		ay = aliens[i].y;
		ar = aliens[i].r;

		//loop over the lasers
		for (var j=ship.lasers.length-1; j>=0; j--) {

			lx = ship.lasers[j].x;
			ly = ship.lasers[j].y;

			//detect hits
			if (distBetweenPoints(ax, ay, lx, ly) < ar) {

				//destroy the alien and activate laser explosion
				destroyAlien(i);
				laserHit(ship.lasers, j)
				break;
			}
		}
	}

	if (ship.dead) {
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "85px impact";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		ctx.strokeText("Aw, Ship! You dead!", canvas.width/2, canvas.height/2)
		ctx.fillStyle = "white";
		ctx.fillText("Aw, Ship! You dead!", canvas.width/2, canvas.height/2)
	}

	if (aliens.length == 0) {
		playerWins();

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "85px impact";
		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		ctx.strokeText("You Win!", canvas.width/2, canvas.height/2)
		ctx.fillStyle = "white";
		ctx.fillText("You Win!", canvas.width/2, canvas.height/2)
	}

	// display lives count
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "white";
	ctx.font = "30px impact";
	ctx.fillText("Lives: " + lives, ship.r, canvas.height-ship.r);
}