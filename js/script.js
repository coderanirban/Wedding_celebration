// small interactions: current year + simple reveal on scroll
document.addEventListener('DOMContentLoaded', function(){
  // year in footer
  const y = new Date().getFullYear();
  document.getElementById('year').textContent = y;

  // simple fade-in when scrolled into view
  const items = document.querySelectorAll('.card, .person-card, .event-card');
  items.forEach(i => {
    i.style.opacity = 0;
    i.style.transform = 'translateY(8px)';
    i.style.transition = 'opacity 600ms ease, transform 600ms ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity = 1;
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.16});

  items.forEach(i => io.observe(i));
});




// 🌼 Gallery Carousel reset on hover
const carousel = document.querySelector(".carousel");
if (carousel) {
  carousel.addEventListener("mouseenter", () => {
    carousel.style.animationPlayState = "paused";
  });
  carousel.addEventListener("mouseleave", () => {
    carousel.style.animationPlayState = "running";
  });
}

// 🌟 Optional: Sparkle effect for gallery border
setInterval(() => {
  const sparkle = document.createElement("div");
  sparkle.className = "border-spark";
  sparkle.style.left = Math.random() * 100 + "%";
  sparkle.style.top = Math.random() * 100 + "%";
  document.querySelector(".gallery-preview").appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 2000);
}, 1200);


// Detect mobile device and add "touch-active" class for image animation
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".person-card img");

    cards.forEach(img => {
      img.addEventListener("touchstart", () => {
        img.classList.add("touch-active");
        setTimeout(() => img.classList.remove("touch-active"), 800);
      });
    });
  });




// 🌸 Interactive Gallery Carousel + Lightbox
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".gallery-carousel");
  const items = document.querySelectorAll(".gallery-item");
  const next = document.querySelector(".nav-btn.next");
  const prev = document.querySelector(".nav-btn.prev");

  let index = 0;
  const total = items.length;
  const visible = window.innerWidth < 768 ? 1 : 3;

  function updateCarousel() {
    const moveX = -(index * (100 / visible));
    carousel.style.transform = `translateX(${moveX}%)`;
  }

  next.addEventListener("click", () => {
    if (index < total - visible) index++;
    else index = 0;
    updateCarousel();
  });

  prev.addEventListener("click", () => {
    if (index > 0) index--;
    else index = total - visible;
    updateCarousel();
  });

  // Touch Swipe
  let startX = 0;
  carousel.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  carousel.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prev.click();
    else if (startX - endX > 50) next.click();
  });

  // Lightbox Setup
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const close = document.querySelector(".close");

  items.forEach(item => {
    item.addEventListener("click", () => {
      lightbox.style.display = "block";
      const img = item.querySelector("img");
      lightboxImg.src = img.src;
      caption.textContent = img.alt;
    });
  });

  close.addEventListener("click", () => (lightbox.style.display = "none"));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.style.display = "none";
  });

  // Button click: open first image in full view
  const galleryBtn = document.querySelector(".gallery-btn");
  if (galleryBtn) {
    galleryBtn.addEventListener("click", () => {
      lightbox.style.display = "block";
      lightboxImg.src = items[0].querySelector("img").src;
      caption.textContent = items[0].querySelector("img").alt;
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const subtitle = document.querySelector('.overlay-text');
  const video = document.getElementById('mandapVideo');
  let count = 0;
  const maxAppearances = 2;

  function showSubtitle() {
    if (count >= maxAppearances) return;
    count++;

    subtitle.style.animation = "none"; // reset
    void subtitle.offsetWidth; // reflow
    subtitle.style.animation = "subtitleAppear 10s ease-in-out";
  }

  video.addEventListener('play', () => {
    showSubtitle(); // first time immediately
    const interval = setInterval(() => {
      showSubtitle();
      if (count >= maxAppearances) clearInterval(interval);
    }, 10000); // every 10s, show again only twice
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const videoSection = document.querySelector(".mandap-video");
  const music = new Audio("assets/music/mandap-theme.mp3"); // update filename if different
  music.loop = true;
  music.volume = 0.2; // low volume

  // IntersectionObserver for scroll detection
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section in view — play
          music.play().catch(() => {
            // Autoplay policy fix: play on user interaction
            document.body.addEventListener(
              "click",
              () => music.play(),
              { once: true }
            );
          });
        } else {
          // Section out of view — pause
          music.pause();
        }
      }); 
    },
    { threshold: 0.6 } // 60% visible required to trigger
  );

  observer.observe(videoSection);
});

 

















