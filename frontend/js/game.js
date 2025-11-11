/**
 * GAME ZONE - JavaScript for Gaming Features
 * Handles Quiz, Daily Missions, and Leaderboard
 */

// Game State
const gameState = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeStarted: null,
    selectedAnswer: null,
    quizCompleted: false,
    selectedTopic: null,
    topicsData: null
};

// Local Storage Keys
const STORAGE_KEYS = {
    USER_STATS: 'userStats',
    DAILY_MISSIONS: 'dailyMissions',
    LEADERBOARD: 'leaderboard',
    LAST_QUIZ_DATE: 'lastQuizDate',
    LEARNING_STREAK: 'learningStreak'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    loadUserStats();
    setupEventListeners();
});

/**
 * Initialize game components
 */
function initializeGame() {
    // Load learning streak
    loadLearningStreak();

    // Load missions
    loadDailyMissions();

    // Load leaderboard
    loadLeaderboard();

    // Update user progress display
    updateUserProgress();
}

/**
 * Check if user is currently in an active quiz
 */
function isInActiveQuiz() {
    return gameState.currentQuiz !== null &&
           !gameState.quizCompleted &&
           gameState.currentQuestionIndex > 0;
}

/**
 * Show confirmation dialog with custom message
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Quiz card click - show topic selection
    const quizCard = document.querySelector('.game-card[data-game="quiz"]');
    if (quizCard) {
        quizCard.addEventListener('click', showTopicSelection);
    }

    // Back to menu buttons
    const backBtns = ['backToMenu', 'backToMenuFromTopic'];
    backBtns.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handleBackToMenu();
            });
        }
    });

    // Back to topics button
    const backToTopicsBtn = document.getElementById('backToTopics');
    if (backToTopicsBtn) {
        backToTopicsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleBackToTopics();
        });
    }
}

/**
 * Handle back to menu with confirmation if needed
 */
function handleBackToMenu() {
    if (isInActiveQuiz()) {
        const confirmed = confirmAction(
            '⚠️ Bạn đang làm quiz!\n\n' +
            'Nếu thoát bây giờ, tiến độ sẽ bị mất.\n' +
            'Bạn có chắc muốn thoát?'
        );
        if (!confirmed) return;
    }
    showGameMenu();
}

/**
 * Handle back to topics with confirmation if needed
 */
function handleBackToTopics() {
    if (isInActiveQuiz()) {
        const confirmed = confirmAction(
            '⚠️ Bạn đang làm quiz!\n\n' +
            'Nếu quay lại chọn chủ đề, tiến độ sẽ bị mất.\n' +
            'Bạn có chắc muốn quay lại?'
        );
        if (!confirmed) return;
    }
    showTopicSelectionAndReset();
}

/**
 * Show topic selection screen
 */
