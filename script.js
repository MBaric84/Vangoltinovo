const valentineWord = document.getElementById("valentineWord");
const loveSong = document.getElementById("loveSong");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttonArea = document.getElementById("buttonArea");
const noBubble = document.getElementById("noBubble");
const celebration = document.getElementById("celebration");
const celebrationVideo = document.getElementById("celebrationVideo");

let yesScale = 1;
let audioUnlocked = false;
let noMoveCount = 0;
let celebrationTimer = null;

const bumpYes = () => {
  yesScale = Math.min(yesScale + 0.08, 1.7);
  yesBtn.style.transform = `scale(${yesScale})`;
};

const moveNoButton = () => {
  const areaRect = buttonArea.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const padding = 8;

  const maxX = Math.max(areaRect.width - noRect.width - padding * 2, 0);
  const maxY = Math.max(areaRect.height - noRect.height - padding * 2, 0);

  const randomX = Math.floor(Math.random() * (maxX + 1)) + padding;
  const randomY = Math.floor(Math.random() * (maxY + 1)) + padding;

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  noMoveCount += 1;
  if (noMoveCount === 3) {
    noBubble.classList.add("show");
  }
};

const placeNoButton = () => {
  const areaRect = buttonArea.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const x = Math.max(areaRect.width - noRect.width - 20, 20);
  const y = 25;
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
};

const playSong = () => {
  if (!audioUnlocked) return;
  loveSong.play().catch(() => {
    // Autoplay can be blocked until a user gesture occurs.
  });
};

const pauseSong = () => {
  loveSong.pause();
};

valentineWord.addEventListener("mouseenter", playSong);
valentineWord.addEventListener("mouseleave", pauseSong);
valentineWord.addEventListener("click", () => {
  if (!audioUnlocked) return;
  if (loveSong.paused) {
    loveSong.play();
  } else {
    loveSong.pause();
  }
});

document.addEventListener(
  "click",
  () => {
    if (audioUnlocked) return;
    loveSong.play()
      .then(() => {
        loveSong.pause();
        loveSong.currentTime = 0;
        audioUnlocked = true;
      })
      .catch(() => {
        // Audio will remain locked if the browser still blocks it.
      });
  },
  { once: true }
);

noBtn.addEventListener("mouseenter", () => {
  moveNoButton();
  bumpYes();
});

noBtn.addEventListener("mousedown", (event) => {
  event.preventDefault();
  moveNoButton();
  bumpYes();
});

window.addEventListener("resize", placeNoButton);

requestAnimationFrame(placeNoButton);

const showCelebration = () => {
  celebration.classList.add("show");
  if (celebrationVideo) {
    celebrationVideo.currentTime = 0;
    celebrationVideo.play().catch(() => {
      // Video autoplay can be blocked until a user gesture occurs.
    });
  }
  if (celebrationTimer) {
    clearTimeout(celebrationTimer);
  }
  celebrationTimer = setTimeout(() => {
    celebration.classList.remove("show");
    if (celebrationVideo) {
      celebrationVideo.pause();
    }
  }, 8000);
};

celebration.addEventListener("click", () => {
  celebration.classList.remove("show");
  if (celebrationVideo) {
    celebrationVideo.pause();
  }
});

yesBtn.addEventListener("click", showCelebration);