// 🎧 Single Audio Player (With Dual Last Audio + Working Toggle)

const inviteSection = document.querySelector("#voiceInvite");
const voiceToggle = document.querySelector("#voiceToggle");

const audioFiles = [
  "assets/music/narration/01-groom-intro.mp3",
  "assets/music/narration/02-bride-intro.mp3",
  "assets/music/narration/03-groom-blessing.mp3",
  "assets/music/narration/04-bride-dream.mp3",
  "assets/music/narration/05-groom-invite.mp3",
  "assets/music/narration/06-bride-invite.mp3",
  "assets/music/narration/07-groom-love.mp3",
  "assets/music/narration/08-bride-love.mp3",
  "assets/music/narration/09-groom-final.mp3",
  "assets/music/narration/10-bride-final.mp3",
  "assets/music/narration/11-groom-together.mp3", // 11
  "assets/music/narration/12-bride-together.mp3"   // 12
];

// ⭐ Main audio
const audio = new Audio();
audio.volume = 0.7;

// ⭐ Second audio ONLY for last pair
const audio2 = new Audio();
audio2.volume = 0.7;

let currentIndex = 0;
let isPlaying = false;
let manuallyPaused = false;

// 🎶 Play next voice
function playNext() {

  // 🌟 SPECIAL CASE → Last two both together
  if (currentIndex === 10) {
    audio.src = audioFiles[10];
    audio2.src = audioFiles[11];

    audio.play();
    audio2.play();

    isPlaying = true;

    // No more next audios
    currentIndex = audioFiles.length;
    return;
  }

  // 🌟 Normal play
  if (currentIndex < audioFiles.length) {
    audio.src = audioFiles[currentIndex];
    audio.play().then(() => {
      isPlaying = true;
    });
  }
}

// 🎧 When one audio ends → go next
audio.addEventListener("ended", () => {
  if (currentIndex < 10) {
    currentIndex++;
    playNext();
  }
});

// 🔊 Mute / Unmute button
// 🔊 New Working Mute / Unmute Toggle (With Resume)
voiceToggle.addEventListener("click", () => {

  // FIRST CLICK → START PLAYING FROM START
  if (!isPlaying && currentIndex === 0 && audio.currentTime === 0) {
    manuallyPaused = false;

    audio.muted = false;
    audio2.muted = false;

    playNext();  // start sequence
    voiceToggle.textContent = "🔊";
    voiceToggle.classList.remove("paused");
    return;
  }

  // IF PLAYING → PAUSE AND MUTE
  if (isPlaying) {
    audio.pause();
    audio2.pause();

    audio.muted = true;
    audio2.muted = true;

    manuallyPaused = true;
    isPlaying = false;

    voiceToggle.textContent = "🔈";
    voiceToggle.classList.add("paused");
    return;
  }

  // IF PAUSED → RESUME FROM SAME POSITION
  if (!isPlaying && manuallyPaused) {
    audio.muted = false;
    audio2.muted = false;

    audio.play();
    if (currentIndex === 10) audio2.play();  // last two together

    isPlaying = true;
    manuallyPaused = false;

    voiceToggle.textContent = "🔊";
    voiceToggle.classList.remove("paused");
  }

});


// 👁 Scroll autoplay
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isPlaying && !manuallyPaused) {
        currentIndex = 0;
        playNext();
        inviteSection.classList.add("in-view");
      } else if (!entry.isIntersecting && isPlaying) {
        audio.pause();
        audio2.pause();
        isPlaying = false;
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(inviteSection);









// Fade cards when they enter view
const mapCards = document.querySelectorAll(".map-card");

const mapObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.4 }
);

mapCards.forEach(card => mapObserver.observe(card));