async function showTopicSelection(resetState = false) {
    try {
        // Load topics data if not already loaded
        if (!gameState.topicsData) {
            const response = await fetch('/data/quiz_questions_by_topic.json');
            gameState.topicsData = await response.json();
        }

        // Reset quiz state if needed
        if (resetState) {
            resetQuizState();
        }

        // Hide game menu, show quiz container with topic selection
        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'block';
        document.getElementById('topicSelection').style.display = 'block';
        document.getElementById('quizPlayScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'none';

        // Render topics
        renderTopics();

    } catch (error) {
        console.error('Error loading topics:', error);
        showNotification('Không thể tải chủ đề!');
    }
}

/**
 * Show topic selection and reset quiz state
 */
async function showTopicSelectionAndReset() {
    await showTopicSelection(true);
}

/**
 * Reset quiz state
 */
function resetQuizState() {
    gameState.currentQuiz = null;
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.selectedAnswer = null;
    gameState.quizCompleted = false;
    gameState.timeStarted = null;
}

/**
 * Render topic cards
 */
function renderTopics() {
    const topicGrid = document.getElementById('topicGrid');
    topicGrid.innerHTML = '';

    const topics = gameState.topicsData.topics;

    Object.keys(topics).forEach(topicKey => {
        const topic = topics[topicKey];

        // Count questions for this topic
        const questionCount = gameState.topicsData.questions.filter(
            q => q.topic === topicKey
        ).length;

        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';
        topicCard.style.cssText = `
            cursor: pointer;
            transition: all 0.3s ease;
            --topic-color: ${topic.color};
        `;
        topicCard.innerHTML = `
            <div class="topic-card-header">
                <div class="topic-icon">${topic.icon}</div>
                <div class="topic-badge" style="background: linear-gradient(135deg, ${topic.color}30, ${topic.color}15); border-color: ${topic.color}50;">
                    <span class="topic-badge-count">${questionCount}</span>
                    <span class="topic-badge-label">câu hỏi</span>
                </div>
            </div>
            <div class="topic-card-body">
                <h3 class="topic-title" style="color: ${topic.color};">${topic.name}</h3>
                <p class="topic-description">${topic.description}</p>
            </div>
            <div class="topic-card-footer">
                <button class="topic-start-btn" style="background: linear-gradient(135deg, ${topic.color}, ${topic.color}CC); border-color: ${topic.color};">
                    <span>Bắt đầu</span>
                    <span class="topic-arrow">→</span>
                </button>
            </div>
        `;

        topicCard.addEventListener('click', () => startQuizWithTopic(topicKey));
        topicCard.addEventListener('mouseenter', () => {
            topicCard.style.borderColor = topic.color;
            topicCard.style.transform = 'translateY(-8px) scale(1.02)';
            topicCard.style.boxShadow = `0 15px 40px ${topic.color}50, 0 0 30px ${topic.color}30`;
        });
        topicCard.addEventListener('mouseleave', () => {
            topicCard.style.borderColor = 'rgba(212, 175, 55, 0.3)';
            topicCard.style.transform = 'translateY(0) scale(1)';
            topicCard.style.boxShadow = '';
        });

        topicGrid.appendChild(topicCard);
    });
}

/**
 * Start quiz with selected topic
 */
async function startQuizWithTopic(topicKey) {
    gameState.selectedTopic = topicKey;

    try {
        // Get questions for this topic
        let questions = gameState.topicsData.questions.filter(
            q => topicKey === 'mixed' ? true : q.topic === topicKey
        );

        // Shuffle and take 10 questions
        questions = shuffleArray(questions).slice(0, 10);

        if (questions.length < 5) {
            showNotification('Không đủ câu hỏi cho chủ đề này!');
            return;
        }

        // Create quiz data
        const topic = gameState.topicsData.topics[topicKey];
        const quizData = {
            title: `Quiz ${topic.name}`,
            topic: topicKey,
            questions: questions
        };

        // Initialize quiz state
        gameState.currentQuiz = quizData;
        gameState.currentQuestionIndex = 0;
        gameState.score = 0;
        gameState.correctAnswers = 0;
        gameState.wrongAnswers = 0;
        gameState.timeStarted = Date.now();
        gameState.quizCompleted = false;

        // Show quiz play screen
        document.getElementById('topicSelection').style.display = 'none';
        document.getElementById('quizPlayScreen').style.display = 'block';

        // Update topic display
        document.getElementById('currentTopicDisplay').innerHTML = `
            ${topic.name}
        `;

        // Display first question
        displayQuestion();

    } catch (error) {
        console.error('Error starting quiz:', error);
        showNotification('Không thể bắt đầu quiz!');
    }
}

/**
 * Shuffle array helper
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Start Quiz (deprecated - now uses topic selection)
 */
async function startQuiz() {
    showTopicSelection();
}

/**
 * Fetch quiz questions from API or use fallback
 */
async function fetchQuizQuestions() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: 'Lịch sử Việt Nam',
                difficulty: 'mixed',
                count: 10
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.quiz;

    } catch (error) {
        console.log('Using fallback quiz data');
        return getFallbackQuizData();
    }
}

/**
 * Get fallback quiz data
 */
