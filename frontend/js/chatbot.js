/**
 * VIỆT SỬ KÝ - Chatbot Page JavaScript
 */

// Auto-detect API URL based on environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'  // Local development
    : window.location.origin + '/api';  // Production (same domain)

window.API_BASE_URL = API_BASE_URL;
console.log('🚀 Chatbot.js loaded - API_BASE_URL:', API_BASE_URL);

// State management
let currentFigure = null;
let chatHistory = [];
let figures = [];

// DOM Elements (will be initialized after DOM loads)
let figuresList, figureProfile, chatMessages, chatInput, sendBtn, quickActions, clearChatBtn, figureSearch;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOMContentLoaded event fired');

    // Initialize DOM elements
    figuresList = document.getElementById('figures-list');
    figureProfile = document.getElementById('figure-profile');
    chatMessages = document.getElementById('chat-messages');
    chatInput = document.getElementById('chat-input');
    sendBtn = document.getElementById('send-btn');
    quickActions = document.getElementById('quick-actions');
    clearChatBtn = document.getElementById('clear-chat-btn');
    figureSearch = document.getElementById('figure-search');

    console.log('📋 DOM Elements:', {
        figuresList: !!figuresList,
        figureProfile: !!figureProfile,
        chatMessages: !!chatMessages,
        chatInput: !!chatInput,
        sendBtn: !!sendBtn
    });

    // Initialize
    try {
        initEventListeners();
        console.log('✅ Event listeners initialized');
    } catch (error) {
        console.error('❌ Error initializing event listeners:', error);
    }

    try {
        if (typeof updateStatusBar === 'function') {
            updateStatusBar();
            console.log('✅ Status bar updated');
        }
    } catch (error) {
        console.error('❌ Error updating status bar:', error);
    }

    try {
        loadFigures();
        console.log('✅ loadFigures() called');
    } catch (error) {
        console.error('❌ Error in loadFigures:', error);
    }

    try {
        checkSelectedFigure();
        console.log('✅ checkSelectedFigure() called');
    } catch (error) {
        console.error('❌ Error in checkSelectedFigure:', error);
    }
});

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Send button
    sendBtn.addEventListener('click', sendMessage);

    // Enter key to send
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Clear chat
    clearChatBtn.addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn xóa cuộc trò chuyện?')) {
            clearChat();
        }
    });

    // Figure search
    if (figureSearch) {
        figureSearch.addEventListener('input', debounce(filterFigures, 300));
    }
}

/**
 * Load historical figures
 */
