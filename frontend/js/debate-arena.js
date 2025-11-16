/**
 * Debate Arena - Đấu Trường Tranh Luận
 * AI-powered debates between historical figures
 */

// Available fighters (will be loaded from backend)
let availableFighters = [];

// Current debate state
let currentDebate = {
    fighter1: null,
    fighter2: null,
    topic: '',
    messages: []
};

// Initialize debate arena
async function initDebateArena() {
    try {
        // Fetch historical figures from backend
        const response = await fetch('/api/figures');
        const data = await response.json();

        if (data.success) {
            availableFighters = data.figures;
            populateFighterSelects();
        }
    } catch (error) {
        console.error('Error loading fighters:', error);
        // Fallback to local list if API fails
        availableFighters = [
            { name: "Hai Bà Trưng", icon: "⚔️" },
            { name: "Ngô Quyền", icon: "🛡️" },
            { name: "Trần Hưng Đạo", icon: "⚔️" },
            { name: "Lê Lợi", icon: "🗡️" },
            { name: "Quang Trung", icon: "🐉" },
            { name: "Hồ Chí Minh", icon: "⭐" },
            { name: "Võ Nguyên Giáp", icon: "🎖️" },
            { name: "Bà Triệu", icon: "🐘" },
            { name: "Lý Thường Kiệt", icon: "🗡️" },
            { name: "Nguyễn Trãi", icon: "📜" }
        ];
        populateFighterSelects();
    }
}

// Populate fighter select dropdowns
function populateFighterSelects() {
    const fighter1Select = document.getElementById('fighter1');
    const fighter2Select = document.getElementById('fighter2');

    const options = availableFighters.map(f =>
        `<option value="${f.name}">${f.icon || '👤'} ${f.name}</option>`
    ).join('');

    fighter1Select.innerHTML = '<option value="">-- Chọn nhân vật --</option>' + options;
    fighter2Select.innerHTML = '<option value="">-- Chọn nhân vật --</option>' + options;
}

// Open debate arena modal
function openDebateArena() {
    const modal = document.getElementById('debateModal');
    modal.style.display = 'flex';

    // Reset to setup screen
    resetDebate();
}

// Close debate arena modal
function closeDebateArena() {
    const modal = document.getElementById('debateModal');
    modal.style.display = 'none';
}

// Reset debate to setup screen
function resetDebate() {
    document.getElementById('debateSetup').style.display = 'block';
    document.getElementById('debateArena').style.display = 'none';

    document.getElementById('fighter1').value = '';
    document.getElementById('fighter2').value = '';
    document.getElementById('debateTopic').value = '';

    currentDebate = {
        fighter1: null,
        fighter2: null,
        topic: '',
        messages: []
    };
}

