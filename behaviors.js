// # behaviors

// basic stuff
const WillMove = (self) => ({
	move: () => {
		self.velocity.add(self.acceleration);
		if (self.maxVelocity > 0) {
			self.velocity.limit(self.maxVelocity);
		}
		self.location.add(self.velocity);
		self.acceleration.mult(0);
	}
});

const WillReact = (self) => ({
	reactTo: (force) => {
		self.acceleration.add(force);
	}
});

const WillBounceOnEdges = (self, xLimit, yLimit) => ({
	bounce: () => {
		let loss = 0.8;
		if (self.location.x < 0) {
			self.velocity.x = -self.velocity.x*loss;
			self.location.x = 0;
			return true;
		}
		if (self.location.x > xLimit) {
			self.velocity.x = -self.velocity.x*loss;
			self.location.x = xLimit;
			return true;
		}
		if (self.location.y < 0) {
			self.velocity.y = -self.velocity.y*loss;
			self.location.y = 0;
			return true;
		}
		if (self.location.y > yLimit) {
			self.velocity.y = -self.velocity.y*loss;
			self.location.y = yLimit;
			return true;
		}
		return false;
	}
});

const WillGoAroundEdges = (self, xLimit, yLimit) => ({
	bounce: () => {
		if (self.location.x < 0) {
			self.location.x = xLimit;
			return true;
		}
		if (self.location.x > xLimit) {
			self.location.x = 0;
			return true;
		}
		if (self.location.y < 0) {
			self.location.y = yLimit;
			return true;
		}  
		if (self.location.y > yLimit) {
			self.location.y = 0;
			return true;
		}	
		return false;
	}
});

// pulser stuff
const WillHavePulsersAttached = (self, pulsersQty) => ({
	pulse: () => {
		if (self.pulsers == null || self.pulsers.length == 0) {
			self.pulsers = [];
			for (let i = 0; i < pulsersQty; i++) {
				self.pulsers.push(Pulser(self.size*3, self, 200, 10, 0.00008, i))
			}
		}
		for (let i = 0; i < self.pulsers.length; i++) {
			self.pulsers[i].grow();
			self.pulsers[i].show();
		}
	}
});

const WillPulse = (self) => ({
	grow: () => {
		let pR = self.radius - (self.anchor.size*self.index);
		if (pR < 0) r = 0;
		if (pR < self.maxRadius) { // while the last pulse is still running, keep growing
			self.radius += 1 + self.anchor.velocity.mag(); // keep growing based on anchor's velocity
		} else {
			self.radius = self.anchor.size/2; // starts again
		}
	},
	show: () => {
		push();
		translate(self.anchor.location.x, self.anchor.location.y);
		beginShape();
		for (let a = 0; a < (TWO_PI); a += TWO_PI/self.vertex) {
			let n = noise(cos(a) + 1, sin(a) + 1 , self.offSet);
			let o = map(n, 0, 1, -self.radius/self.noiseRange, self.radius/self.noiseRange);
			let r = self.radius - (self.anchor.size*self.index) + o;
			if (r < 0) r = 0;
			vertex(r*cos(a),r*sin(a));
			self.offSet += self.offSetProgression;
		}
		endShape(CLOSE);
		pop();		
	}
})

// shape stuff
const Ellipse = (self) => ({
	show: () => {
		push();
		noStroke();
		fill("#FFD788"); // temp
		ellipseMode(CENTER);
		ellipse(self.location.x, self.location.y, self.size, self.size)
		pop();
	}
});

const Rectangle = (self) => ({
	show: () => {
		push();
		noStroke();
		rectMode(CENTER);
		rect(self.location.x, self.location.y, self.size, self.size)
		pop();
	}
});

// behaviors sets
const Particle = (self) => 	Object.assign({},WillMove(self),WillReact(self));