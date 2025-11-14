/**
 * Historical Card Collection System
 * Thu thập thẻ bài lịch sử - Gamification feature
 */

// Historical figures data for cards
const HISTORICAL_CARDS = [
    // Common Cards (⭐)
    { id: 1, name: "Hai Bà Trưng", icon: "⚔️", period: "40-43", rarity: "⭐⭐⭐" },
    { id: 2, name: "Ngô Quyền", icon: "🛡️", period: "897-944", rarity: "⭐⭐⭐" },
    { id: 3, name: "Lý Công Uẩn", icon: "👑", period: "974-1028", rarity: "⭐⭐⭐" },
    { id: 4, name: "Trần Hưng Đạo", icon: "⚔️", period: "1228-1300", rarity: "⭐⭐⭐" },
    { id: 5, name: "Lê Lợi", icon: "🗡️", period: "1385-1433", rarity: "⭐⭐⭐" },
    { id: 6, name: "Nguyễn Trãi", icon: "📜", period: "1380-1442", rarity: "⭐⭐" },
    { id: 7, name: "Quang Trung", icon: "🐉", period: "1753-1792", rarity: "⭐⭐⭐⭐" },
    { id: 8, name: "Hồ Chí Minh", icon: "⭐", period: "1890-1969", rarity: "⭐⭐⭐⭐⭐" },
    { id: 9, name: "Võ Nguyên Giáp", icon: "🎖️", period: "1911-2013", rarity: "⭐⭐⭐⭐" },
    { id: 10, name: "Bà Triệu", icon: "⚔️", period: "248", rarity: "⭐⭐⭐" },
    { id: 11, name: "Lý Thường Kiệt", icon: "🗡️", period: "1019-1105", rarity: "⭐⭐" },
    { id: 12, name: "Đinh Bộ Lĩnh", icon: "👑", period: "924-979", rarity: "⭐⭐" },
];

// User's card collection (stored in localStorage)
let userCards = [];
let cardPacks = 3; // Free packs for new users

// Initialize card collection
function initCardCollection() {
    const saved = localStorage.getItem('historicalCards');
    if (saved) {
        userCards = JSON.parse(saved);
    }

    const savedPacks = localStorage.getItem('cardPacks');
    if (savedPacks !== null) {
        cardPacks = parseInt(savedPacks);
    }
}

// Open card collection modal
function openCardCollection() {
    initCardCollection();
    const modal = document.getElementById('cardCollectionModal');
    modal.style.display = 'flex';

    // Update stats
    document.getElementById('totalCards').textContent = userCards.length;
    document.getElementById('uniqueCards').textContent = new Set(userCards.map(c => c.id)).size;
    document.getElementById('cardPacks').textContent = cardPacks;

    // Render cards
    renderCardGrid();
}

// Close card collection modal
function closeCardCollection() {
    const modal = document.getElementById('cardCollectionModal');
    modal.style.display = 'none';
}