// Start debate
async function startDebate() {
    const fighter1Name = document.getElementById('fighter1').value;
    const fighter2Name = document.getElementById('fighter2').value;
    const topic = document.getElementById('debateTopic').value;

    // Validation
    if (!fighter1Name || !fighter2Name || !topic) {
        alert('⚠️ Vui lòng chọn đủ 2 nhân vật và chủ đề tranh luận!');
        return;
    }

    if (fighter1Name === fighter2Name) {
        alert('⚠️ Hãy chọn 2 nhân vật KHÁC NHAU để tranh luận!');
        return;
    }

    // Set current debate
    currentDebate.fighter1 = availableFighters.find(f => f.name === fighter1Name);
    currentDebate.fighter2 = availableFighters.find(f => f.name === fighter2Name);
    currentDebate.topic = topic;
    currentDebate.messages = [];

    // Show arena screen
    document.getElementById('debateSetup').style.display = 'none';
    document.getElementById('debateArena').style.display = 'block';

    // Show loading message
    const debateContent = document.getElementById('debateContent');
    debateContent.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 1.5s infinite;">⚡</div>
            <h3 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 1rem;">
                Đấu Trường Tranh Luận
            </h3>
            <p style="color: var(--text-gray); font-size: 1.1rem; margin-bottom: 2rem;">
                "${topic}"
            </p>
            <div style="display: flex; justify-content: space-around; align-items: center; margin: 2rem 0;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${currentDebate.fighter1.icon || '👤'}</div>
                    <div style="color: #3498db; font-size: 1.2rem; font-weight: bold;">${currentDebate.fighter1.name}</div>
                </div>
                <div style="font-size: 2rem; color: var(--gold);">⚔️</div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${currentDebate.fighter2.icon || '👤'}</div>
                    <div style="color: #e74c3c; font-size: 1.2rem; font-weight: bold;">${currentDebate.fighter2.name}</div>
                </div>
            </div>
            <div style="color: var(--text-gray); margin-top: 2rem;">
                <div class="loading-dots">Đang tạo cuộc tranh luận</div>
            </div>
        </div>
    `;

    // Generate debate
    await generateDebate();
}

// Generate debate using AI
async function generateDebate() {
    const debateContent = document.getElementById('debateContent');

    try {
        // Round 1: Fighter 1 opening statement
        const opening1 = await getDebateResponse(
            currentDebate.fighter1.name,
            `Ngài đang tham gia tranh luận về: "${currentDebate.topic}"

Hãy trình bày quan điểm của ngài (${currentDebate.fighter1.name}) dựa trên kinh nghiệm thực tế và tư tưởng của ngài.

YÊU CẦU:
- Nói ngắn gọn 3-4 câu
- Dùng ví dụ từ trận chiến/sự kiện lịch sử mà ngài đã trải qua
- Thể hiện tính cách và phong cách riêng của ngài

Hãy bắt đầu phát biểu!`
        );

        currentDebate.messages.push({
            fighter: currentDebate.fighter1.name,
            message: opening1,
            icon: currentDebate.fighter1.icon
        });

        renderDebateMessages();

        // Delay for dramatic effect
        await delay(3000);

        // Round 2: Fighter 2 opening statement
        const opening2 = await getDebateResponse(
            currentDebate.fighter2.name,
            `Ngài đang tham gia tranh luận về: "${currentDebate.topic}"

${currentDebate.fighter1.name} vừa nói:
"${opening1}"

Hãy trình bày quan điểm của ngài (${currentDebate.fighter2.name}):
- Có thể đồng ý hoặc phản bác ${currentDebate.fighter1.name}
- Nêu kinh nghiệm/chiến công của chính ngài
- 3-4 câu, thể hiện phong cách riêng

Ngài phản hồi như thế nào?`
        );

        currentDebate.messages.push({
            fighter: currentDebate.fighter2.name,
            message: opening2,
            icon: currentDebate.fighter2.icon
        });

        renderDebateMessages();

        await delay(3000);

        // Round 3: Fighter 1 counter-argument
        const counter1 = await getDebateResponse(
            currentDebate.fighter1.name,
            `Tiếp tục tranh luận về "${currentDebate.topic}"

${currentDebate.fighter2.name} vừa phản hồi:
"${opening2}"

Hãy đưa ra lập luận phản bác hoặc bổ sung:
- Bảo vệ quan điểm của ngài
- Hoặc chỉ ra điểm yếu trong lý lẽ của ${currentDebate.fighter2.name}
- Dùng ví dụ lịch sử cụ thể
- 3-4 câu

Ngài nói gì?`
        );

        currentDebate.messages.push({
            fighter: currentDebate.fighter1.name,
            message: counter1,
            icon: currentDebate.fighter1.icon
        });

        renderDebateMessages();

        await delay(3000);

        // Round 4: Fighter 2 closing statement
        const closing2 = await getDebateResponse(
            currentDebate.fighter2.name,
            `Vòng cuối - Kết luận tranh luận về "${currentDebate.topic}"

${currentDebate.fighter1.name} vừa phản bác:
"${counter1}"

Hãy đưa ra lời kết của ngài:
- Tổng hợp lại quan điểm chính
- Thừa nhận điểm hay của đối phương (nếu có)
- Nhấn mạnh bài học lịch sử
- 3-4 câu, kết thúc đanh thép!

Lời cuối của ngài:`
        );

        currentDebate.messages.push({
            fighter: currentDebate.fighter2.name,
            message: closing2,
            icon: currentDebate.fighter2.icon
        });

        renderDebateMessages();

        // Show completion message
        setTimeout(() => {
            debateContent.innerHTML += `
                <div style="text-align: center; padding: 2rem; margin-top: 2rem; background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(52, 152, 219, 0.2)); border-radius: 12px; border: 2px solid var(--gold);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🏆</div>
                    <h3 style="color: var(--gold); margin-bottom: 1rem;">Cuộc Tranh Luận Kết Thúc!</h3>
                    <p style="color: var(--text-gray);">Bạn vừa chứng kiến cuộc đối thoại lịch sử giữa ${currentDebate.fighter1.name} và ${currentDebate.fighter2.name}!</p>
                    <div style="margin-top: 1.5rem;">
                        <span style="color: #2ecc71; font-size: 1.2rem;">✨ +100 XP</span>
                    </div>
                </div>
            `;

            // Award XP
            const currentXP = parseInt(localStorage.getItem('userXP') || '0');
            localStorage.setItem('userXP', (currentXP + 100).toString());
        }, 1000);

    } catch (error) {
        console.error('Error generating debate:', error);
        debateContent.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #e74c3c;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="margin-bottom: 1rem;">Lỗi tạo tranh luận</h3>
                <p style="color: var(--text-gray);">Không thể kết nối với AI. Vui lòng thử lại!</p>
                <button class="btn-quiz btn-secondary" onclick="resetDebate()" style="margin-top: 1rem;">
                    ← Quay lại
                </button>
            </div>
        `;
    }
}

