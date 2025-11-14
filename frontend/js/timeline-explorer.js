/**
 * Timeline Explorer - Du Hành Dòng Thời Gian
 * Interactive Vietnamese History Timeline
 */

// Historical events database
const TIMELINE_EVENTS = [
    // Ancient Period (Cổ đại)
    {
        id: 1,
        year: -2879,
        displayYear: "2879 TCN",
        period: "Cổ đại",
        title: "Khởi Nguồn Văn Lang",
        description: "Hùng Vương dựng nước Văn Lang, khởi đầu lịch sử dân tộc Việt Nam với 18 đời Hùng Vương.",
        icon: "👑",
        quiz: {
            question: "Ai là người dựng nước Văn Lang?",
            options: ["Hùng Vương", "Lạc Long Quân", "An Dương Vương", "Triệu Đà"],
            correct: 0,
            explanation: "Hùng Vương là người khai sáng nên nước Văn Lang, đánh dấu khởi nguồn văn hiến Việt Nam."
        }
    },
    {
        id: 2,
        year: 40,
        displayYear: "Năm 40",
        period: "Hai Bà Trưng",
        title: "Khởi Nghĩa Hai Bà Trưng",
        description: "Hai Bà Trưng nổi dậy chống quân Hán, giành độc lập cho đất nước. 65 thành hưởng ứng, lập triều đình tại Mê Linh.",
        icon: "⚔️",
        quiz: {
            question: "Khởi nghĩa Hai Bà Trưng diễn ra vào năm nào?",
            options: ["Năm 40", "Năm 938", "Năm 248", "Năm 1428"],
            correct: 0,
            explanation: "Năm 40, Hai Bà Trưng khởi nghĩa chống quân Đông Hán, giải phóng 65 thành."
        }
    },
    {
        id: 3,
        year: 248,
        displayYear: "Năm 248",
        period: "Bà Triệu",
        title: "Khởi Nghĩa Bà Triệu",
        description: "Triệu Thị Trinh (Bà Triệu) 19 tuổi cưỡi voi ra trận, lãnh đạo nghĩa quân chống quân Ngô.",
        icon: "🐘",
        quiz: {
            question: "Bà Triệu cưỡi gì ra trận?",
            options: ["Voi", "Ngựa", "Thuyền", "Xe"],
            correct: 0,
            explanation: "Bà Triệu nổi tiếng với hình ảnh cưỡi voi chỉ huy nghĩa quân chiến đấu."
        }
    },
    // Medieval Period (Trung đại)
    {
        id: 4,
        year: 938,
        displayYear: "Năm 938",
        period: "Ngô Quyền",
        title: "Chiến Thắng Bạch Đằng",
        description: "Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng bằng chiến thuật cọc ngầm, chấm dứt 1000 năm Bắc thuộc.",
        icon: "🛡️",
        quiz: {
            question: "Chiến thuật gì được Ngô Quyền sử dụng tại Bạch Đằng?",
            options: ["Cọc ngầm", "Phục binh", "Hỏa công", "Kế ly gián"],
            correct: 0,
            explanation: "Ngô Quyền sử dụng chiến thuật cọc ngầm dưới sông, khi triều xuống cọc lộ ra làm vỡ thuyền địch."
        }
    },
    {
        id: 5,
        year: 1010,
        displayYear: "Năm 1010",
        period: "Nhà Lý",
        title: "Dời Đô Thăng Long",
        description: "Lý Công Uẩn dời đô từ Hoa Lư về Đại La (Thăng Long), viết chiếu Thiên đô nổi tiếng.",
        icon: "🏛️",
        quiz: {
            question: "Ai là người dời đô về Thăng Long?",
            options: ["Lý Công Uẩn", "Lý Thái Tông", "Lý Thánh Tông", "Lý Anh Tông"],
            correct: 0,
            explanation: "Lý Công Uẩn (Lý Thái Tổ) dời đô về Thăng Long năm 1010, đặt nền móng cho kinh đô nghìn năm."
        }
    },
    {
        id: 6,
        year: 1288,
        displayYear: "Năm 1288",
        period: "Nhà Trần",
        title: "Trận Bạch Đằng lần 3",
        description: "Trần Hưng Đạo đại phá quân Nguyên-Mông lần 3, tiêu diệt hơn 400 chiến thuyền địch.",
        icon: "⚔️",
        quiz: {
            question: "Ai là tướng lĩnh chỉ huy trận Bạch Đằng 1288?",
            options: ["Trần Hưng Đạo", "Ngô Quyền", "Lý Thường Kiệt", "Lê Lợi"],
            correct: 0,
            explanation: "Trần Hưng Đạo chỉ huy chiến thắng Bạch Đằng 1288, đánh bại quân Nguyên-Mông lần thứ 3."
        }
    },
    // Late Medieval (Trung đại sau)
    {
        id: 7,
        year: 1428,
        displayYear: "Năm 1428",
        period: "Nhà Lê",
        title: "Bình Định Thiên Hạ",
        description: "Lê Lợi chiến thắng hoàn toàn quân Minh, lập nên nhà Lê, viết Bình Ngô Đại Cáo.",
        icon: "🗡️",
        quiz: {
            question: "Tác phẩm nào được viết sau chiến thắng chống Minh?",
            options: ["Bình Ngô Đại Cáo", "Nam Quốc Sơn Hà", "Hịch Tướng Sĩ", "Quốc Âm Thi Tập"],
            correct: 0,
            explanation: "Nguyễn Trãi viết Bình Ngô Đại Cáo sau khi Lê Lợi đánh đuổi quân Minh."
        }
    },
    {
        id: 8,
        year: 1789,
        displayYear: "Năm 1789",
        period: "Tây Sơn",
        title: "Ngọc Hồi - Đống Đa",
        description: "Quang Trung đại phá 29 vạn quân Thanh trong 5 ngày Tết, chiến thắng vang dội nhất lịch sử.",
        icon: "🐉",
        quiz: {
            question: "Chiến thắng Ngọc Hồi - Đống Đa diễn ra vào thời gian nào?",
            options: ["Tết Kỷ Dậu 1789", "Tết Mậu Thân 1788", "Tết Canh Tuất 1790", "Tết Đinh Mùi 1787"],
            correct: 0,
            explanation: "Quang Trung đánh địch trong 5 ngày Tết Kỷ Dậu 1789, đại thắng quân Thanh."
        }
    },
    // Modern Period (Cận đại)
    {
        id: 9,
        year: 1945,
        displayYear: "2/9/1945",
        period: "Cách mạng",
        title: "Độc Lập - Tự Do",
        description: "Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, nước Việt Nam Dân chủ Cộng hòa ra đời.",
        icon: "⭐",
        quiz: {
            question: "Tuyên ngôn Độc lập được đọc vào ngày nào?",
            options: ["2/9/1945", "19/8/1945", "30/4/1975", "7/5/1954"],
            correct: 0,
            explanation: "Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Ba Đình."
        }
    },
    {
        id: 10,
        year: 1954,
        displayYear: "7/5/1954",
        period: "Kháng chiến",
        title: "Điện Biên Phủ",
        description: "Chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, ch진동 địa cầu', kết thúc 9 năm kháng chiến chống Pháp.",
        icon: "🎖️",
        quiz: {
            question: "Chiến thắng Điện Biên Phủ diễn ra năm nào?",
            options: ["1954", "1945", "1975", "1968"],
            correct: 0,
            explanation: "Chiến thắng Điện Biên Phủ ngày 7/5/1954, đánh dấu kết thúc chủ nghĩa thực dân cũ."
        }
    },
    {
        id: 11,
        year: 1975,
        displayYear: "30/4/1975",
        period: "Thống nhất",
        title: "Giải Phóng Miền Nam",
        description: "Hoàn thành cuộc kháng chiến chống Mỹ, thống nhất đất nước sau 21 năm chia cắt.",
        icon: "🏆",
        quiz: {
            question: "Miền Nam được giải phóng hoàn toàn vào ngày nào?",
            options: ["30/4/1975", "2/9/1945", "7/5/1954", "19/12/1946"],
            correct: 0,
            explanation: "Ngày 30/4/1975, chiến dịch Hồ Chí Minh thành công, miền Nam hoàn toàn giải phóng."
        }
    }
];