function getFallbackQuizData() {
    return {
        title: 'Quiz Lịch Sử Việt Nam',
        questions: [
            {
                id: 1,
                question: 'Trận Bạch Đằng năm 938 do ai chỉ huy?',
                options: {
                    A: 'Ngô Quyền',
                    B: 'Trần Hưng Đạo',
                    C: 'Lý Thường Kiệt',
                    D: 'Lê Lợi'
                },
                correct: 'A',
                explanation: 'Ngô Quyền đã chỉ huy chiến thắng trong trận Bạch Đằng năm 938, đánh bại quân Nam Hán và lập nên nhà nước Đại Việt độc lập.',
                difficulty: 'easy'
            },
            {
                id: 2,
                question: 'Ai là người sáng lập ra triều đại nhà Lý?',
                options: {
                    A: 'Lý Thái Tổ',
                    B: 'Lý Thái Tông',
                    C: 'Lý Thánh Tông',
                    D: 'Lý Nhân Tông'
                },
                correct: 'A',
                explanation: 'Lý Công Uẩn (Lý Thái Tổ) là người sáng lập triều đại nhà Lý năm 1009 và dời đô về Thăng Long năm 1010.',
                difficulty: 'easy'
            },
            {
                id: 3,
                question: 'Trận Bạch Đằng lần thứ ba năm 1288 đánh bại quân xâm lược nào?',
                options: {
                    A: 'Quân Tống',
                    B: 'Quân Minh',
                    C: 'Quân Nguyên-Mông',
                    D: 'Quân Thanh'
                },
                correct: 'C',
                explanation: 'Trận Bạch Đằng năm 1288 do Trần Hưng Đạo chỉ huy đã đánh bại quân Nguyên-Mông, kết thúc cuộc kháng chiến chống Nguyên-Mông lần thứ ba.',
                difficulty: 'medium'
            },
            {
                id: 4,
                question: 'Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo?',
                options: {
                    A: 'Quang Trung',
                    B: 'Lê Lợi',
                    C: 'Nguyễn Huệ',
                    D: 'Trần Quốc Tuấn'
                },
                correct: 'B',
                explanation: 'Lê Lợi đã lãnh đạo cuộc khởi nghĩa Lam Sơn (1418-1427) chống quân Minh xâm lược và thành lập triều đại nhà Hậu Lê.',
                difficulty: 'easy'
            },
            {
                id: 5,
                question: 'Trận Ngọc Hồi - Đống Đa diễn ra vào năm nào?',
                options: {
                    A: '1785',
                    B: '1789',
                    C: '1802',
                    D: '1788'
                },
                correct: 'B',
                explanation: 'Trận Ngọc Hồi - Đống Đa diễn ra đêm giao thừa Tết Kỷ Dậu (1789), do Quang Trung chỉ huy đánh bại 29 vạn quân Thanh.',
                difficulty: 'medium'
            },
            {
                id: 6,
                question: 'Bác Hồ đọc Tuyên ngôn Độc lập vào ngày nào?',
                options: {
                    A: '30/4/1975',
                    B: '2/9/1945',
                    C: '19/8/1945',
                    D: '7/5/1954'
                },
                correct: 'B',
                explanation: 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, Hà Nội vào ngày 2/9/1945, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
                difficulty: 'easy'
            },
            {
                id: 7,
                question: 'Chiến dịch Điện Biên Phủ kết thúc vào ngày nào?',
                options: {
                    A: '7/5/1954',
                    B: '19/12/1946',
                    C: '30/4/1975',
                    D: '2/9/1945'
                },
                correct: 'A',
                explanation: 'Chiến dịch Điện Biên Phủ kết thúc ngày 7/5/1954 với chiến thắng lịch sử "lừng lẫy năm châu, chấn động địa cầu".',
                difficulty: 'easy'
            },
            {
                id: 8,
                question: 'Miền Nam được hoàn toàn giải phóng vào ngày nào?',
                options: {
                    A: '19/12/1946',
                    B: '7/5/1954',
                    C: '30/4/1975',
                    D: '2/9/1945'
                },
                correct: 'C',
                explanation: 'Ngày 30/4/1975, Sài Gòn được giải phóng hoàn toàn, đất nước thống nhất, chấm dứt cuộc chiến tranh kéo dài 30 năm.',
                difficulty: 'easy'
            },
            {
                id: 9,
                question: 'Thời kỳ Bắc thuộc của Việt Nam kéo dài bao lâu?',
                options: {
                    A: 'Khoảng 500 năm',
                    B: 'Khoảng 800 năm',
                    C: 'Khoảng 1000 năm',
                    D: 'Khoảng 1500 năm'
                },
                correct: 'C',
                explanation: 'Thời kỳ Bắc thuộc kéo dài khoảng 1000 năm (từ 111 TCN đến 938 SCN) với nhiều cuộc khởi nghĩa chống ách đô hộ.',
                difficulty: 'hard'
            },
            {
                id: 10,
                question: 'Ai được mệnh danh là "Anh hùng dân tộc" đánh giặc cứu nước?',
                options: {
                    A: 'Chỉ có Trần Hưng Đạo',
                    B: 'Chỉ có Quang Trung',
                    C: 'Chỉ có Lê Lợi',
                    D: 'Tất cả những người trên'
                },
                correct: 'D',
                explanation: 'Việt Nam có nhiều anh hùng dân tộc qua các thời kỳ lịch sử như Trần Hưng Đạo, Lê Lợi, Quang Trung... đều đã có công đánh giặc cứu nước.',
                difficulty: 'medium'
            }
        ]
    };
}

/**
 * Display current question
 */
function displayQuestion() {
    const quiz = gameState.currentQuiz;
    const questionIndex = gameState.currentQuestionIndex;
    const question = quiz.questions[questionIndex];

    // Update progress
    updateQuizProgress();

    // Get elements
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const questionDifficulty = document.getElementById('questionDifficulty');
    const optionsContainer = document.getElementById('optionsContainer');
    const explanationBox = document.getElementById('explanationBox');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Reset state
    gameState.selectedAnswer = null;
    if (explanationBox) explanationBox.classList.remove('show');
    if (nextBtn) nextBtn.disabled = true;

    // Update question info
    if (questionNumber) {
        questionNumber.textContent = `Câu hỏi ${questionIndex + 1}/${quiz.questions.length}`;
    }

    if (questionText) {
        questionText.textContent = question.question;
    }

    if (questionDifficulty) {
        questionDifficulty.className = `question-difficulty difficulty-${question.difficulty}`;
        const difficultyText = {
            easy: 'Dễ',
            medium: 'Trung bình',
            hard: 'Khó'
        };
        questionDifficulty.textContent = difficultyText[question.difficulty] || 'Trung bình';
    }

    // Render options
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        Object.entries(question.options).forEach(([key, value]) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.onclick = () => selectAnswer(key);
            optionBtn.innerHTML = `
                <span class="option-letter">${key}</span>
                <span class="option-text">${value}</span>
            `;
            optionsContainer.appendChild(optionBtn);
        });
    }

    // Update button visibility
    const isLastQuestion = questionIndex === quiz.questions.length - 1;
    if (nextBtn) nextBtn.style.display = isLastQuestion ? 'none' : 'block';
    if (submitBtn) submitBtn.style.display = isLastQuestion ? 'block' : 'none';
}

