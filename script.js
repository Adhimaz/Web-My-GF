// ==========================================
// 1. PENGATURAN TANGGAL & AUDIO
// ==========================================
const targetDate = new Date("May 17, 2026 00:00:00").getTime();
const song = document.getElementById("birthdaySong");
let isPlaying = false;

// Fungsi untuk memulai segalanya (Triggered by Overlay)
function startEverything() {
    // 1. Jalankan Musik
    playMusic();
    
    // 2. Hilangkan Overlay dengan animasi
    const overlay = document.getElementById("overlay");
    overlay.classList.add("fade-out-overlay");
    setTimeout(() => {
        overlay.style.display = "none";
    }, 800);
}

// ==========================================
// 2. FUNGSI HITUNG MUNDUR (COUNTDOWN)
// ==========================================
const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Kalkulasi waktu
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    
    // Update tampilan angka jika elemen ada
    if(daysEl) {
        daysEl.innerHTML = d;
        document.getElementById("hours").innerHTML = h;
        document.getElementById("minutes").innerHTML = m;
        document.getElementById("seconds").innerHTML = s;
    }

    // LOGIKA STOP: Jika waktu sudah habis atau lewat
    if (distance <= 0) {
        clearInterval(countdown); // Berhentikan interval agar tidak lanjut ke angka minus
        
        const box = document.querySelector(".countdown-box");
        if(box) {
            // Set semua angka ke 0 agar rapi
            document.getElementById("days").innerHTML = "0";
            document.getElementById("hours").innerHTML = "0";
            document.getElementById("minutes").innerHTML = "0";
            document.getElementById("seconds").innerHTML = "0";
            
            // Ganti teks box menjadi pesan perayaan
            box.innerHTML = "<h4 class='animate__animated animate__bounceIn' style='color: var(--primary-color); padding: 20px;'>HARI BAHAGIA TELAH TIBA! 🥳❤️</h4>";
        }
    }
}, 1000);

// ==========================================
// 3. NAVIGASI HALAMAN & PROTEKSI
// ==========================================
function nextPage() {
    const now = new Date().getTime();
    
    if (now < targetDate) {
        // Notifikasi Estetik dengan SweetAlert2
        Swal.fire({
            title: 'Sabar ya sayang... ✨',
            text: 'Pesan spesial ini baru bisa dibuka pada tanggal 17 Mei. Ditunggu ya! ❤️',
            icon: 'info',
            confirmButtonText: 'Siap! 🥰',
            confirmButtonColor: '#185fc9',
            background: '#f0f6ff',
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: { popup: 'animate__animated animate__fadeOutUp' }
        });
    } else {
        const p1 = document.getElementById('page1');
        const p2 = document.getElementById('page2');
        p1.classList.add('fade-out');
        
        setTimeout(() => {
            p1.classList.add('d-none');
            p2.classList.remove('d-none');
            window.scrollTo(0, 0);
            
            // Trigger Efek Perayaan
            celebrate(); 
            createHearts();
        }, 500);
    }
}

function prevPage() {
    const p1 = document.getElementById('page1');
    const p2 = document.getElementById('page2');
    p2.classList.add('d-none');
    p1.classList.remove('d-none', 'fade-out');
}

// ==========================================
// 4. KONTROL MUSIK
// ==========================================
function playMusic() {
    if(song) {
        song.play().catch(error => console.log("Autoplay dicegah browser, butuh interaksi."));
        isPlaying = true;
        document.getElementById("musicIcon").innerHTML = "⏸️";
        document.getElementById("musicControl").classList.add("rotating");
    }
}

function toggleMusic() {
    if (isPlaying) {
        song.pause();
        document.getElementById("musicIcon").innerHTML = "▶️";
        document.getElementById("musicControl").classList.remove("rotating");
    } else {
        song.play();
        document.getElementById("musicIcon").innerHTML = "⏸️";
        document.getElementById("musicControl").classList.add("rotating");
    }
    isPlaying = !isPlaying;
}

// ==========================================
// 5. EFEK PERAYAAN (CONFETTI & HEARTS)
// ==========================================
function celebrate() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function createHearts() {
    const symbols = ['❤️', '✨', '🌸', '🎈'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            document.body.appendChild(heart);
        }, i * 300);
    }
}

// ==========================================
// 6. FITUR MEMORY WALL (LOCAL STORAGE)
// ==========================================
document.addEventListener("DOMContentLoaded", loadMessages);

function saveMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message !== "") {
        let messages = JSON.parse(localStorage.getItem("birthdayMessages")) || [];
        messages.push(message);
        localStorage.setItem("birthdayMessages", JSON.stringify(messages));
        loadMessages();
        input.value = "";
    }
}

function renderMessage(text, index) {
    const wall = document.getElementById("memoryWall");
    const card = document.createElement("div");
    card.className = "memory-card shadow-sm animate__animated animate__fadeInUp";
    card.innerHTML = `
        <span><strong>Harapan:</strong> ${text}</span>
        <button class="btn-delete" onclick="deleteMessage(${index})">✕</button>
    `;
    wall.prepend(card);
}

function deleteMessage(index) {
    let messages = JSON.parse(localStorage.getItem("birthdayMessages")) || [];
    messages.splice(index, 1);
    localStorage.setItem("birthdayMessages", JSON.stringify(messages));
    loadMessages();
}

function loadMessages() {
    const wall = document.getElementById("memoryWall");
    if(wall) {
        wall.innerHTML = ""; 
        const messages = JSON.parse(localStorage.getItem("birthdayMessages")) || [];
        messages.forEach((msg, index) => renderMessage(msg, index));
    }
}