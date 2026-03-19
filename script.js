// Core state
const pages = Array.from(document.querySelectorAll('.story-page'))
const nextButtons = Array.from(document.querySelectorAll('[data-next]'))
const prevButtons = Array.from(document.querySelectorAll('[data-prev]'))
const landingTitle = document.getElementById('landingTitle')
const typedText = document.getElementById('typedText')
const backgroundLayer = document.getElementById('backgroundLayer')
const startBtn = document.getElementById('startBtn')
const countdownLabel = document.getElementById('countdownLabel')
const countdownValue = document.getElementById('countdownValue')

let currentPage = 0
const loverName = 'Indah Sujiati'
const countdownTarget = new Date(2026, 2, 20, 0, 0, 0)
const forceEnableStartButton = false
let countdownTimer = null

const fixedTrackSrc = '/music/sertamulia.mp3'
let musicResumeTime = 0
let isMusicPrimed = false

const bgMusic = document.getElementById('bgMusic')
const musicToggle = document.getElementById('musicToggle')

function loadTrack() {
  if (!isMusicPrimed) {
    bgMusic.src = fixedTrackSrc
    bgMusic.load()
    isMusicPrimed = true
  }
}

function updateMusicButton() {
  if (bgMusic.muted) {
    musicToggle.textContent = '🔇'
    return
  }

  musicToggle.textContent = bgMusic.paused ? '🔈' : '🔊'
}

async function safePlayMusic() {
  if (!isMusicPrimed) {
    loadTrack()
  }

  // Restore last known position if browser resets media on interaction/page transitions.
  if (musicResumeTime > 0 && bgMusic.currentTime === 0 && bgMusic.readyState >= 1) {
    bgMusic.currentTime = musicResumeTime
  }

  try {
    await bgMusic.play()
  } catch {
    // Browser may block autoplay; user interaction will start playback.
  }
  updateMusicButton()
}

loadTrack()
bgMusic.volume = 0.45

bgMusic.addEventListener('timeupdate', () => {
  musicResumeTime = bgMusic.currentTime
})

bgMusic.addEventListener('seeking', () => {
  musicResumeTime = bgMusic.currentTime
})

// Ensure playback starts on first user interaction for browsers that block autoplay.
window.addEventListener(
  'pointerdown',
  async () => {
    if (bgMusic.paused) {
      await safePlayMusic()
    }
  },
  { once: true },
)

safePlayMusic()

musicToggle.addEventListener('click', async () => {
  if (bgMusic.paused) {
    bgMusic.muted = false
    await safePlayMusic()
    return
  }

  bgMusic.muted = !bgMusic.muted
  updateMusicButton()
})

// Navigation and page transitions
function showPage(index) {
  currentPage = Math.max(0, Math.min(index, pages.length - 1))

  pages.forEach((page, pageIndex) => {
    page.classList.toggle('active', pageIndex === currentPage)
  })

  changeBackgroundByPage(currentPage)
  runPageEffects(currentPage)
}

function nextPage() {
  if (currentPage >= pages.length - 1) {
    return
  }

  if (currentPage === 0 && !forceEnableStartButton && new Date() < countdownTarget) {
    return
  }

  showPage(currentPage + 1)
}

function prevPage() {
  if (currentPage <= 0) {
    return
  }
  showPage(currentPage - 1)
}

nextButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    if (currentPage === 0) {
      landingTitle.textContent = `Hai ${loverName} ❤️, aku punya sesuatu spesial buat kamu...`
    }

    if (currentPage === 1) {
      await safePlayMusic()
      showPage(4)
      return
    }

    await safePlayMusic()
    nextPage()
  })
})

prevButtons.forEach((button) => {
  button.addEventListener('click', prevPage)
})

// Typing effect (page 2)
const messageTemplate = [
  'Selamat ulang tahun yang ke-23 ya, sayang ❤️',
  'Panjang umur dan selalu sehat. semoga diumur kamu yang sekarang kamu bisa mendapatkan semua keinginan kamu yang tertunda, dilancarkan semua rencananya dan dimudahkan semua usahanya',
].join('\n\n')