/**
 * Select answer
 */
function selectAnswer(answer) {
    if (gameState.selectedAnswer) return; // Already answered

    gameState.selectedAnswer = answer;
    const question = gameState.currentQuiz.questions[gameState.currentQuestionIndex];
    const isCorrect = answer === question.correct;

    // Update score
    if (isCorrect) {
        gameState.correctAnswers++;
        gameState.score += getQuestionScore(question.difficulty);
    } else {
        gameState.wrongAnswers++;
    }

    // Update UI
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        const letter = btn.querySelector('.option-letter').textContent;
        btn.disabled = true;

        if (letter === question.correct) {
            btn.classList.add('correct');
        } else if (letter === answer && !isCorrect) {
            btn.classList.add('wrong');
        }

        if (letter === answer) {
            btn.classList.add('selected');
        }
    });

    // Show explanation
    showExplanation(question.explanation, isCorrect);

    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    if (nextBtn) nextBtn.disabled = false;
    if (submitBtn) submitBtn.disabled = false;

    // Update stats
    updateQuizStats();
}

/**
 * Get score based on difficulty
 */
function getQuestionScore(difficulty) {
    const scores = {
        easy: 10,
        medium: 15,
        hard: 20
    };
    return scores[difficulty] || 10;
}

/**
 * Show explanation
 */
function showExplanation(text, isCorrect) {
    const explanationBox = document.getElementById('explanationBox');
    const explanationTitle = document.getElementById('explanationTitle');
    const explanationText = document.getElementById('explanationText');

    if (explanationBox && explanationTitle && explanationText) {
        explanationTitle.textContent = isCorrect ? '✅ Chính xác!' : '❌ Không chính xác';
        explanationText.textContent = text;
        explanationBox.classList.add('show');
    }
}

/**
 * Next question
 */