async function loadFigures() {
    console.log('🔄 Loading figures...');
    console.log('📍 API_BASE_URL:', API_BASE_URL);
    console.log('📍 figuresList element:', figuresList);

    if (!figuresList) {
        console.error('❌ figuresList element not found!');
        return;
    }

    try {
        // Try to load from API
        let apiSuccess = false;
        try {
            const url = `${API_BASE_URL}/figures`;
            console.log('📡 Fetching from API:', url);

            // Check if API object exists
            if (typeof API === 'undefined' || typeof API.getFigures !== 'function') {
                throw new Error('API object not available');
            }

            const response = await API.getFigures();
            console.log('✅ API Response:', response);

            if (response && response.figures && Array.isArray(response.figures)) {
                figures = response.figures;
                apiSuccess = true;
                console.log(`✅ Loaded ${figures.length} figures from API`);
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (apiError) {
            console.warn('⚠️ API not available, using sample data:', apiError);
            // Fallback to sample data
            figures = getSampleFigures();
            console.log(`✅ Loaded ${figures.length} figures from fallback data`);
        }

        if (!figures || figures.length === 0) {
            console.error('❌ No figures loaded!');
            figuresList.innerHTML = '<div class="error-message" style="padding: 20px; text-align: center; color: #ff6b6b;">❌ Không thể tải danh sách nhân vật.<br>Vui lòng refresh trang (Ctrl+F5)</div>';
            return;
        }

        console.log('🎨 Displaying figures...');
        displayFigures(figures);
        console.log('✅ Figures displayed successfully');
    } catch (error) {
        console.error('❌ Error loading figures:', error);
        console.error('Error stack:', error.stack);

        // Show error in UI
        if (figuresList) {
            figuresList.innerHTML = `<div class="error-message" style="padding: 20px; text-align: center; color: #ff6b6b;">
                ❌ Lỗi: ${error.message}<br>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #FFD700; border: none; border-radius: 5px; cursor: pointer;">
                    Thử lại
                </button>
            </div>`;
        }

        if (typeof showNotification === 'function') {
            showNotification('Không thể tải danh sách nhân vật', 'error');
        }
    }
}

/**
 * Get sample figures (fallback data)
 */
function getSampleFigures() {
    return [
        {
            name: 'Hai Bà Trưng',
            period: 'Thời Đông Hán (40-43 SCN)',
            icon: '⚔️',
            description: 'Anh hùng dân tộc, khởi nghĩa chống Đông Hán'
        },
        {
            name: 'Trần Hưng Đạo',
            period: 'Nhà Trần (1228-1300)',
            icon: '👑',
            description: 'Đại tướng quân, đánh thắng quân Nguyên-Mông'
        },
        {
            name: 'Lê Lợi',
            period: 'Nhà Lê (1385-1433)',
            icon: '🗡️',
            description: 'Lãnh đạo khởi nghĩa Lam Sơn, dựng nên nhà Lê'
        },
        {
            name: 'Quang Trung (Nguyễn Huệ)',
            period: 'Tây Sơn (1753-1792)',
            icon: '🐉',
            description: 'Hoàng đế Tây Sơn, đánh thắng 29 vạn quân Thanh'
        },
        {
            name: 'Hồ Chí Minh',
            period: 'Thời hiện đại (1890-1969)',
            icon: '⭐',
            description: 'Chủ tịch nước, lãnh tụ cách mạng Việt Nam'
        },
        {
            name: 'Võ Nguyên Giáp',
            period: 'Thời hiện đại (1911-2013)',
            icon: '🎖️',
            description: 'Đại tướng, Tổng Tư lệnh Quân đội Nhân dân Việt Nam'
        }
    ];
}

/**
 * Display figures in sidebar
 */
function displayFigures(figuresToDisplay) {
    console.log('🎨 displayFigures called with', figuresToDisplay.length, 'figures');

    if (!figuresList) {
        console.error('❌ figuresList element not found!');
        return;
    }

    figuresList.innerHTML = '';

    if (figuresToDisplay.length === 0) {
        figuresList.innerHTML = '<div class="figure-item-loading"><p>Không tìm thấy nhân vật</p></div>';
        return;
    }

    figuresToDisplay.forEach((figure, index) => {
        const figureItem = document.createElement('div');
        figureItem.className = 'figure-item';
        if (currentFigure && currentFigure.name === figure.name) {
            figureItem.classList.add('active');
        }

        // Simple display without avatar for now (faster loading)
        figureItem.innerHTML = `
            <div class="figure-avatar-small">
                ${figure.icon || '👤'}
            </div>
            <div class="figure-info">
                <div class="figure-name">${escapeHtml(figure.name)}</div>
                <div class="figure-period">${escapeHtml(figure.period)}</div>
            </div>
        `;

        figureItem.addEventListener('click', () => selectFigure(figure));
        figuresList.appendChild(figureItem);

        if (index < 3) {
            console.log(`  ✓ Added figure ${index + 1}:`, figure.name);
        }
    });

    console.log(`✅ Displayed ${figuresToDisplay.length} figures in sidebar`);
}

/**
 * Filter figures by search term
 */
function filterFigures() {
    const searchTerm = figureSearch.value.toLowerCase().trim();

    if (!searchTerm) {
        displayFigures(figures);
        return;
    }

    const filtered = figures.filter(figure =>
        figure.name.toLowerCase().includes(searchTerm) ||
        figure.period.toLowerCase().includes(searchTerm)
    );

    displayFigures(filtered);
}

/**
 * Select a figure
 */
function selectFigure(figure) {
    console.log('👤 Selected figure:', figure.name);
    currentFigure = figure;

    // Update active state in sidebar
    document.querySelectorAll('.figure-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Show figure profile
    showFigureProfile(figure);

    // Clear previous chat
    clearChat(false);

    // Show quick actions
    quickActions.style.display = 'flex';

    // Send greeting message
    sendGreeting();

    // Add XP for visiting figure
    UserData.visitFigure(figure.name);
    updateStatusBar();
}

/**
 * Show figure profile
 */
function showFigureProfile(figure) {
    // Generate avatar HTML
    let avatarHtml;
    if (figure.avatar) {
        avatarHtml = `<img src="${figure.avatar}" alt="${escapeHtml(figure.name)}" class="avatar-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${figure.icon || '👤'}';">`;
    } else {
        avatarHtml = figure.icon || '👤';
    }

    figureProfile.innerHTML = `
        <div class="figure-profile-active">
            <div class="figure-avatar-large">${avatarHtml}</div>
            <div class="figure-details">
                <h2>${escapeHtml(figure.name)}</h2>
                <p>${escapeHtml(figure.period)}</p>
                ${figure.description ? `<p class="figure-description">${escapeHtml(figure.description)}</p>` : ''}
            </div>
        </div>
    `;
}

/**
 * Check if a figure was pre-selected (from home page)
 */
function checkSelectedFigure() {
    const selectedFigureName = localStorage.getItem('selectedFigure');
    if (selectedFigureName) {
        localStorage.removeItem('selectedFigure');

        // Wait for figures to load
        const checkInterval = setInterval(() => {
            if (figures.length > 0) {
                clearInterval(checkInterval);
                const figure = figures.find(f => f.name === selectedFigureName);
                if (figure) {
                    selectFigure(figure);

                    // Scroll to figure in sidebar
                    const figureItems = document.querySelectorAll('.figure-item');
                    figureItems.forEach(item => {
                        if (item.querySelector('.figure-name').textContent === selectedFigureName) {
                            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                }
            }
        }, 100);
    }
}

/**
 * Send greeting message
 */
async function sendGreeting() {
    const greetingMessage = `Xin chào ${currentFigure.name}! Tôi rất vinh dự được trò chuyện với ngài.`;

    // Add user message
    addMessage('user', greetingMessage);

    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        // Call API
        const response = await API.chat(greetingMessage, currentFigure.name);

        // Remove typing indicator
        removeTypingIndicator(typingId);

        // Add AI response
        if (response && response.message) {
            addMessage('assistant', response.message);
        } else {
            throw new Error('Invalid response');
        }
    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator(typingId);

        // Fallback response
        const fallbackResponse = `Xin chào! Ta là ${currentFigure.name}. Rất vui được gặp ngươi. Ngươi muốn hỏi ta về điều gì?`;
        addMessage('assistant', fallbackResponse);
    }
}

/**
 * Detect figure name from user message
 */
function detectFigureFromMessage(message) {
    const messageLower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Try to find a figure whose name is mentioned in the message
    for (const figure of figures) {
        const figureName = figure.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Check if message contains the figure name (fuzzy match)
        if (messageLower.includes(figureName) || figureName.includes(messageLower)) {
            return figure;
        }

        // Also check for partial matches (e.g., "võ trọng phụng" matches "Võ Trọng Phụng")
        const words = messageLower.split(/\s+/);
        const figureWords = figureName.split(/\s+/);
        let matchCount = 0;

        for (const word of words) {
            if (word.length > 2 && figureWords.some(fw => fw.includes(word) || word.includes(fw))) {
                matchCount++;
            }
        }

        // If more than half of the words match, consider it a match
        if (matchCount >= Math.min(2, Math.ceil(figureWords.length / 2))) {
            return figure;
        }
    }

    return null;
}

/**
 * Create message element (for streaming)
 */
function createMessageElement(role, content = '') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Generate avatar HTML
    let avatarHtml;
    if (role === 'user') {
        avatarHtml = '👤';
    } else if (currentFigure && currentFigure.avatar) {
        avatarHtml = `<img src="${currentFigure.avatar}" alt="${escapeHtml(currentFigure.name)}" class="avatar-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${currentFigure.icon || '🤖'}';">`;
    } else {
        avatarHtml = currentFigure ? (currentFigure.icon || '🤖') : '🤖';
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarHtml}</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(content)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    return messageDiv;
}

/**
 * Send message - UPGRADED: Auto-detect and roleplay without needing to select figure first
 */
async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) return;

    // Auto-detect figure from message if no figure is selected
    if (!currentFigure && figures.length > 0) {
        const detectedFigure = detectFigureFromMessage(message);
        if (detectedFigure) {
            console.log('🔍 Frontend detected figure from message:', detectedFigure.name);

            // Automatically select the detected figure
            currentFigure = detectedFigure;
            showFigureProfile(detectedFigure);
            quickActions.style.display = 'flex';

            // Update sidebar active state
            document.querySelectorAll('.figure-item').forEach(item => {
                const itemName = item.querySelector('.figure-name')?.textContent;
                if (itemName === detectedFigure.name) {
                    item.classList.add('active');
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    item.classList.remove('active');
                }
            });

            // Add XP for discovering figure
            UserData.visitFigure(detectedFigure.name);
            updateStatusBar();

            // Show notification
            if (typeof showNotification === 'function') {
                showNotification(`🎭 Đã chọn nhân vật: ${detectedFigure.name}`, 'success');
            }
        }
    }

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Add user message
    addMessage('user', message);

    // Disable input while processing
    chatInput.disabled = true;
    sendBtn.disabled = true;

    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
        console.log('📤 Sending streaming message to API:', {
            message: message.substring(0, 50) + '...',
            figure: currentFigure ? currentFigure.name : 'none',
            provider: 'gemini'
        });

        // Remove typing indicator first (we'll show real-time streaming instead)
        removeTypingIndicator(typingId);

        // Create AI message element for streaming
        let assistantMessageElement = null;
        let streamedText = '';
        let streamMetadata = null;

        // Call streaming API
        await API.chatStream(
            message,
            currentFigure ? currentFigure.name : null,
            null,
            // onChunk callback
            (chunk) => {
                if (chunk.type === 'metadata') {
                    streamMetadata = chunk.data;

                    // Check if backend detected a new figure
                    if (streamMetadata.figure && streamMetadata.figure !== currentFigure?.name) {
                        console.log('🔍 Backend detected figure:', streamMetadata.figure);
                        const detectedFigure = figures.find(f => f.name === streamMetadata.figure);
                        if (detectedFigure) {
                            currentFigure = detectedFigure;
                            showFigureProfile(detectedFigure);
                            quickActions.style.display = 'flex';

                            // Update sidebar active state
                            document.querySelectorAll('.figure-item').forEach(item => {
                                const itemName = item.querySelector('.figure-name')?.textContent;
                                if (itemName === streamMetadata.figure) {
                                    item.classList.add('active');
                                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                } else {
                                    item.classList.remove('active');
                                }
                            });

                            // Add XP for discovering figure
                            UserData.visitFigure(streamMetadata.figure);
                            updateStatusBar();
                        }
                    }
                } else if (chunk.type === 'chunk') {
                    streamedText += chunk.content;

                    // Create message element on first chunk
                    if (!assistantMessageElement) {
                        assistantMessageElement = createMessageElement('assistant', streamedText);
                        chatMessages.appendChild(assistantMessageElement);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    } else {
                        // Update existing message element
                        const bubbleElement = assistantMessageElement.querySelector('.message-bubble');
                        if (bubbleElement) {
                            bubbleElement.innerHTML = escapeHtml(streamedText);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }
                    }
                }
            },
            // onComplete callback
            (metadata) => {
                console.log('✅ Streaming completed');

                // Track chat activity and add XP
                if (currentFigure) {
                    console.log('🎯 Adding XP for chat with', currentFigure.name);
                    XPTracker.addXP(5, 'chat', { figure: currentFigure.name });
                } else {
                    console.log('🎯 Adding XP for general chat');
                    XPTracker.addXP(5, 'chat', {});
                }
            },
            // onError callback
            (error) => {
                console.error('❌ Streaming error:', error);

                // Show error message if no content was streamed
                if (!streamedText) {
                    const fallbackResponse = currentFigure
                        ? `Xin chào! Ta là ${currentFigure.name}. Xin lỗi, ta gặp chút vấn đề kỹ thuật. Hãy thử lại sau nhé!`
                        : 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau!';
                    addMessage('assistant', fallbackResponse);
                }
            }
        );

    } catch (error) {
        console.error('❌ Chat error:', error);
        removeTypingIndicator(typingId);

        // Fallback response
        const fallbackResponse = currentFigure
            ? `Xin chào! Ta là ${currentFigure.name}. Xin lỗi, ta gặp chút vấn đề kỹ thuật. Hãy thử lại sau nhé!`
            : 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau!';
        addMessage('assistant', fallbackResponse);
    } finally {
        // Re-enable input
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

/**
 * Get fallback response when API fails
 */
function getFallbackResponse(userMessage) {
    const responses = [
        `Đây là một câu hỏi hay! Tuy nhiên, ta cần thời gian để suy ngẫm. Ngươi có thể hỏi ta về điều khác không?`,
        `Ta hiểu ý ngươi, nhưng ta không thể trả lời ngay lúc này. Hãy thử hỏi về cuộc đời hay chiến công của ta.`,
        `Câu hỏi thú vị! Nhưng hãy để ta kể cho ngươi nghe về một sự kiện quan trọng trong cuộc đời ta...`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Add message to chat
 */
function addMessage(role, content) {
    // Remove welcome message if exists
    const welcomeMsg = chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Generate avatar HTML
    let avatarHtml;
    if (role === 'user') {
        avatarHtml = '👤';
    } else if (currentFigure && currentFigure.avatar) {
        avatarHtml = `<img src="${currentFigure.avatar}" alt="${escapeHtml(currentFigure.name)}" class="avatar-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${currentFigure.icon || '🤖'}';">`;
    } else {
        avatarHtml = currentFigure ? (currentFigure.icon || '🤖') : '🤖';
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarHtml}</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(content)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save to history
    chatHistory.push({ role, content, time });
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = typingId;

    // Generate avatar HTML
    let avatarHtml;
    if (currentFigure && currentFigure.avatar) {
        avatarHtml = `<img src="${currentFigure.avatar}" alt="${escapeHtml(currentFigure.name)}" class="avatar-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${currentFigure.icon || '🤖'}';">`;
    } else {
        avatarHtml = currentFigure ? (currentFigure.icon || '🤖') : '🤖';
    }

    typingDiv.innerHTML = `
        <div class="message-avatar">${avatarHtml}</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return typingId;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) {
        typingDiv.remove();
    }
}

/**
 * Clear chat
 */
function clearChat(resetFigure = true) {
    chatMessages.innerHTML = '';
    chatHistory = [];

    if (resetFigure) {
        currentFigure = null;
        quickActions.style.display = 'none';

        // Reset profile
        figureProfile.innerHTML = `
            <div class="profile-placeholder">
                <div class="placeholder-icon">💬</div>
                <h3>Chọn một nhân vật để bắt đầu</h3>
                <p>Chọn nhân vật từ danh sách bên trái hoặc nhập tên nhân vật bạn muốn trò chuyện</p>
            </div>
        `;

        // Remove active state
        document.querySelectorAll('.figure-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Show welcome message
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <h2>✨ ${resetFigure ? 'Chào mừng đến với Việt Sử Ký!' : 'Bắt đầu cuộc trò chuyện mới'}</h2>
        ${resetFigure ? `
            <p>Bạn có thể:</p>
            <ul>
                <li>💬 <strong>Gõ trực tiếp:</strong> "Xin chào Quang Trung" để chat ngay!</li>
                <li>📚 Hỏi về bất kỳ nhân vật lịch sử Việt Nam nào</li>
                <li>⏳ Du hành thời gian: "Đưa tôi đến năm 1945"</li>
                <li>⭐ Nhận XP và huy hiệu khi trò chuyện</li>
            </ul>
            <p><strong>Thử ngay: "Xin chào Hồ Chí Minh" hoặc "Kể về Trần Hưng Đạo"</strong></p>
        ` : ''}
    `;
    chatMessages.appendChild(welcomeDiv);
}

/**
 * Update status bar with user data
 */
function updateStatusBar() {
    const userData = UserData.get();

    document.getElementById('user-level').textContent = `Level ${userData.level}`;
    document.getElementById('user-xp').textContent = `${userData.xp} XP`;
    document.getElementById('user-badges').textContent = `${userData.badges.length} Huy hiệu`;
}

/**
 * Quick action buttons
 */
if (quickActions) {
    quickActions.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-action-btn')) {
            const action = e.target.textContent;
            chatInput.value = action;
            chatInput.focus();
        }
    });
}