let typingTimer = null

function startTypingMessage() {
  if (!typedText) {
    return
  }

  if (typingTimer) {
    window.clearInterval(typingTimer)
  }

  const message = messageTemplate.replaceAll('{name}', loverName)
  typedText.textContent = ''
  let i = 0

  typingTimer = window.setInterval(() => {
    typedText.textContent += message.charAt(i)
    i += 1

    if (i >= message.length) {
      window.clearInterval(typingTimer)
      typingTimer = null
    }
  }, 32)
}

// Gallery slider (page 3)
const slides = [
  {
    src: '/images/indah1.jpeg',
    fallback: '/images/dummy-girl.svg',
    caption: 'Senyummu selalu jadi alasan bahagiaku.',
  },
  {
    src: '/images/indah2.jpeg',
    fallback: '/images/dummy-girl-2.svg',
    caption: 'Bersamamu, momen sederhana terasa luar biasa.',
  },
  {
    src: '/images/indah3.jpeg',
    fallback: '/images/dummy-girl-3.svg',
    caption: 'Aku ingin terus menulis cerita indah bersamamu.',
  },
  {
    src: '/images/indah4.jpeg',
    fallback: '/images/dummy-girl-4.svg',
    caption: 'Terima kasih sudah jadi rumah paling nyaman untukku.',
  },
  {
    src: '/images/indah5.jpeg',
    fallback: '/images/dummy-girl-5.svg',
    caption: 'Di setiap doaku, ada nama kamu yang selalu aku jaga.',
  },
]

const slideImage = document.getElementById('slideImage')
const slideCaption = document.getElementById('slideCaption')
const prevSlide = document.getElementById('prevSlide')
const nextSlide = document.getElementById('nextSlide')
const slideFrame = document.querySelector('.slide-frame')

let slideIndex = 0

function renderSlide(index) {
  slideIndex = (index + slides.length) % slides.length
  const slide = slides[slideIndex]

  slideImage.src = slide.src
  slideImage.dataset.fallback = slide.fallback
  slideImage.alt = `Kenangan ${slideIndex + 1}`
  slideCaption.textContent = slide.caption
}

slideImage.addEventListener('error', () => {
  const fallback = slideImage.dataset.fallback
  if (fallback && slideImage.src !== new URL(fallback, window.location.origin).href) {
    slideImage.src = fallback
  }
})

prevSlide.addEventListener('click', () => renderSlide(slideIndex - 1))
nextSlide.addEventListener('click', () => renderSlide(slideIndex + 1))

const swipeThreshold = 45
let pointerStartX = 0
let pointerEndX = 0
let isPointerDown = false

slideFrame.addEventListener('pointerdown', (event) => {
  isPointerDown = true
  pointerStartX = event.clientX
  pointerEndX = event.clientX
  slideFrame.setPointerCapture(event.pointerId)
})

slideFrame.addEventListener('pointermove', (event) => {
  if (!isPointerDown) {
    return
  }
  pointerEndX = event.clientX
})

const endSwipe = (event) => {
  if (!isPointerDown) {
    return
  }

  pointerEndX = event.clientX
  const deltaX = pointerEndX - pointerStartX
  isPointerDown = false

  if (Math.abs(deltaX) < swipeThreshold) {
    return
  }

  if (deltaX < 0) {
    renderSlide(slideIndex + 1)
    return
  }

  renderSlide(slideIndex - 1)
}

slideFrame.addEventListener('pointerup', endSwipe)
slideFrame.addEventListener('pointercancel', () => {
  isPointerDown = false
})

renderSlide(0)

// Surprise page
const surprisePromptPage = document.getElementById('page-surprise')
const surpriseVideo = document.getElementById('surpriseVideo')
const videoNoteToggle = document.getElementById('videoNoteToggle')
const videoNoteCard = document.getElementById('videoNoteCard')
let isVideoNoteOpen = false