function nextQuestion() {
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex < gameState.currentQuiz.questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

/**
 * Submit quiz
 */
function submitQuiz() {
    gameState.quizCompleted = true;
    showResults();
}

/**
 * Show results
 */
function showResults() {
    const quizSection = document.getElementById('quizSection');
    const resultsScreen = document.getElementById('resultsScreen');

    if (!resultsScreen) return;

    // Hide quiz, show results
    if (quizSection) quizSection.style.display = 'none';
    resultsScreen.style.display = 'block';

    // Calculate stats
    const totalQuestions = gameState.currentQuiz.questions.length;
    const percentage = Math.round((gameState.correctAnswers / totalQuestions) * 100);
    const timeElapsed = Math.round((Date.now() - gameState.timeStarted) / 1000);
    const xpEarned = calculateXP(gameState.score, percentage);

    // Update results display
    document.getElementById('resultsScore').textContent = `${percentage}%`;
    document.getElementById('resultsMessage').textContent = getResultMessage(percentage);
    document.getElementById('correctCount').textContent = gameState.correctAnswers;
    document.getElementById('wrongCount').textContent = gameState.wrongAnswers;
    document.getElementById('totalScore').textContent = gameState.score;
    document.getElementById('timeSpent').textContent = `${timeElapsed}s`;
    document.getElementById('xpEarned').textContent = `+${xpEarned} XP`;

    // Save stats
    saveQuizStats(xpEarned);

    // Update missions
    updateMissionProgress('quiz', 1);

    // Record daily activity for streak
    recordDailyActivity();
}

/**
 * Get result message based on percentage
 */
function getResultMessage(percentage) {
    if (percentage >= 90) return '🎉 Xuất sắc! Bạn là bậc thầy lịch sử!';
    if (percentage >= 70) return '👏 Rất tốt! Kiến thức vững vàng!';
    if (percentage >= 50) return '👍 Khá đấy! Cần cố gắng thêm!';
    return '💪 Đừng nản chí! Hãy thử lại!';
}

/**
 * Calculate XP earned
 */
function calculateXP(score, percentage) {
    let xp = score;

    // Bonus for high percentage
    if (percentage >= 90) xp += 50;
    else if (percentage >= 70) xp += 30;
    else if (percentage >= 50) xp += 10;

    return xp;
}

/**
 * Update quiz progress bar
 */
function updateQuizProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = ((gameState.currentQuestionIndex + 1) / gameState.currentQuiz.questions.length) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

/**
 * Update quiz stats display
 */
function updateQuizStats() {
    const correctEl = document.getElementById('correctAnswers');
    const wrongEl = document.getElementById('wrongAnswers');
    const scoreEl = document.getElementById('currentScore');

    if (correctEl) correctEl.textContent = gameState.correctAnswers;
    if (wrongEl) wrongEl.textContent = gameState.wrongAnswers;
    if (scoreEl) scoreEl.textContent = gameState.score;
}

/**
 * Show quiz screen
 */
function showQuizScreen() {
    const gameMenu = document.getElementById('gameMenu');
    const quizContainer = document.getElementById('quizContainer');

    if (gameMenu) gameMenu.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
}

/**
 * Show game menu
 */
function showGameMenu() {
    const gameMenu = document.getElementById('gameMenu');
    const quizContainer = document.getElementById('quizContainer');

    if (gameMenu) gameMenu.style.display = 'block';
    if (quizContainer) quizContainer.style.display = 'none';

    // Reset quiz state
    resetQuizState();
}

/**
 * Restart quiz - give option to retry same topic or choose new topic
 */
function restartQuiz() {
    // If user just finished a quiz and has a topic selected, ask if they want to retry
    if (gameState.selectedTopic) {
        const topicName = gameState.topicsData?.topics[gameState.selectedTopic]?.name || 'cùng chủ đề';
        const retry = confirmAction(
            '🔄 Làm lại quiz?\n\n' +
            `Chọn "OK" để làm lại ${topicName}\n` +
            'Chọn "Cancel" để chọn chủ đề khác'
        );

        if (retry) {
            // Retry same topic
            startQuizWithTopic(gameState.selectedTopic);
        } else {
            // Choose new topic
            showTopicSelectionAndReset();
        }
    } else {
        // No topic selected, go to topic selection
        showTopicSelectionAndReset();
    }
}

/**
 * Handle exit quiz button with confirmation
 */
function handleExitQuiz() {
    if (isInActiveQuiz()) {
        const confirmed = confirmAction(
            '⚠️ Bạn đang làm quiz!\n\n' +
            'Nếu thoát bây giờ, tiến độ sẽ bị mất.\n' +
            'Bạn có chắc muốn thoát?'
        );
        if (!confirmed) return;
    }
    showGameMenu();
}

/**
 * Load daily missions
 */
function loadDailyMissions() {
    const missionsContainer = document.getElementById('missionsContainer');
    if (!missionsContainer) return;

    const missions = getDailyMissions();

    missionsContainer.innerHTML = missions.map(mission => `
        <div class="mission-card ${mission.completed ? 'mission-completed' : ''}">
            <div class="mission-icon">${mission.icon}</div>
            <div class="mission-info">
                <div class="mission-title">${mission.title}</div>
                <div class="mission-description">${mission.description}</div>
                <div class="mission-progress">
                    <div class="mission-progress-bar">
                        <div class="mission-progress-fill" style="width: ${mission.progress}%"></div>
                    </div>
                    <span class="mission-progress-text">${mission.current}/${mission.target}</span>
                </div>
            </div>
            <div class="mission-reward">
                <div class="mission-reward-value">+${mission.reward}</div>
                <div class="mission-reward-label">XP</div>
            </div>
        </div>
    `).join('');
}

/**
 * Get daily missions data
 */
function getDailyMissions() {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS);
    const today = new Date().toDateString();

    let missions = stored ? JSON.parse(stored) : null;

    // Reset if new day
    if (!missions || missions.date !== today) {
        missions = {
            date: today,
            list: [
                {
                    id: 'chat_3',
                    icon: '💬',
                    title: 'Trò chuyện 3 lượt',
                    description: 'Trò chuyện với nhân vật lịch sử 3 lần',
                    current: 0,
                    target: 3,
                    reward: 20,
                    completed: false
                },
                {
                    id: 'quiz_1',
                    icon: '❓',
                    title: 'Hoàn thành 1 quiz',
                    description: 'Hoàn thành một bài quiz bất kỳ',
                    current: 0,
                    target: 1,
                    reward: 30,
                    completed: false
                },
                {
                    id: 'explore_5',
                    icon: '⏰',
                    title: 'Khám phá 5 sự kiện',
                    description: 'Xem chi tiết 5 sự kiện lịch sử',
                    current: 0,
                    target: 5,
                    reward: 25,
                    completed: false
                }
            ]
        };
        localStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(missions));
    }

    // Calculate progress
    missions.list.forEach(mission => {
        mission.progress = (mission.current / mission.target) * 100;
    });

    return missions.list;
}

/**
 * Update mission progress
 */
function updateMissionProgress(type, amount) {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_MISSIONS);
    if (!stored) return;

    const missions = JSON.parse(stored);
    const missionMap = {
        chat: 'chat_3',
        quiz: 'quiz_1',
        explore: 'explore_5'
    };

    const missionId = missionMap[type];
    const mission = missions.list.find(m => m.id === missionId);

    if (mission && !mission.completed) {
        mission.current += amount;
        if (mission.current >= mission.target) {
            mission.current = mission.target;
            mission.completed = true;

            // Award XP
            addXP(mission.reward);

            // Show notification
            showNotification(`✅ Hoàn thành nhiệm vụ: ${mission.title}! +${mission.reward} XP`, 'success');

            // Record daily activity for streak
            recordDailyActivity();
        }

        localStorage.setItem(STORAGE_KEYS.DAILY_MISSIONS, JSON.stringify(missions));
        loadDailyMissions();
    }
}