// Get debate response from AI
async function getDebateResponse(fighterName, promptText) {
    try {
        console.log(`[Debate] Fetching response from ${fighterName}...`);

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                figure_name: fighterName,
                message: promptText
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[Debate] Response from ${fighterName}:`, data);

        if (data.success && data.response) {
            return data.response;
        } else {
            throw new Error('Invalid response from API: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Error getting debate response:', error);
        // Better fallback with context
        const fallbackResponses = {
            "Hai Bà Trưng": "Thiếp cho rằng bảo vệ đất nước cần cả quyết tâm lẫn chiến thuật. Dân ta đã chống quân Hán bằng ý chí sắt đá!",
            "Ngô Quyền": "Ta tin rằng chiến thuật thông minh là chìa khóa. Nhìn trận Bạch Đằng là biết!",
            "Trần Hưng Đạo": "Lấy dân làm gốc! Không có dân, làm sao có quân? Đó là bài học ta rút ra qua ba lần chống Nguyên.",
            "Quang Trung": "Tốc chiến tốc thắng! Đánh địch khi chúng chưa kịp chuẩn bị, đó là nghệ thuật dụng binh!",
            "Lê Lợi": "Nhân nghĩa phải đi đôi với dũng lược. Ta đánh Minh không chỉ bằng gươm giáo mà còn bằng lòng dân!",
            "Hồ Chí Minh": "Không có gì quý hơn độc lập tự do. Nhưng để giữ được, cần đoàn kết toàn dân!",
            "Võ Nguyên Giáp": "Chiến tranh nhân dân, từng bước tiến lên! Điện Biên Phủ là minh chứng cho chiến lược đúng đắn.",
            "Bà Triệu": "Phụ nữ cũng có thể cầm đầu nghĩa quân! Ta muốn cưỡi voi chỉ huy, chứ không cam chịu nhục!",
            "Lý Thường Kiệt": "Sông núi nước Nam vua Nam ở! Đất nước này là của dân ta, không ai được xâm phạm!",
            "Nguyễn Trãi": "Văn và võ phải song hành. Bình Ngô Đại Cáo là minh chứng cho sức mạnh của ngòi bút!"
        };

        return fallbackResponses[fighterName] || `${fighterName}: Về vấn đề này, ta cần suy nghĩ kỹ hơn...`;
    }
}

// Render debate messages
function renderDebateMessages() {
    const debateContent = document.getElementById('debateContent');

    let html = `
        <div style="margin-bottom: 2rem; text-align: center;">
            <h3 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 0.5rem;">
                ${currentDebate.topic}
            </h3>
            <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 1rem;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem;">${currentDebate.fighter1.icon || '👤'}</div>
                    <div style="color: #3498db; font-weight: bold;">${currentDebate.fighter1.name}</div>
                </div>
                <div style="font-size: 1.5rem; color: var(--gold);">⚔️</div>
                <div style="text-align: center;">
                    <div style="font-size: 2rem;">${currentDebate.fighter2.icon || '👤'}</div>
                    <div style="color: #e74c3c; font-weight: bold;">${currentDebate.fighter2.name}</div>
                </div>
            </div>
        </div>
    `;

    // Render messages
    currentDebate.messages.forEach((msg, index) => {
        const isLeft = msg.fighter === currentDebate.fighter1.name;
        const color = isLeft ? '#3498db' : '#e74c3c';

        html += `
            <div class="debate-message" style="
                display: flex;
                justify-content: ${isLeft ? 'flex-start' : 'flex-end'};
                margin-bottom: 1.5rem;
                animation: slideIn 0.5s ease-out;
            ">
                <div style="
                    max-width: 70%;
                    background: linear-gradient(135deg, rgba(26, 35, 46, 0.95), rgba(44, 62, 80, 0.9));
                    border: 2px solid ${color};
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                ">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">${msg.icon || '👤'}</span>
                        <strong style="color: ${color};">${msg.fighter}</strong>
                    </div>
                    <p style="color: #ecf0f1; margin: 0; line-height: 1.6; font-size: 1rem;">
                        ${msg.message}
                    </p>
                </div>
            </div>
        `;
    });

    debateContent.innerHTML = html;

    // Scroll to bottom
    debateContent.scrollTop = debateContent.scrollHeight;
}

// Utility: Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebateArena);
} else {
    initDebateArena();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .loading-dots::after {
        content: '...';
        animation: dots 1.5s steps(4, end) infinite;
    }

    @keyframes dots {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60%, 100% { content: '...'; }
    }

    .debate-select {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        background: rgba(26, 35, 46, 0.9);
        border: 2px solid rgba(52, 152, 219, 0.3);
        border-radius: 8px;
        color: #ecf0f1;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .debate-select:hover {
        border-color: var(--gold);
    }

    .debate-select:focus {
        outline: none;
        border-color: var(--gold);
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
    }

    .debate-select option {
        background: #1a232e;
        color: #ecf0f1;
        padding: 0.5rem;
    }

    .debate-content {
        max-height: 500px;
        overflow-y: auto;
        padding: 1rem;
    }

    .debate-content::-webkit-scrollbar {
        width: 8px;
    }

    .debate-content::-webkit-scrollbar-track {
        background: rgba(26, 35, 46, 0.5);
        border-radius: 4px;
    }

    .debate-content::-webkit-scrollbar-thumb {
        background: var(--gold);
        border-radius: 4px;
    }

    .timeline-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 2rem;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(26, 35, 46, 0.8), rgba(44, 62, 80, 0.6));
        border-radius: 12px;
    }

    .timeline-stats .stat {
        text-align: center;
    }

    .timeline-stats .stat-value {
        font-size: 2rem;
        color: var(--gold);
        font-weight: bold;
        display: block;
        margin-bottom: 0.25rem;
    }

    .timeline-stats .stat-label {
        font-size: 0.9rem;
        color: var(--text-gray);
    }

    .timeline-container {
        max-height: 600px;
        overflow-y: auto;
        padding: 2rem 1rem;
    }

    .timeline-container::-webkit-scrollbar {
        width: 8px;
    }

    .timeline-container::-webkit-scrollbar-track {
        background: rgba(26, 35, 46, 0.5);
        border-radius: 4px;
    }

    .timeline-container::-webkit-scrollbar-thumb {
        background: var(--gold);
        border-radius: 4px;
    }
`;
document.head.appendChild(style);