surprisePromptPage.addEventListener('click', () => {
  if (currentPage !== 3) {
    return
  }

  nextPage()
})

if (videoNoteToggle && videoNoteCard) {
  videoNoteToggle.addEventListener('click', () => {
    isVideoNoteOpen = !isVideoNoteOpen
    videoNoteCard.classList.toggle('hidden', !isVideoNoteOpen)
    videoNoteToggle.classList.toggle('open', isVideoNoteOpen)
    videoNoteToggle.textContent = isVideoNoteOpen ? '🪪' : '✉'
  })
}

// Cake interaction + confetti
const cakeWrap = document.getElementById('cakeWrap')
const flame = document.getElementById('flame')
const wishText = document.getElementById('wishText')
let isFlameOn = false
flame.classList.add('off')

function spawnConfetti() {
  const colors = ['#ff8fab', '#cda4ff', '#ffe066', '#80ed99', '#fff']

  for (let i = 0; i < 70; i += 1) {
    const piece = document.createElement('span')
    piece.className = 'confetti'
    piece.style.left = `${Math.random() * 100}vw`
    piece.style.background = colors[Math.floor(Math.random() * colors.length)]
    piece.style.animationDuration = `${2 + Math.random() * 2.2}s`
    piece.style.animationDelay = `${Math.random() * 0.2}s`
    piece.style.transform = `rotate(${Math.random() * 180}deg)`
    document.body.appendChild(piece)

    window.setTimeout(() => {
      piece.remove()
    }, 4200)
  }
}

cakeWrap.addEventListener('click', () => {
  if (!isFlameOn) {
    isFlameOn = true
    flame.classList.remove('off')
    wishText.textContent = 'Lilin menyala. Klik lagi untuk meniup dan buat harapan ✨'
    return
  }

  isFlameOn = false
  flame.classList.add('off')
  wishText.textContent = 'Make a wish ✨'
  spawnConfetti()
})

// Closing page heart burst
function burstHearts() {
  for (let i = 0; i < 24; i += 1) {
    const heart = document.createElement('span')
    heart.className = 'burst-heart'
    heart.textContent = '❤'
    heart.style.left = `${40 + Math.random() * 20}vw`
    heart.style.bottom = `${15 + Math.random() * 20}vh`
    heart.style.color = i % 2 === 0 ? '#ff4fa0' : '#be7dff'
    heart.style.animationDelay = `${Math.random() * 0.35}s`
    document.body.appendChild(heart)

    window.setTimeout(() => {
      heart.remove()
    }, 2000)
  }
}

// Falling hearts for page 2
let heartRainTimer = null

function startHeartRain() {
  stopHeartRain()
  heartRainTimer = window.setInterval(() => {
    const heart = document.createElement('span')
    heart.className = 'fall-heart'
    heart.textContent = Math.random() > 0.5 ? '❤' : '💖'
    heart.style.left = `${Math.random() * 100}vw`
    heart.style.animationDuration = `${3.4 + Math.random() * 2.3}s`
    heart.style.fontSize = `${0.85 + Math.random() * 1.2}rem`
    document.body.appendChild(heart)

    window.setTimeout(() => {
      heart.remove()
    }, 6500)
  }, 220)
}

function stopHeartRain() {
  if (heartRainTimer) {
    window.clearInterval(heartRainTimer)
    heartRainTimer = null
  }
}

// Background particles and page colors
function seedParticles() {
  const symbols = ['❤', '✦', '✧', '✨']

  for (let i = 0; i < 32; i += 1) {
    const node = document.createElement('span')
    node.className = 'particle'
    node.textContent = symbols[Math.floor(Math.random() * symbols.length)]
    node.style.left = `${Math.random() * 100}%`
    node.style.animationDuration = `${8 + Math.random() * 10}s`
    node.style.animationDelay = `${Math.random() * 8}s`
    node.style.opacity = `${0.2 + Math.random() * 0.5}`
    backgroundLayer.appendChild(node)
  }
}

