import getVision from "./getVision.js";
import getEmitter from "./libs/getEmitter.js";

let { video, handLandmarker } = await getVision();
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.height = window.innerWidth * 0.75;

let mousePos = {
  x: window.innerWidth,
  y: window.innerHeight,
};
let emitter = getEmitter();

function animationLoop() {
  // Clears canvas every frame
  ctx.clearRect(0, 0, canvas.width, canvas.height); // x,y,w,h
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    // Detects hands in the webcam video
    let handResults = handLandmarker.detectForVideo(video, Date.now());
    // Each hand has 21 landmarks
    if (handResults.landmarks) {
      for (let landmarks of handResults.landmarks) {
        landmarks.forEach((l, i) => {
          // Index fingertip tracking
          if (i === 8) {
            mousePos = {
              x: l.x * canvas.width,
              y: l.y * canvas.height,
            };
          }
        });
      }
    }
  }
  // Emits particles at fingertip position
  emitter.update(ctx, mousePos);
  requestAnimationFrame(animationLoop);
}

animationLoop();