// Timeline state
let exploredEvents = new Set();
let timelineXP = 0;

// Initialize timeline
function initTimeline() {
    const saved = localStorage.getItem('exploredEvents');
    if (saved) {
        exploredEvents = new Set(JSON.parse(saved));
    }

    const savedXP = localStorage.getItem('timelineXP');
    if (savedXP) {
        timelineXP = parseInt(savedXP);
    }
}

// Open timeline modal
function openTimeline() {
    initTimeline();

    const modal = document.getElementById('timelineModal');
    modal.style.display = 'flex';

    // Update stats
    document.getElementById('eventsExplored').textContent = exploredEvents.size;
    document.getElementById('timelineXP').textContent = timelineXP;

    // Render timeline
    renderTimeline();
}

// Close timeline modal
function closeTimeline() {
    const modal = document.getElementById('timelineModal');
    modal.style.display = 'none';
}

// Render timeline
function renderTimeline() {
    const container = document.getElementById('timelineContent');

    // Group events by period
    const periods = {
        "Cổ đại": [],
        "Hai Bà Trưng": [],
        "Bà Triệu": [],
        "Ngô Quyền": [],
        "Nhà Lý": [],
        "Nhà Trần": [],
        "Nhà Lê": [],
        "Tây Sơn": [],
        "Cách mạng": [],
        "Kháng chiến": [],
        "Thống nhất": []
    };

    TIMELINE_EVENTS.forEach(event => {
        if (!periods[event.period]) {
            periods[event.period] = [];
        }
        periods[event.period].push(event);
    });

    let html = '<div style="position: relative;">';

    // Vertical timeline line
    html += '<div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--gold), #3498db); border-radius: 2px; transform: translateX(-50%);"></div>';

    TIMELINE_EVENTS.forEach((event, index) => {
        const isExplored = exploredEvents.has(event.id);
        const side = index % 2 === 0 ? 'left' : 'right';

        html += `
            <div class="timeline-event ${side}" style="margin-bottom: 3rem; position: relative;">
                <div class="timeline-dot" style="
                    position: absolute;
                    ${side === 'left' ? 'right: -2rem;' : 'left: -2rem;'}
                    top: 1rem;
                    width: 2rem;
                    height: 2rem;
                    background: ${isExplored ? 'var(--gold)' : '#34495e'};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    box-shadow: 0 0 20px ${isExplored ? 'rgba(212, 175, 55, 0.5)' : 'rgba(0,0,0,0.3)'};
                    z-index: 10;
                ">
                    ${isExplored ? '✓' : event.icon}
                </div>

                <div onclick="exploreEvent(${event.id})" style="
                    cursor: pointer;
                    background: linear-gradient(135deg, rgba(26, 35, 46, 0.95), rgba(44, 62, 80, 0.9));
                    border: 2px solid ${isExplored ? 'var(--gold)' : 'rgba(52, 152, 219, 0.3)'};
                    border-radius: 12px;
                    padding: 1.5rem;
                    width: calc(50% - 4rem);
                    ${side === 'left' ? 'margin-right: auto;' : 'margin-left: auto;'}
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                ">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 2rem;">${event.icon}</span>
                        <div>
                            <div style="color: var(--gold); font-size: 1rem; font-weight: 600;">${event.displayYear}</div>
                            <h3 style="color: #fff; margin: 0.25rem 0; font-size: 1.3rem;">${event.title}</h3>
                        </div>
                    </div>

                    <p style="color: var(--text-gray); margin: 0.5rem 0; line-height: 1.6;">
                        ${event.description}
                    </p>

                    ${isExplored
                        ? '<div style="color: #2ecc71; font-size: 0.9rem; margin-top: 0.5rem;">✓ Đã khám phá</div>'
                        : '<div style="color: #3498db; font-size: 0.9rem; margin-top: 0.5rem;">👉 Click để khám phá!</div>'
                    }
                </div>
            </div>
        `;
    });

    html += '</div>';

    container.innerHTML = html;
}

