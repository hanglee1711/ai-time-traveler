/**
 * Historical Music Quiz System
 * Quiz âm nhạc lịch sử Việt Nam
 */

// Historical music data
const MUSIC_QUESTIONS = [
    {
        id: 1,
        question: "Ca khúc 'Tiến Quân Ca' được sáng tác vào thời kỳ nào?",
        period: "Kháng chiến chống Pháp",
        options: ["Kháng chiến chống Pháp", "Kháng chiến chống Mỹ", "Thời Tây Sơn", "Thời Trần"],
        correct: 0,
        audio: null, // Placeholder for audio URL
        info: "Tiến Quân Ca do Văn Cao sáng tác năm 1944, sau này trở thành Quốc ca Việt Nam."
    },
    {
        id: 2,
        question: "Bài hát 'Nơi Đảo Xa' nói về sự kiện lịch sử nào?",
        period: "Gạc Ma 1988",
        options: ["Chiến thắng Điện Biên Phủ", "Trận Gạc Ma 1988", "Giải phóng Sài Gòn", "Chiến dịch Hồ Chí Minh"],
        correct: 1,
        audio: null,
        info: "Bài hát tưởng niệm các chiến sĩ hy sinh tại Gạc Ma ngày 14/3/1988."
    },
    {
        id: 3,
        question: "Ca khúc 'Bác Còn Trong Tim Thiếu Nhi' được sáng tác để tưởng nhớ ai?",
        period: "Hồ Chí Minh",
        options: ["Hồ Chí Minh", "Võ Nguyên Giáp", "Nguyễn Văn Trỗi", "Lê Lợi"],
        correct: 0,
        audio: null,
        info: "Bài hát tưởng nhớ Chủ tịch Hồ Chí Minh, ra đời sau ngày Bác mất (1969)."
    },
    {
        id: 4,
        question: "'Đất Nước' của Đặng Thế Phong nói về chủ đề gì?",
        period: "Tình yêu đất nước",
        options: ["Tình yêu đất nước", "Chiến tranh", "Gia đình", "Thiên nhiên"],
        correct: 0,
        audio: null,
        info: "Bài hát ca ngợi vẻ đẹp non sông đất nước và lòng yêu nước của con người Việt Nam."
    },
    {
        id: 5,
        question: "Bài hát 'Cô Gái Sài Gòn Đi Tải Đạn' nói về thời kỳ nào?",
        period: "Kháng chiến chống Mỹ",
        options: ["Kháng chiến chống Pháp", "Kháng chiến chống Mỹ", "Thời hòa bình", "Cách mạng tháng Tám"],
        correct: 1,
        audio: null,
        info: "Bài hát ca ngợi người phụ nữ Việt Nam trong kháng chiến chống Mỹ cứu nước."
    },
];

// Music quiz state
let currentMusicQuestion = 0;
let musicScore = 0;
let selectedAnswer = null;

// Initialize music quiz
function initMusicQuiz() {
    currentMusicQuestion = 0;
    musicScore = 0;
    selectedAnswer = null;
}

// Open music quiz modal
function openMusicQuiz() {
    initMusicQuiz();
    const modal = document.getElementById('musicQuizModal');
    modal.style.display = 'flex';

    loadMusicQuestion();
}

// Close music quiz modal
function closeMusicQuiz() {
    const modal = document.getElementById('musicQuizModal');
    modal.style.display = 'none';

    // Stop any playing audio
    stopMusic();
}