function changeBackgroundByPage(page) {
  const palettes = [
    'linear-gradient(135deg, #ffd1da 0%, #efd8ff 48%, #fff4fb 100%)',
    'linear-gradient(135deg, #ffd7e8 0%, #e6ccff 52%, #fff6ff 100%)',
    'linear-gradient(135deg, #ffe1f0 0%, #f0ddff 54%, #fff7fb 100%)',
    'linear-gradient(135deg, #ffd8e0 0%, #e2d6ff 52%, #fff6f8 100%)',
    'linear-gradient(135deg, #ffd6ef 0%, #efd5ff 52%, #fff9f3 100%)',
    'linear-gradient(135deg, #ffe2f2 0%, #ecd7ff 50%, #fff9ff 100%)',
    'linear-gradient(135deg, #ffd8e8 0%, #edd5ff 50%, #fff9ff 100%)',
  ]

  document.body.style.background = palettes[page] ?? palettes[0]
}

function runPageEffects(page) {
  stopHeartRain()

  if (page === 1) {
    startTypingMessage()
    startHeartRain()
  }

  if (page === 4) {
    burstHearts()
  }

  if (page === 5 && surpriseVideo) {
    surpriseVideo.currentTime = 0
    surpriseVideo.play().catch(() => {
      // Ignore autoplay restrictions silently.
    })
    if (videoNoteCard && videoNoteToggle) {
      isVideoNoteOpen = false
      videoNoteCard.classList.add('hidden')
      videoNoteToggle.classList.remove('open')
      videoNoteToggle.textContent = '✉'
    }
  }
}

function formatTimeUnit(value) {
  return String(value).padStart(2, '0')
}

function updateCountdown() {
  if (forceEnableStartButton) {
    if (countdownLabel) {
      countdownLabel.textContent = 'Mode edit aktif. Tombol sudah di-enable.'
    }
    if (countdownValue) {
      countdownValue.textContent = '00 : 00 : 00 : 00'
    }
    if (startBtn) {
      startBtn.disabled = false
      startBtn.textContent = 'Mulai Sekarang'
    }

    if (countdownTimer) {
      window.clearInterval(countdownTimer)
      countdownTimer = null
    }
    return
  }

  const now = new Date()
  const diff = countdownTarget.getTime() - now.getTime()

  if (diff <= 0) {
    if (countdownValue) {
      countdownValue.textContent = '00 : 00 : 00 : 00'
    }
    if (countdownLabel) {
      countdownLabel.textContent = 'Waktunya sudah tiba, yuk mulai!'
    }
    if (startBtn) {
      startBtn.disabled = false
      startBtn.textContent = 'Mulai Sekarang'
    }

    if (countdownTimer) {
      window.clearInterval(countdownTimer)
      countdownTimer = null
    }
    return
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (countdownValue) {
    countdownValue.textContent = `${formatTimeUnit(days)} : ${formatTimeUnit(hours)} : ${formatTimeUnit(minutes)} : ${formatTimeUnit(seconds)}`
  }
  if (countdownLabel) {
    countdownLabel.textContent = 'Hitung mundur menuju 20 Maret 2026'
  }
  if (startBtn) {
    startBtn.disabled = true
    startBtn.textContent = 'Buka saat waktunya tiba'
  }
}

// Restart flow
const restartBtn = document.getElementById('restartBtn')
restartBtn.addEventListener('click', () => {
  isFlameOn = false
  flame.classList.add('off')
  wishText.textContent = 'Klik lilin untuk menyalakan api, lalu klik lagi untuk meniup.'
  if (surpriseVideo) {
    surpriseVideo.pause()
    surpriseVideo.currentTime = 0
  }
  if (videoNoteCard && videoNoteToggle) {
    isVideoNoteOpen = false
    videoNoteCard.classList.add('hidden')
    videoNoteToggle.classList.remove('open')
    videoNoteToggle.textContent = '✉'
  }
  showPage(0)
})

// Initial render
seedParticles()
updateCountdown()
countdownTimer = window.setInterval(updateCountdown, 1000)
showPage(0)
updateMusicButton()