// Explore event (show quiz)
function exploreEvent(eventId) {
    const event = TIMELINE_EVENTS.find(e => e.id === eventId);
    if (!event) return;

    const isExplored = exploredEvents.has(eventId);

    if (isExplored) {
        // Already explored, just show info
        alert(`${event.icon} ${event.title}\n\n${event.description}\n\n✓ Bạn đã khám phá sự kiện này!`);
        return;
    }

    // Show quiz
    const userAnswer = prompt(
        `${event.icon} ${event.title}\n\n${event.description}\n\n━━━━━━━━━━━━━━━━━━\n` +
        `📝 MINI QUIZ:\n${event.quiz.question}\n\n` +
        event.quiz.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') +
        `\n\nNhập số (1-${event.quiz.options.length}):`
    );

    if (userAnswer === null) return; // User cancelled

    const answerIndex = parseInt(userAnswer) - 1;

    if (answerIndex === event.quiz.correct) {
        // Correct answer
        exploredEvents.add(eventId);
        const xpEarned = 50;
        timelineXP += xpEarned;

        // Save progress
        localStorage.setItem('exploredEvents', JSON.stringify([...exploredEvents]));
        localStorage.setItem('timelineXP', timelineXP.toString());

        // Update global XP
        const currentXP = parseInt(localStorage.getItem('userXP') || '0');
        localStorage.setItem('userXP', (currentXP + xpEarned).toString());

        alert(`✅ CHÍNH XÁC!\n\n💡 ${event.quiz.explanation}\n\n⭐ +${xpEarned} XP!`);

        // Update stats and re-render
        document.getElementById('eventsExplored').textContent = exploredEvents.size;
        document.getElementById('timelineXP').textContent = timelineXP;
        document.getElementById('currentPeriod').textContent = event.period;
        renderTimeline();
    } else {
        // Wrong answer
        alert(`❌ Chưa đúng!\n\n💡 Đáp án: ${event.quiz.options[event.quiz.correct]}\n\n${event.quiz.explanation}\n\nHãy thử lại nhé!`);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
} else {
    initTimeline();
}