// Render card grid
function renderCardGrid() {
    const grid = document.getElementById('cardGrid');

    if (userCards.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-gray);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎴</div>
                <p style="font-size: 1.2rem;">Bạn chưa có thẻ nào!</p>
                <p>Mở gói thẻ đầu tiên của bạn để bắt đầu bộ sưu tập!</p>
            </div>
        `;
        return;
    }

    // Group cards by ID and count duplicates
    const cardCounts = userCards.reduce((acc, card) => {
        acc[card.id] = (acc[card.id] || 0) + 1;
        return acc;
    }, {});

    // Render unique cards with count
    const uniqueCards = Array.from(new Set(userCards.map(c => JSON.stringify(c)))).map(c => JSON.parse(c));

    grid.innerHTML = uniqueCards.map(card => `
        <div class="history-card" onclick="showCardDetails(${card.id})">
            <div class="card-rarity">${card.rarity}</div>
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-period">${card.period}</div>
            <div style="margin-top: 0.5rem; color: var(--gold); font-size: 0.9rem;">
                x${cardCounts[card.id]}
            </div>
        </div>
    `).join('');
}

// Open card pack (gacha system)
function openCardPack() {
    if (cardPacks <= 0) {
        alert('Bạn đã hết gói thẻ! Hoàn thành quiz để nhận thêm gói thẻ.');
        return;
    }

    // Deduct 1 pack
    cardPacks--;
    localStorage.setItem('cardPacks', cardPacks.toString());

    // Generate 5 random cards
    const newCards = [];
    for (let i = 0; i < 5; i++) {
        // Weighted random: 70% common, 20% rare, 10% legendary
        const rand = Math.random();
        let pool;

        if (rand < 0.7) {
            // Common cards (⭐⭐)
            pool = HISTORICAL_CARDS.filter(c => c.rarity === "⭐⭐" || c.rarity === "⭐⭐⭐");
        } else if (rand < 0.9) {
            // Rare cards (⭐⭐⭐⭐)
            pool = HISTORICAL_CARDS.filter(c => c.rarity === "⭐⭐⭐⭐");
        } else {
            // Legendary cards (⭐⭐⭐⭐⭐)
            pool = HISTORICAL_CARDS.filter(c => c.rarity === "⭐⭐⭐⭐⭐");
        }

        const card = pool[Math.floor(Math.random() * pool.length)];
        newCards.push(card);
        userCards.push(card);
    }

    // Save to localStorage
    localStorage.setItem('historicalCards', JSON.stringify(userCards));

    // Show pack opening animation
    showPackOpening(newCards);
}

// Show pack opening animation
function showPackOpening(cards) {
    const grid = document.getElementById('cardGrid');

    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s infinite;">🎁</div>
            <h3 style="color: var(--gold); font-size: 1.5rem; margin-bottom: 2rem;">Đang mở gói thẻ...</h3>
            <div class="card-grid" id="newCards" style="opacity: 0; transition: opacity 0.5s;">
                ${cards.map(card => `
                    <div class="history-card" style="animation: flipIn 0.6s forwards;">
                        <div class="card-rarity">${card.rarity}</div>
                        <div class="card-icon">${card.icon}</div>
                        <div class="card-name">${card.name}</div>
                        <div class="card-period">${card.period}</div>
                        <div style="margin-top: 0.5rem; color: #4caf50; font-weight: bold;">MỚI!</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Fade in new cards after 1 second
    setTimeout(() => {
        document.getElementById('newCards').style.opacity = '1';
    }, 1000);

    // Update stats
    setTimeout(() => {
        document.getElementById('totalCards').textContent = userCards.length;
        document.getElementById('uniqueCards').textContent = new Set(userCards.map(c => c.id)).size;
        document.getElementById('cardPacks').textContent = cardPacks;

        // Show button to go back to collection
        setTimeout(() => {
            grid.innerHTML += `
                <div style="grid-column: 1/-1; text-align: center; margin-top: 2rem;">
                    <button class="btn-quiz btn-primary" onclick="renderCardGrid()">
                        Xem bộ sưu tập
                    </button>
                </div>
            `;
        }, 2000);
    }, 1500);
}

// Show card details (placeholder - can expand later)
function showCardDetails(cardId) {
    const card = HISTORICAL_CARDS.find(c => c.id === cardId);
    if (!card) return;

    alert(`🎴 ${card.name}\n\nThời kỳ: ${card.period}\nĐộ hiếm: ${card.rarity}\n\n(Chi tiết thẻ sẽ được thêm vào phiên bản sau!)`);
}

// Award card pack after quiz completion
function awardCardPack() {
    cardPacks++;
    localStorage.setItem('cardPacks', cardPacks.toString());
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardCollection);
} else {
    initCardCollection();
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    @keyframes flipIn {
        0% {
            transform: rotateY(90deg);
            opacity: 0;
        }
        100% {
            transform: rotateY(0deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