/**
 * Load leaderboard
 */
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;

    const leaderboard = getLeaderboard();
    const currentUser = getCurrentUser();

    leaderboardList.innerHTML = leaderboard.map((player, index) => {
        const isCurrentUser = player.id === currentUser.id;
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                <div class="rank rank-${index + 1}">${index + 1}</div>
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-info">
                    <div class="player-name">${player.name}${isCurrentUser ? ' (Bạn)' : ''}</div>
                    <div class="player-level">Level ${player.level}</div>
                </div>
                <div class="player-score">
                    <div class="score-value">${player.xp.toLocaleString()}</div>
                    <div class="score-label">XP</div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Get leaderboard data
 */
function getLeaderboard() {
    const LEADERBOARD_VERSION = '2.1'; // Updated version for new realistic names
    const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    const storedVersion = localStorage.getItem('leaderboardVersion');

    // Force reset if version changed or no data
    if (stored && storedVersion === LEADERBOARD_VERSION) {
        return JSON.parse(stored);
    }

    // Generate mock leaderboard with realistic Vietnamese names
    const mockPlayers = [
        { id: 'user', name: 'Bạn', avatar: '👤', xp: 150, level: 2 },
        { id: '1', name: 'Vũ Thành Đạt', avatar: '🎓', xp: 850, level: 9 },
        { id: '2', name: 'Đặng Khánh Linh', avatar: '📚', xp: 720, level: 8 },
        { id: '3', name: 'Bùi Quang Huy', avatar: '⚔️', xp: 650, level: 7 },
        { id: '4', name: 'Mai Phương Thảo', avatar: '🏆', xp: 580, level: 6 },
        { id: '5', name: 'Trương Gia Bảo', avatar: '🎯', xp: 520, level: 6 },
    ];

    // Sort by XP
    mockPlayers.sort((a, b) => b.xp - a.xp);

    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(mockPlayers));
    localStorage.setItem('leaderboardVersion', LEADERBOARD_VERSION);
    return mockPlayers;
}

/**
 * Get current user
 */
function getCurrentUser() {
    const stats = getUserStats();
    return {
        id: 'user',
        name: 'Bạn',
        avatar: '👤',
        xp: stats.totalXP,
        level: stats.level
    };
}

/**
 * Get user stats from local storage
 */
function getUserStats() {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);

    if (stored) {
        return JSON.parse(stored);
    }

    // Initialize default stats
    const defaultStats = {
        totalXP: 0,
        level: 1,
        quizzesTaken: 0,
        totalScore: 0,
        correctAnswers: 0,
        wrongAnswers: 0
    };

    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(defaultStats));
    return defaultStats;
}

/**
 * Load user stats
 */
function loadUserStats() {
    const stats = getUserStats();
    updateUserProgress();
}

/**
 * Update user progress display
 */
function updateUserProgress() {
    const stats = getUserStats();

    // Update in header if elements exist
    const levelEl = document.getElementById('userLevel');
    const xpEl = document.getElementById('userXP');

    if (levelEl) levelEl.textContent = `Level ${stats.level}`;
    if (xpEl) xpEl.textContent = `${stats.totalXP} XP`;
}

/**
 * Save quiz stats
 */
async function saveQuizStats(xpEarned) {
    const stats = getUserStats();

    stats.quizzesTaken++;
    stats.totalScore += gameState.score;
    stats.correctAnswers += gameState.correctAnswers;
    stats.wrongAnswers += gameState.wrongAnswers;
    stats.totalXP += xpEarned;

    // Level up if needed
    const newLevel = Math.floor(stats.totalXP / 100) + 1;
    if (newLevel > stats.level) {
        stats.level = newLevel;
        showNotification(`🎉 Level Up! Bạn đạt level ${newLevel}!`, 'success');
    }

    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));

    // Update leaderboard
    updateLeaderboard(stats);

    // Track activity with server to sync XP
    const token = Auth.getToken();
    if (token) {
        try {
            const response = await API.trackActivity('quiz', {
                correct: gameState.correctAnswers,
                total: gameState.currentQuiz.questions.length
            });

            if (response && response.xp_earned > 0) {
                console.log(`✅ Quiz XP synced with server: +${response.xp_earned} XP`);
                if (response.leveled_up) {
                    showNotification(`🎉 Level Up! Level ${response.level}!`, 'success');
                }
                // Update status bar
                if (window.updateStatusBar) {
                    await updateStatusBar();
                }
            }
        } catch (error) {
            console.log('Failed to sync quiz XP with server', error);
        }
    }
}

/**
 * Add XP to user
 */
async function addXP(amount) {
    // Try to sync with server if logged in
    const token = Auth.getToken();
    if (token) {
        try {
            const response = await API.addXP(amount, 'game');
            if (response) {
                // Update local stats with server data
                const stats = getUserStats();
                stats.totalXP = response.current_xp;
                stats.level = response.level;

                if (response.leveled_up) {
                    showNotification(`🎉 Level Up! Bạn đạt level ${response.level}!`, 'success');
                }

                localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
                updateUserProgress();
                updateLeaderboard(stats);
                return;
            }
        } catch (error) {
            console.log('Failed to sync XP with server, using local storage', error);
        }
    }

    // Fallback to local storage
    const stats = getUserStats();
    stats.totalXP += amount;

    // Level up if needed
    const newLevel = Math.floor(stats.totalXP / 100) + 1;
    if (newLevel > stats.level) {
        stats.level = newLevel;
        showNotification(`🎉 Level Up! Bạn đạt level ${newLevel}!`, 'success');
    }

    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    updateUserProgress();
    updateLeaderboard(stats);
}

