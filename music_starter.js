// Global variables
let currentFlash = 0;
let textHue = 180; // starting hue for text
let particles = [];
let numParticles = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  textFont('Consolas, "Lucida Console", monospace'); // CSS-safe font
  rectMode(CENTER);
  noFill();

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      hue: random(0, 360),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
  rectMode(CENTER);
  noFill();

  // --- Check if we are in the louder section ---
  let inLoudSection = counter >= 300 && counter <= 500;

  // --- Detect beat peak for flash ---
  if (inLoudSection) {
    let beatStrength = bass + drum;
    if (beatStrength > 150) { // strong beat threshold
      currentFlash = map(beatStrength, 150, 200, 50, 200);
      textHue = random(0, 360); // change text color on beat
    }
  }

  // --- Fade flash smoothly ---
  currentFlash *= 0.85;

  // --- Background ---
  let bgAlpha = 50 + currentFlash;
  background(10, 0, 20, bgAlpha);

  // --- Lines ---
  drawLines(vocal, drum, bass, other, counter, inLoudSection, currentFlash);

  // --- Sphere ---
  drawSphere(vocal, other, counter, inLoudSection, currentFlash);

  // --- Pulsating Rings around Sphere ---
  drawRings(vocal, counter);

  // --- Particles ---
  drawParticles(bass, drum);

  // --- Psychedelic Lyrics ---
  drawLyrics(words, vocal, other, counter, inLoudSection, currentFlash, textHue);
}

// ---------- Helper Functions ----------

function drawLines(vocal, drum, bass, other, counter, react=false, flash=0) {
  let slope = -0.3;
  let spacing = 20;
  let rows = ceil((height + Math.abs(slope) * width * 2) / spacing) + 1;
  let startOffset = -Math.abs(slope) * width;
  let hueOffset = map(other, 0, 100, 0, 360);

  for (let i = 0; i < rows; i++) {
    let yLine = startOffset + i * spacing;
    let lineBrightness = map(vocal, 0, 100, 90, 100) + flash;
    let dynamicThickness = map(bass, 0, 100, 1, 8);
    let drumWarp = map(drum, 0, 100, -10, 10);
    let waveSpeed = map(bass, 0, 100, 0.02, 0.2);

    if (react) {
      dynamicThickness *= map(bass, 0, 100, 1, 2.5);
      drumWarp *= map(drum, 0, 100, 1, 2);
    }

    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = yLine + x * slope;
      let wave = sin((x * waveSpeed) + counter * 0.05 + i * 0.3) * 20;
      let noiseOffset = noise(x * 0.01, i * 0.1, counter * 0.01) * 30;
      let audioEffect = map(bass, 0, 100, -15, 15);
      let xWarped = x + sin(i + counter * 0.1) * drumWarp;
      vertex(xWarped, y + wave + noiseOffset + audioEffect);
    }
    stroke((i * 5 + counter + hueOffset) % 360, 100, lineBrightness);
    strokeWeight(dynamicThickness);
    endShape();
  }
}

function drawSphere(vocal, other, counter, react=false, flash=0) {
  noStroke();
  let sphereSize = map(vocal, 0, 100, 50, 200);

  if (react) {
    sphereSize *= map(vocal, 0, 100, 1, 2.5);
    sphereSize += flash * 0.5;
  }

  for (let j = 0; j < 5; j++) {
    let shine = map(j, 0, 4, 0.2, 0.8);
    fill((200 + map(other, 0, 100, 0, 360)) % 360, 10, map(vocal, 0, 100, 70, 100) * shine + flash * 0.5);
    ellipse(width / 2, height / 2 - j * 5, sphereSize - j * 15);
  }
}

// Pulsating rings around the center sphere
function drawRings(vocal, counter) {
  noFill();
  let numRings = 3;
  for (let i = 1; i <= numRings; i++) {
    let ringSize = map(vocal, 0, 100, 50, 200) + i * 40 + sin(counter * 0.05 + i) * 20;
    stroke((i * 60 + counter) % 360, 80, 100, 50);
    strokeWeight(2 + i);
    ellipse(width / 2, height / 2, ringSize, ringSize);
  }
}

// Particles floating around with glowing, color-changing effect
function drawParticles(bass, drum) {
  for (let p of particles) {
    p.x += p.speedX + map(bass, 0, 100, -0.5, 0.5);
    p.y += p.speedY + map(drum, 0, 100, -0.5, 0.5);

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    let size = p.size + map(bass + drum, 0, 200, 0, 6);
    let alpha = map(bass + drum, 0, 200, 50, 100);
    p.hue += random(-1, 1);

    stroke(p.hue % 360, 80, 100, alpha);
    strokeWeight(size);
    point(p.x, p.y);
  }
}

function drawLyrics(words, vocal, other, counter, react=false, flash=0, hue=180) {
  let textSizeValue = map(vocal, 0, 100, 12, 48);
  textAlign(CENTER, CENTER);
  let glowIntensity = map(vocal, 0, 100, 50, 255) + random(-30, 30);

  if (react) {
    glowIntensity *= map(vocal, 0, 100, 1, 2.5);
    textSizeValue *= map(vocal, 0, 100, 1, 1.8);
  }

  glowIntensity += flash;

  stroke((hue + counter) % 360, 100, constrain(glowIntensity, 50, 255), 80);
  strokeWeight(6);
  fill((hue + counter) % 360, 100, constrain(glowIntensity, 50, 255));
  textSize(textSizeValue);

  let displayWord = (counter < 100) ? "Eventually" : words;
  text(displayWord, width / 2, height / 2);

  noStroke();
  fill(255);
  text(displayWord, width / 2, height / 2);
}
