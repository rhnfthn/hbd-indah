import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const lovedName = 'Aasya'
  const birthdayDate = new Date('2026-03-20T00:00:00')
  const birthDate = new Date('2003-03-20T00:00:00')
  const age = birthdayDate.getFullYear() - birthDate.getFullYear()
  const galleryImages = [
    '/images/dummy-girl.svg',
    '/images/dummy-girl-2.svg',
    '/images/dummy-girl-3.svg',
  ]

  const [isMusicOn, setIsMusicOn] = useState(false)
  const [isButtonPulse, setIsButtonPulse] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [heartBursts, setHeartBursts] = useState(0)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReached: false,
  })
  const audioRef = useRef(null)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const target = new Date('2026-03-20T00:00:00')
      const diffMs = target.getTime() - now.getTime()

      if (diffMs <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isReached: true,
        })
        return
      }

      const totalSeconds = Math.floor(diffMs / 1000)
      const days = Math.floor(totalSeconds / (3600 * 24))
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isReached: false,
      })
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    if (isMusicOn) {
      audio.pause()
      setIsMusicOn(false)
      return
    }

    try {
      await audio.play()
      setIsMusicOn(true)
    } catch {
      setIsMusicOn(false)
    }
  }

  const triggerWish = () => {
    setIsButtonPulse(true)
    setHeartBursts((count) => count + 1)
    window.setTimeout(() => setIsButtonPulse(false), 600)
  }

  const nextPage = () => {
    setCurrentPage((page) => {
      if (page === 3) {
        return 0
      }
      return page + 1
    })
  }

  const previousPage = () => {
    setCurrentPage((page) => Math.max(0, page - 1))
  }

  const renderPage = () => {
    if (currentPage === 0) {
      return (
        <>
          <p className="eyebrow">Halaman 1</p>
          <h1>Selamat Datang di Hari Bahagia {lovedName}</h1>
          <p className="subtitle">
            Ini adalah website ulang tahun interaktif khusus untuk perempuan
            yang kamu sayang. Tekan lanjut untuk membuka kejutan halaman demi
            halaman.
          </p>
          <button className="letter-button open" onClick={nextPage}>
            Mulai Kejutan
          </button>
        </>
      )
    }

    if (currentPage === 1) {
      return (
        <>
          <p className="eyebrow">Halaman 2</p>
          <h1>Data Ulang Tahun {lovedName}</h1>
          <p className="subtitle">
            Hari bahagiamu jatuh pada 20 Maret 2026. Kamu lahir pada 20 Maret
            2003, jadi hari ini kamu genap <strong>{age} tahun</strong>.
          </p>

          <div className="countdown-card">
            <h2>Menuju 20 Maret 2026</h2>
            {countdown.isReached ? (
              <p className="countdown-reached">Hari ulang tahunmu sudah tiba!</p>
            ) : (
              <div className="countdown-grid">
                <div>
                  <span>{countdown.days}</span>
                  <small>Hari</small>
                </div>
                <div>
                  <span>{countdown.hours}</span>
                  <small>Jam</small>
                </div>
                <div>
                  <span>{countdown.minutes}</span>
                  <small>Menit</small>
                </div>
                <div>
                  <span>{countdown.seconds}</span>
                  <small>Detik</small>
                </div>
              </div>
            )}
          </div>

          <div className="info-grid">
            <article className="info-card">
              <h2>Tanggal Ulang Tahun</h2>
              <p>20 Maret 2026</p>
            </article>
            <article className="info-card">
              <h2>Tanggal Lahir</h2>
              <p>20 Maret 2003</p>
            </article>
            <article className="info-card accent">
              <h2>Usia Sekarang</h2>
              <p>{age} Tahun</p>
            </article>
          </div>
        </>
      )
    }

    if (currentPage === 2) {
      return (
        <>
          <p className="eyebrow">Halaman 3</p>
          <h1>Galeri Cantik dan Musik</h1>
          <p className="subtitle">
            Ganti foto dengan dot di bawah. Gunakan tombol musik untuk memutar
            lagu ulang tahun, dan tekan Tebar Hati untuk animasi interaktif.
          </p>

          <div className="photo-wrap">
            <img
              src={galleryImages[currentPhoto]}
              alt="Foto dummy perempuan"
              className="dummy-photo"
            />
            <span className="photo-caption">Foto dummy sementara</span>
            <div className="photo-dots">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentPhoto ? 'active' : ''}`}
                  onClick={() => setCurrentPhoto(index)}
                  aria-label={`Pilih foto ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          <div className="button-row">
            <button
              className={`wish-button ${isButtonPulse ? 'pulse' : ''}`}
              onClick={triggerWish}
            >
              Tebar Hati
            </button>

            <button
              className={`music-button ${isMusicOn ? 'on' : ''}`}
              onClick={toggleMusic}
            >
              {isMusicOn ? 'Pause Music' : 'Play Music'}
            </button>
          </div>

          <p className="note">
            Letakkan lagu ulang tahun di public/music/happy-birthday.mp3.
          </p>
        </>
      )
    }

    return (
      <>
        <p className="eyebrow">Halaman 4</p>
        <h1>Surat Cinta untuk {lovedName}</h1>
        <p className="subtitle">
          Halaman terakhir berisi pesan spesial. Kamu bisa buka dan tutup surat
          kapan saja.
        </p>

        <button
          className={`letter-button ${showLetter ? 'open' : ''}`}
          onClick={() => setShowLetter((v) => !v)}
        >
          {showLetter ? 'Tutup Surat' : 'Buka Surat'}
        </button>

        {showLetter && (
          <div className="letter-box">
            <p>
              Selamat ulang tahun, {lovedName}. Terima kasih sudah hadir di
              hidupku. Semoga di usia baru ini, semua mimpimu makin dekat,
              langkahmu selalu dimudahkan, dan bahagiamu bertambah setiap hari.
            </p>
          </div>
        )}
      </>
    )
  }

  return (
    <main className="birthday-page">
      <audio ref={audioRef} src="/music/happy-birthday.mp3" loop preload="auto" />

      <div className="glow glow-left" aria-hidden="true"></div>
      <div className="glow glow-right" aria-hidden="true"></div>

      <section className="hero-card">
        {renderPage()}

        <div className="page-nav">
          <button
            className="nav-button secondary"
            onClick={previousPage}
            disabled={currentPage === 0}
          >
            Kembali
          </button>
          <button className="nav-button" onClick={nextPage}>
            {currentPage === 3 ? 'Ulangi dari Awal' : 'Lanjut Halaman'}
          </button>
        </div>

        <div className="page-dots" aria-label="Indikator halaman">
          {[0, 1, 2, 3].map((page) => (
            <button
              key={page}
              className={`page-dot ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
              aria-label={`Pindah ke halaman ${page + 1}`}
            ></button>
          ))}
        </div>
      </section>

      <section className="heart-bursts" aria-hidden="true" key={heartBursts}>
        <span className="heart h1">❤</span>
        <span className="heart h2">❤</span>
        <span className="heart h3">❤</span>
        <span className="heart h4">❤</span>
        <span className="heart h5">❤</span>
      </section>

      <section className="floating-balloons" aria-hidden="true">
        <span className="balloon b1"></span>
        <span className="balloon b2"></span>
        <span className="balloon b3"></span>
        <span className="balloon b4"></span>
      </section>
    </main>
  )
}

export default App