// Load current music question
function loadMusicQuestion() {
    const question = MUSIC_QUESTIONS[currentMusicQuestion];

    // Update UI
    document.getElementById('musicScore').textContent = musicScore;
    document.getElementById('musicRound').textContent = `${currentMusicQuestion + 1}/${MUSIC_QUESTIONS.length}`;
    document.getElementById('musicQuestionText').textContent = question.question;

    // Reset play button
    const playBtn = document.getElementById('playMusicBtn');
    playBtn.textContent = '▶️ Phát nhạc';
    playBtn.disabled = false;

    // Render options
    const optionsContainer = document.getElementById('musicOptions');
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <div class="music-option" onclick="selectMusicOption(${index})">
            ${option}
        </div>
    `).join('');

    // Hide next button
    document.getElementById('nextMusicBtn').style.display = 'none';
    selectedAnswer = null;
}

// Play music (placeholder - would play actual audio in production)
function playMusic() {
    const playBtn = document.getElementById('playMusicBtn');
    playBtn.textContent = '🔊 Đang phát...';
    playBtn.disabled = true;

    // Simulate music playing
    setTimeout(() => {
        playBtn.textContent = '✅ Đã phát';
    }, 3000);

    // In production, would play actual audio file:
    // const audio = new Audio(MUSIC_QUESTIONS[currentMusicQuestion].audio);
    // audio.play();
}

// Stop music
function stopMusic() {
    // In production, would stop audio playback
    const playBtn = document.getElementById('playMusicBtn');
    if (playBtn) {
        playBtn.textContent = '▶️ Phát nhạc';
        playBtn.disabled = false;
    }
}

// Select music option
function selectMusicOption(optionIndex) {
    if (selectedAnswer !== null) return; // Already answered

    selectedAnswer = optionIndex;
    const question = MUSIC_QUESTIONS[currentMusicQuestion];
    const options = document.querySelectorAll('.music-option');

    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    // Show correct/wrong
    options[question.correct].classList.add('correct');

    if (optionIndex === question.correct) {
        musicScore += 20;
        options[optionIndex].innerHTML += ' ✅';
    } else {
        options[optionIndex].classList.add('wrong');
        options[optionIndex].innerHTML += ' ❌';
    }

    // Update score
    document.getElementById('musicScore').textContent = musicScore;

    // Show info
    setTimeout(() => {
        alert(`💡 ${question.info}`);

        // Show next button
        if (currentMusicQuestion < MUSIC_QUESTIONS.length - 1) {
            document.getElementById('nextMusicBtn').style.display = 'block';
        } else {
            // Quiz completed
            showMusicResults();
        }
    }, 500);
}

// Next music question
function nextMusicQuestion() {
    currentMusicQuestion++;
    stopMusic();
    loadMusicQuestion();
}

// Show music quiz results
function showMusicResults() {
    const optionsContainer = document.getElementById('musicOptions');
    const nextBtn = document.getElementById('nextMusicBtn');
    nextBtn.style.display = 'none';

    const percentage = (musicScore / (MUSIC_QUESTIONS.length * 20)) * 100;
    let message = '';

    if (percentage >= 80) {
        message = '🎉 Xuất sắc! Bạn là chuyên gia âm nhạc lịch sử!';
    } else if (percentage >= 60) {
        message = '👍 Tốt lắm! Bạn có kiến thức tốt về nhạc lịch sử!';
    } else if (percentage >= 40) {
        message = '😊 Khá đấy! Hãy nghe thêm nhạc lịch sử nhé!';
    } else {
        message = '💪 Cố gắng lên! Khám phá thêm nhạc lịch sử Việt Nam!';
    }

    optionsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
            <h2 style="color: var(--gold); font-size: 2rem; margin-bottom: 1rem;">Kết Quả</h2>
            <div style="font-size: 3rem; margin-bottom: 1rem;">${percentage >= 80 ? '🏆' : percentage >= 60 ? '🎵' : '🎼'}</div>
            <div style="font-size: 2.5rem; color: var(--gold); margin-bottom: 1rem;">${musicScore} / ${MUSIC_QUESTIONS.length * 20}</div>
            <div style="font-size: 1.3rem; color: var(--text-gray); margin-bottom: 2rem;">${percentage.toFixed(0)}%</div>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-quiz btn-primary" onclick="openMusicQuiz()">
                    Chơi lại
                </button>
                <button class="btn-quiz btn-secondary" onclick="closeMusicQuiz()">
                    Đóng
                </button>
            </div>
        </div>
    `;

    // Award XP
    const xpEarned = musicScore;
    alert(`✨ Bạn nhận được +${xpEarned} XP!`);

    // Save to localStorage
    const currentXP = parseInt(localStorage.getItem('userXP') || '0');
    localStorage.setItem('userXP', (currentXP + xpEarned).toString());
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicQuiz);
} else {
    initMusicQuiz();
}
