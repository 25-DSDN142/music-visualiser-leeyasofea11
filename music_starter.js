function draw_one_frame(words, vocal, drum, bass, other, counter) {
  // Background with slight transparency for trail effect
  background(10, 0, 20, 50);

  rectMode(CENTER);
  noFill();

  let slope = -0.3;
  let spacing = 20;
  let rows = ceil((height + Math.abs(slope) * width * 2) / spacing) + 1;
  let startOffset = -Math.abs(slope) * width;
  let gapCenterY = height / 2;

  // --- Hue rotation based on "other" ---
  let hueOffset = map(other, 0, 100, 0, 360);

  for (let i = 0; i < rows; i++) {
    let yLine = startOffset + i * spacing;

    // Line brightness & thickness
    let lineBrightness = map(vocal, 0, 100, 90, 100);
    let dynamicThickness = map(bass, 0, 100, 1, 8);

    // Drum-based warp / distortion
    let drumWarp = map(drum, 0, 100, -10, 10);

    // Wave speed responds to bass
    let waveSpeed = map(bass, 0, 100, 0.02, 0.2);
    let glowAlpha = map(bass, 0, 100, 50, 255);

    // Main line
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = yLine + x * slope;
      let wave = sin((x * waveSpeed) + counter * 0.05 + i * 0.3) * 20;
      let noiseOffset = noise(x * 0.01, i * 0.1, counter * 0.01) * 30;
      let audioEffect = map(bass, 0, 100, -15, 15);
      // Add drum-based horizontal distortion
      let xWarped = x + sin(i + counter * 0.1) * drumWarp;
      vertex(xWarped, y + wave + noiseOffset + audioEffect);
    }
    stroke((i * 5 + counter + hueOffset) % 360, 100, lineBrightness);
    strokeWeight(dynamicThickness);
    endShape();

    // Glow
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = yLine + x * slope;
      let wave = sin((x * waveSpeed) + counter * 0.05 + i * 0.3) * 20;
      let noiseOffset = noise(x * 0.01, i * 0.1, counter * 0.01) * 30;
      let audioEffect = map(bass, 0, 100, -15, 15);
      let xWarped = x + sin(i + counter * 0.1) * drumWarp;
      vertex(xWarped, y + wave + noiseOffset + audioEffect);
    }
    stroke((i * 5 + counter + hueOffset) % 360, 100, lineBrightness, glowAlpha);
    strokeWeight(dynamicThickness + 6);
    endShape();
  }

  // Metallic sphere with hue rotation
  noStroke();
  let sphereSize = map(vocal, 0, 100, 50, 200);
  for (let j = 0; j < 5; j++) {
    let shine = map(j, 0, 4, 0.2, 0.8);
    fill((200 + hueOffset) % 360, 10, map(vocal, 0, 100, 70, 100) * shine);
    ellipse(width / 2, height / 2 - j * 5, sphereSize - j * 15);
  }

  // Neon lyrics with hue rotation
  let textSizeValue = map(vocal, 0, 100, 12, 48);
  textAlign(CENTER, CENTER);
  let glowIntensity = map(vocal, 0, 100, 50, 255) + random(-30, 30);
  stroke((180 + hueOffset) % 360, 100, constrain(glowIntensity, 50, 255), 80);
  strokeWeight(6);
  fill((180 + hueOffset) % 360, 100, constrain(glowIntensity, 50, 255));
  textSize(textSizeValue);
  text(words, width / 2, gapCenterY);

  noStroke();
  fill(255);
  text(words, width / 2, gapCenterY);
}