/**
 * Update leaderboard with current user
 */
function updateLeaderboard(stats) {
    const leaderboard = getLeaderboard();
    const userIndex = leaderboard.findIndex(p => p.id === 'user');

    if (userIndex !== -1) {
        leaderboard[userIndex].xp = stats.totalXP;
        leaderboard[userIndex].level = stats.level;
    }

    // Re-sort
    leaderboard.sort((a, b) => b.xp - a.xp);

    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    loadLeaderboard();
}

/**
 * Show loading state
 */
function showLoading() {
    // Implementation depends on your UI
    console.log('Loading...');
}

/**
 * Show error message
 */
function showError(message) {
    alert(message);
}

/**
 * Show notification
 * Compatible with main.js version - supports type parameter
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Simple implementation - can be enhanced with a toast library
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Set background color based on type
    let backgroundColor;
    let textColor;
    if (type === 'success') {
        backgroundColor = '#10b981'; // Green
        textColor = 'white';
    } else if (type === 'error') {
        backgroundColor = '#ef4444'; // Red
        textColor = 'white';
    } else {
        backgroundColor = 'linear-gradient(135deg, var(--gold), #b8941f)'; // Gold for info/default
        textColor = 'var(--dark-navy)';
    }

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: ${textColor};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * ============================================
 * LEARNING STREAK SYSTEM
 * ============================================
 */

/**
 * Get streak data from localStorage
 */
function getStreakData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.LEARNING_STREAK);

        if (stored) {
            const data = JSON.parse(stored);

            // Validate data structure
            if (data && typeof data === 'object') {
                // Ensure all required fields exist
                if (!data.milestones) {
                    data.milestones = {
                        '7': { achieved: false, claimed: false },
                        '14': { achieved: false, claimed: false },
                        '30': { achieved: false, claimed: false }
                    };
                }
                if (!data.streakHistory) data.streakHistory = {};
                if (typeof data.currentStreak !== 'number') data.currentStreak = 0;
                if (typeof data.longestStreak !== 'number') data.longestStreak = 0;

                return data;
            }
        }
    } catch (error) {
        console.error('Error parsing streak data:', error);
    }

    // Initialize default streak data
    const defaultStreak = {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        streakHistory: {},
        milestones: {
            '7': { achieved: false, claimed: false },
            '14': { achieved: false, claimed: false },
            '30': { achieved: false, claimed: false }
        }
    };

    try {
        localStorage.setItem(STORAGE_KEYS.LEARNING_STREAK, JSON.stringify(defaultStreak));
    } catch (error) {
        console.error('Error saving default streak data:', error);
    }

    return defaultStreak;
}

/**
 * Save streak data to localStorage
 */
function saveStreakData(streakData) {
    localStorage.setItem(STORAGE_KEYS.LEARNING_STREAK, JSON.stringify(streakData));
}

/**
 * Load and display learning streak
 */
function loadLearningStreak() {
    const streakData = getStreakData();
    checkAndUpdateStreak(streakData);
    renderStreak(streakData);
}

/**
 * Check and update streak based on last activity
 */
function checkAndUpdateStreak(streakData) {
    const today = new Date().toDateString();
    const lastDate = streakData.lastActivityDate;

    if (!lastDate) {
        // First time - no streak yet
        return;
    }

    const lastActivity = new Date(lastDate);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastActivity;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If more than 1 day passed, reset streak
    if (diffDays > 1) {
        streakData.currentStreak = 0;
        streakData.streakHistory = {};
        saveStreakData(streakData);
    }
}

/**
 * Render streak display
 */
function renderStreak(streakData) {
    try {
        // Update streak count
        const streakCount = document.getElementById('streakCount');
        const longestStreak = document.getElementById('longestStreak');

        if (streakCount) streakCount.textContent = streakData.currentStreak;
        if (longestStreak) longestStreak.textContent = streakData.longestStreak;

        // Render 7-day calendar
        renderStreakCalendar(streakData);

        // Update milestones
        updateMilestones(streakData);
    } catch (error) {
        console.error('Error rendering streak:', error);
    }
}

/**
 * Render 7-day streak calendar
 */
function renderStreakCalendar(streakData) {
    const calendar = document.getElementById('streakCalendar');
    if (!calendar) return;

    const today = new Date();
    const days = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date);
    }

    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    calendar.innerHTML = days.map(date => {
        const dateStr = date.toDateString();
        const isCompleted = streakData.streakHistory[dateStr] === true;
        const isToday = dateStr === today.toDateString();

        return `
            <div class="calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}">
                <div class="day-label">${dayNames[date.getDay()]}</div>
                <div class="day-icon">${isCompleted ? '✅' : '⭕'}</div>
                <div class="day-date">${date.getDate()}</div>
            </div>
        `;
    }).join('');
}

