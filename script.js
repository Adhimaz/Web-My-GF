// ==========================================
// 1. PENGATURAN TANGGAL & AUDIO
// ==========================================
const targetDate = new Date("May 17, 2026 00:00:00").getTime();
const song = document.getElementById("birthdaySong");
let isPlaying = false;

// ==========================================
// 2. FUNGSI HITUNG MUNDUR (COUNTDOWN)
// ==========================================
const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    if(daysEl) {
        daysEl.innerHTML = d;
        document.getElementById("hours").innerHTML = h;
        document.getElementById("minutes").innerHTML = m;
        document.getElementById("seconds").innerHTML = s;
    }

    if (distance < 0) {
        clearInterval(countdown);
        const box = document.querySelector(".countdown-box");
        if(box) box.innerHTML = "<h4>HARI BAHAGIA TELAH TIBA! 🥳</h4>";
    }
}, 1000);

// ==========================================
// 3. NAVIGASI HALAMAN & PROTEKSI
// ==========================================
function nextPage() {
    const now = new Date().getTime();
    
    // Cek apakah waktu sekarang sudah melewati atau sama dengan targetDate (17 May 2026)
    if (now < targetDate) {
        // Jika belum sampai waktunya, munculkan pesan peringatan
        alert("Sabar ya sayang... ✨ Pesan spesial ini baru bisa dibuka pada tanggal 17 Mei. Ditunggu ya! ❤️");
    } else {
        // Jika sudah sampai waktunya, jalankan fungsi pindah halaman seperti biasa
        const p1 = document.getElementById('page1');
        const p2 = document.getElementById('page2');

        p1.classList.add('fade-out');

        setTimeout(() => {
            p1.classList.add('d-none');
            p2.classList.remove('d-none');
            window.scrollTo(0, 0);
            
            // Berikan efek konfeti kejutan
            celebrate();
        }, 500);
    }
}

function prevPage() {
    const p1 = document.getElementById('page1');
    const p2 = document.getElementById('page2');

    p2.classList.add('d-none');
    p1.classList.remove('d-none');
    p1.classList.remove('fade-out');
}

// ==========================================
// 4. KONTROL MUSIK
// ==========================================
function playMusic() {
    if(song) {
        song.play();
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
// 5. EFEK KONFETI
// ==========================================
function celebrate() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#185fc9', '#4dafff', '#ffffff']
    });
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

        loadMessages(); // Refresh wall
        input.value = "";
    }
}

function renderMessage(text, index) {
    const wall = document.getElementById("memoryWall");
    const card = document.createElement("div");
    card.className = "memory-card shadow-sm";
    
    card.innerHTML = `
        <span><strong>Dia:</strong> ${text}</span>
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