/**
 * Update milestone display
 */
function updateMilestones(streakData) {
    const milestones = ['7', '14', '30'];

    milestones.forEach(days => {
        const milestoneData = streakData.milestones[days];
        const statusEl = document.getElementById(`milestone${days}`);
        const cardEl = document.querySelector(`.milestone-card[data-days="${days}"]`);

        if (!statusEl || !cardEl) return;

        if (milestoneData.achieved && milestoneData.claimed) {
            statusEl.textContent = '✅';
            cardEl.classList.add('achieved');
        } else if (streakData.currentStreak >= parseInt(days)) {
            statusEl.textContent = '🎁';
            // Can claim reward
            cardEl.style.cursor = 'pointer';
            cardEl.onclick = () => claimMilestone(days);
        } else {
            statusEl.textContent = '🔒';
            cardEl.classList.remove('achieved');
        }
    });
}

/**
 * Record daily activity (called when user completes quiz/mission)
 */
function recordDailyActivity() {
    try {
        const streakData = getStreakData();
        const today = new Date().toDateString();
        const lastDate = streakData.lastActivityDate;

        // Already recorded today
        if (lastDate === today) {
            console.log('✅ Streak already recorded for today');
            return;
        }

        // Check if it's consecutive day
        if (lastDate) {
            const lastActivity = new Date(lastDate);
            const todayDate = new Date(today);
            const diffTime = todayDate - lastActivity;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day - increase streak
                streakData.currentStreak++;
                console.log('🔥 Consecutive day! Streak:', streakData.currentStreak);
            } else if (diffDays > 1) {
                // Missed days - reset streak
                console.log('⚠️ Missed', diffDays - 1, 'days. Resetting streak.');
                streakData.currentStreak = 1;
                streakData.streakHistory = {};
            }
        } else {
            // First day
            streakData.currentStreak = 1;
            console.log('🎉 First day! Streak started.');
        }

        // Update longest streak
        if (streakData.currentStreak > streakData.longestStreak) {
            streakData.longestStreak = streakData.currentStreak;
            console.log('🏆 New record! Longest streak:', streakData.longestStreak);
        }

        // Mark today as completed
        streakData.streakHistory[today] = true;
        streakData.lastActivityDate = today;

        // Check for milestone achievements
        checkMilestones(streakData);

        // Save and re-render
        saveStreakData(streakData);
        renderStreak(streakData);

        // Show streak notification
        if (streakData.currentStreak > 1) {
            showNotification(`🔥 Streak ${streakData.currentStreak} ngày! Tiếp tục phát huy!`, 'success');
        } else {
            showNotification(`🎉 Bắt đầu streak mới! Học hàng ngày để duy trì!`, 'info');
        }
    } catch (error) {
        console.error('❌ Error recording daily activity:', error);
        // Don't throw - just log the error so the app continues working
    }
}

/**
 * Check if any milestones are achieved
 */
function checkMilestones(streakData) {
    const milestones = { '7': 50, '14': 100, '30': 200 };

    Object.keys(milestones).forEach(days => {
        const milestone = streakData.milestones[days];

        if (!milestone.achieved && streakData.currentStreak >= parseInt(days)) {
            milestone.achieved = true;
            // Auto-show notification but don't claim yet
            showNotification(`🏆 Mốc ${days} ngày đạt được! Click để nhận thưởng!`, 'success');
        }
    });
}

/**
 * Claim milestone reward
 */
function claimMilestone(days) {
    try {
        const streakData = getStreakData();
        const milestone = streakData.milestones[days];

        if (!milestone) {
            console.error('Milestone not found:', days);
            return;
        }

        const rewards = { '7': 50, '14': 100, '30': 200 };
        const titles = {
            '7': 'Người học chăm chỉ',
            '14': 'Nhà sử học nhí',
            '30': 'Bậc thầy lịch sử'
        };

        if (milestone.achieved && !milestone.claimed) {
            // Claim reward
            milestone.claimed = true;
            const xp = rewards[days];

            console.log(`🎁 Claiming milestone ${days} days: +${xp} XP`);

            addXP(xp);
            saveStreakData(streakData);
            renderStreak(streakData);

            showNotification(`🎉 Nhận ${xp} XP! Huy hiệu "${titles[days]}" đã mở khóa!`, 'success');
        } else if (milestone.claimed) {
            showNotification('Bạn đã nhận thưởng này rồi!', 'info');
        } else {
            showNotification(`Cần đạt streak ${days} ngày để mở khóa!`, 'info');
        }
    } catch (error) {
        console.error('Error claiming milestone:', error);
        showNotification('Lỗi khi nhận thưởng. Vui lòng thử lại!', 'error');
    }
}

// Make functions available globally
window.startQuiz = startQuiz;
window.nextQuestion = nextQuestion;
window.submitQuiz = submitQuiz;
window.restartQuiz = restartQuiz;
window.showGameMenu = showGameMenu;
window.handleExitQuiz = handleExitQuiz;
