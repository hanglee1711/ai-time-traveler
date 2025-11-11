/**
 * VIỆT SỬ KÝ - Quiz Battle UI Controller
 * Game 3: Đấu Trí Lịch Sử
 * Connects UI with Game Engine
 */

// Global variables
let gameEngine = null;
let selectedDifficulty = null;
let questionStartTime = null;
let timerInterval = null;
let currentTime = 30;
let maxTime = 30; // Track max time for percentage calculation
let selectedCardIndex = null;
let isProcessingAnswer = false; // Prevent double submission

// DEBUG MODE - Hiển thị flow trên màn hình
const DEBUG = true;
function debugLog(message, step = '') {
    console.log(`[DEBUG${step ? ' ' + step : ''}] ${message}`);
    if (DEBUG) {
        const debugDiv = document.getElementById('debugLog') || createDebugDiv();
        const p = document.createElement('p');
        p.style.cssText = 'margin: 2px 0; font-size: 12px;';
        p.textContent = `[${new Date().toLocaleTimeString()}]${step ? ' ' + step : ''} ${message}`;
        debugDiv.appendChild(p);
        debugDiv.scrollTop = debugDiv.scrollHeight;
    }
}

function createDebugDiv() {
    const div = document.createElement('div');
    div.id = 'debugLog';
    div.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        width: 400px;
        height: 200px;
        background: rgba(0,0,0,0.9);
        color: #0f0;
        padding: 10px;
        border-radius: 8px;
        overflow-y: auto;
        font-family: monospace;
        font-size: 11px;
        z-index: 99999;
    `;
    document.body.appendChild(div);
    return div;
}

// Sound system
let soundManager = null;
let battleSounds = null;

// Animation system
let animationEngine = null;

// Smart AI
let smartAI = null;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const battleArena = document.getElementById('battleArena');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBattleBtn = document.getElementById('startBattleBtn');
const difficultyCards = document.querySelectorAll('.difficulty-card');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Quiz Battle UI initializing...');

    // Initialize sound system
    soundManager = new SoundManager();
    battleSounds = new QuizBattleSounds(soundManager);
    await battleSounds.init();
    console.log('Sound system ready');

    // Initialize animation engine
    animationEngine = new AnimationEngine();
    animationEngine.start();
    console.log('Animation engine ready');

    // Initialize Smart AI (will be set based on difficulty)
    console.log('Smart AI ready');

    // Setup difficulty selection
    difficultyCards.forEach(card => {
        card.addEventListener('click', () => selectDifficulty(card));
    });

    // Setup start button
    startBattleBtn.addEventListener('click', startBattle);

    // Setup game over buttons
    document.getElementById('playAgainBtn').addEventListener('click', resetGame);
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        window.location.href = 'game.html';
    });

    // Setup sound controls
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const masterVolume = document.getElementById('masterVolume');
    const volumeValue = document.getElementById('volumeValue');

    muteBtn.addEventListener('click', () => {
        if (soundManager) {
            const muted = soundManager.toggleMute();
            muteBtn.textContent = muted ? '🔇' : '🔊';
        }
    });

    muteBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
    });

    masterVolume.addEventListener('input', (e) => {
        if (soundManager) {
            const value = e.target.value / 100;
            soundManager.setVolume('master', value);
            volumeValue.textContent = e.target.value + '%';
        }
    });

    // Load game data and initialize engine
    try {
        const [questionsData, cardsData] = await Promise.all([
            fetch('data/quiz_battle_questions.json').then(r => r.json()).catch(() => fetch('../data/quiz_battle_questions.json').then(r => r.json())),
            fetch('data/quiz_battle_cards.json').then(r => r.json()).catch(() => fetch('../data/quiz_battle_cards.json').then(r => r.json()))
        ]);

        gameEngine = new QuizBattleEngine();
        await gameEngine.initialize(questionsData, cardsData);

        console.log('Game engine initialized successfully');
    } catch (error) {
        console.error('Error loading game data:', error);
        alert('Không thể tải dữ liệu game. Vui lòng thử lại!');
    }
});

/**
 * Select difficulty
 */
function selectDifficulty(card) {
    difficultyCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedDifficulty = card.dataset.difficulty;
    startBattleBtn.disabled = false;

    // Pulse animation on selected card
    if (animationEngine) {
        animationEngine.pulseElement(card, 1.05, 200);
    }
}

/**
 * Start battle
 */
async function startBattle() {
    if (!selectedDifficulty || !gameEngine) {
        return;
    }

    // Initialize Smart AI based on difficulty
    const aiPersonalities = {
        easy: 'defensive',
        medium: 'balanced',
        hard: 'aggressive'
    };
    smartAI = new SmartAI(aiPersonalities[selectedDifficulty] || 'balanced');
    console.log(`Smart AI initialized: ${aiPersonalities[selectedDifficulty]}`);

    // Play game start sound
    if (battleSounds) {
        battleSounds.playGameStart();
        battleSounds.playBattleBGM();
    }

    // Victory sparkles on start
    if (animationEngine) {
        animationEngine.createSparkles(startScreen, 1000);
    }

    // Hide start screen, show arena
    startScreen.style.display = 'none';
    battleArena.style.display = 'flex';

    // Start game
    const question = gameEngine.startGame(selectedDifficulty);

    // Update UI
    updatePlayerStats();
    updateOpponentStats();
    renderPlayerHand();
    displayQuestion(question);
}

/**
 * Display question
 */
function displayQuestion(question) {
    questionStartTime = Date.now();
    isProcessingAnswer = false; // Reset flag for new question

    // Update question info
    const categoryInfo = gameEngine.questions[0].category;
    const categoryData = Object.values(gameEngine.cardTypes)[0]; // Get first category for demo

    document.getElementById('turnNumber').textContent = question.turnNumber;
    document.getElementById('questionCategory').textContent = `${getCategoryIcon(question.category)} ${getCategoryName(question.category)}`;

    // Set difficulty styling
    const difficultyBadge = document.getElementById('questionDifficulty');
    difficultyBadge.textContent = getDifficultyText(question.difficulty);
    difficultyBadge.className = `question-difficulty ${question.difficulty}`;

    document.getElementById('questionText').textContent = question.question;

    // Hide explanation and next button
    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('nextTurnBtn').style.display = 'none';

    // Display answers
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const option = document.createElement('div');
        option.className = 'answer-option';
        option.textContent = answer;
        option.onclick = () => selectAnswer(index);
        answersContainer.appendChild(option);
    });

    // Apply 50-50 card effect if active (Card #1)
    const eliminateEffect = gameEngine.player.activeEffects.find(
        effect => effect.type === 'eliminate_answers'
    );
    if (eliminateEffect) {
        applyEliminateAnswers(question.correct, eliminateEffect.value);
    }

    // Apply Audience Poll effect if active (Card #3)
    const pollEffect = gameEngine.player.activeEffects.find(
        effect => effect.type === 'show_statistics'
    );
    if (pollEffect) {
        showAudiencePoll(question.correct);
    }

    // Start timer
    startTimer();
}

/**
 * Start timer
 */
function startTimer() {
    // Default timer duration
    currentTime = 30;
    maxTime = 30; // Reset max time

    // Check for add_time effect (Card #2 - Time Extend)
    const addTimeEffect = gameEngine.player.activeEffects.find(
        effect => effect.type === 'add_time'
    );
    if (addTimeEffect) {
        currentTime += addTimeEffect.value;
        maxTime += addTimeEffect.value; // Update max time
        showNotification(`⏰ +${addTimeEffect.value}s thời gian!`, 'success');
    }

    // Check for reduce_time effect from opponent (Card #6 - Psychological Warfare)
    const reduceTimeEffect = gameEngine.player.activeEffects.find(
        effect => effect.type === 'reduce_time'
    );
    if (reduceTimeEffect) {
        currentTime = Math.max(5, currentTime - reduceTimeEffect.value);
        maxTime = Math.max(5, maxTime - reduceTimeEffect.value); // Update max time
        showNotification(`😰 -${reduceTimeEffect.value}s thời gian! Đối thủ dùng Tâm Lý Chiến!`, 'warning');
    }

    updateTimerDisplay();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();

        if (currentTime <= 0) {
            clearInterval(timerInterval);
            // Auto-submit with no answer
            handleTimeout();
        }
    }, 1000);
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
    const timerFill = document.getElementById('timerFill');
    const timerText = document.getElementById('timerText');

    const percentage = (currentTime / maxTime) * 100; // Use maxTime instead of hardcoded 30
    timerFill.style.width = percentage + '%';
    timerText.textContent = currentTime + 's';

    // Change color based on time
    timerFill.classList.remove('warning', 'danger');
    if (currentTime <= 5) {
        timerFill.classList.add('danger');
        // Play warning sound at 5 seconds
        if (currentTime === 5 && battleSounds) {
            battleSounds.playTimeWarning();
        }
    } else if (currentTime <= 10) {
        timerFill.classList.add('warning');
        // Play warning sound at 10 seconds
        if (currentTime === 10 && battleSounds) {
            battleSounds.playTimeWarning();
        }
    }
}

/**
 * Handle timeout (no answer selected)
 */
async function handleTimeout() {
    // Prevent double processing
    if (isProcessingAnswer) {
        console.log('⚠️ Already processing answer, ignoring timeout...');
        return;
    }
    isProcessingAnswer = true;

    const options = document.querySelectorAll('.answer-option');
    options.forEach(opt => opt.classList.add('disabled'));

    // Play timeout sound
    if (battleSounds) {
        battleSounds.playTimeUp();
    }

    showNotification('Hết giờ! Bạn không trả lời kịp.', 'error');

    // Process as wrong answer (use answer index -1 to indicate timeout)
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    // Get the correct answer to show
    const question = gameEngine.getCurrentQuestion();

    // Process as wrong answer (pick wrong answer index)
    const wrongIndex = question.correct === 0 ? 1 : 0;
    const result = await gameEngine.processAnswer(wrongIndex, timeSpent);

    // Show result
    setTimeout(() => {
        displayAnswerResult(result, -1); // -1 means no selection
    }, 500);
}

/**
 * Select answer
 */
async function selectAnswer(index) {
    console.log('✅ selectAnswer called, index:', index);
    debugLog(`selectAnswer(${index}) called`, 'STEP 1');

    // Prevent double submission
    if (isProcessingAnswer) {
        console.log('⚠️ Already processing answer, ignoring...');
        return;
    }
    isProcessingAnswer = true;

    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const timeSpent = (Date.now() - questionStartTime) / 1000;

    // Disable all options
    const options = document.querySelectorAll('.answer-option');
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === index) {
            opt.classList.add('selected');
        }
    });

    // Process answer
    console.log('⏳ Calling processAnswer...');
    const result = await gameEngine.processAnswer(index, timeSpent);
    console.log('✅ processAnswer result:', result);

    // Play sound based on result
    if (battleSounds) {
        if (result.isCorrect) {
            battleSounds.playAnswerCorrect();
        } else {
            battleSounds.playAnswerWrong();
        }
    }

    // Show result
    console.log('⏰ Scheduling displayAnswerResult in 500ms...');
    debugLog('Will call displayAnswerResult in 0.5s', 'STEP 2');
    setTimeout(() => {
        console.log('🎯 Calling displayAnswerResult');
        debugLog('Calling displayAnswerResult() NOW', 'STEP 2.5');
        displayAnswerResult(result, index);
    }, 500);
}

/**
 * Display answer result
 */
async function displayAnswerResult(result, selectedIndex) {
    try {
        console.log('📊 displayAnswerResult called, result:', result);

        const options = document.querySelectorAll('.answer-option');

        // Highlight correct/wrong answers
        options.forEach((opt, i) => {
            if (i === result.correctAnswer) {
                opt.classList.add('correct');
            } else if (selectedIndex !== -1 && i === selectedIndex && !result.isCorrect) {
                // Only highlight wrong answer if user selected one (not timeout)
                opt.classList.add('wrong');
            }
        });

        // Show explanation
        const explanationBox = document.getElementById('explanationBox');
        const explanationText = document.getElementById('explanationText');
        explanationText.textContent = result.explanation;
        explanationBox.style.display = 'block';

        // Update stats
        updatePlayerStats();
        updateOpponentStats();

        // Show effects if any
        if (result.effects && result.effects.length > 0) {
            showEffects(result.effects);
        }

        // Wait then let AI take turn
        console.log('⏰ Scheduling opponentTakeTurn in 2000ms...');
        debugLog('⏰ Will call opponentTakeTurn in 2s', 'STEP 3');
        setTimeout(async () => {
            try {
                console.log('🤖 Calling opponentTakeTurn');
                debugLog('🤖 Calling opponentTakeTurn NOW', 'STEP 4');
                await opponentTakeTurn();
            } catch (error) {
                console.error('❌ Error in opponentTakeTurn:', error);
                console.error('Stack:', error.stack);
                // Force continue to next turn even if error
                showNotification('Lỗi AI, tự động chuyển câu...', 'error');
                setTimeout(() => {
                    nextTurn();
                }, 1000);
            }
        }, 2000);
    } catch (error) {
        console.error('❌ Error in displayAnswerResult:', error);
        console.error('Stack:', error.stack);
        // Force continue
        showNotification('Lỗi hiển thị, tự động tiếp tục...', 'error');
        setTimeout(() => {
            opponentTakeTurn().catch(err => {
                console.error('Recovery failed:', err);
                nextTurn();
            });
        }, 1000);
    }
}

/**
 * Opponent takes turn
 */
async function opponentTakeTurn() {
    try {
        console.log('🤖 opponentTakeTurn started');
        debugLog('opponentTakeTurn() STARTED', 'STEP 5');
        showNotification('Lượt của AI đối thủ...', 'info');

        console.log('⏳ Calling gameEngine.opponentTurn...');
        debugLog('Calling gameEngine.opponentTurn()', 'STEP 6');
        const result = await gameEngine.opponentTurn();
        console.log('✅ AI result:', result);
        debugLog('AI result received: ' + JSON.stringify(result), 'STEP 7');

        // Show AI result
        if (result.cardUsed) {
            showNotification(`AI sử dụng ${result.cardUsed}!`, 'warning');
        }

        if (result.isCorrect) {
            showNotification('AI trả lời đúng! +' + result.score + ' điểm', 'success');
        } else {
            showNotification('AI trả lời sai!', 'error');
        }

        // Update stats
        updatePlayerStats();
        updateOpponentStats();

        // Auto-advance to next turn after showing AI result
        console.log('⏰ Scheduling nextTurn in 2500ms...');
        debugLog('Will call nextTurn in 2.5s', 'STEP 8');
        setTimeout(() => {
            try {
                console.log('➡️ Calling nextTurn');
                debugLog('Calling nextTurn() NOW', 'STEP 9');
                nextTurn();
            } catch (error) {
                console.error('❌ Error in nextTurn:', error);
                console.error('Stack:', error.stack);
                showNotification('Lỗi chuyển câu!', 'error');
            }
        }, 2500); // Give 2.5s to see AI result
    } catch (error) {
        console.error('❌ Error in opponentTakeTurn:', error);
        console.error('Stack:', error.stack);
        // Force advance anyway
        showNotification('Lỗi AI, tự động chuyển câu...', 'error');
        setTimeout(() => {
            try {
                nextTurn();
            } catch (err) {
                console.error('Recovery nextTurn failed:', err);
            }
        }, 1000);
    }
}

/**
 * Next turn
 */
function nextTurn() {
    console.log('➡️ nextTurn called');

    // Hide next turn button if visible
    document.getElementById('nextTurnBtn').style.display = 'none';

    console.log('⏳ Calling gameEngine.nextQuestion...');
    const result = gameEngine.nextQuestion();
    console.log('✅ nextQuestion result:', result);

    if (result.gameOver) {
        console.log('🏁 Game Over!');
        showGameOver(result.result);
    } else {
        console.log('🎮 Next question starting...');

        // Play turn start sound
        if (battleSounds) {
            battleSounds.playTurnStart();
        }

        // Check if energy was gained
        if (gameEngine.player.energy > 0 && battleSounds) {
            battleSounds.playEnergyGain();
        }

        renderPlayerHand();
        displayQuestion(result.question);
    }
}

/**
 * Update player stats
 */
function updatePlayerStats() {
    const player = gameEngine.player;

    // HP with heal detection
    const currentHP = parseInt(document.getElementById('playerHpText').textContent.split('/')[0]) || player.hp;
    if (player.hp > currentHP && battleSounds) {
        battleSounds.playHeal();
    }

    const hpPercentage = (player.hp / player.maxHp) * 100;
    document.getElementById('playerHpFill').style.width = hpPercentage + '%';
    document.getElementById('playerHpText').textContent = `${player.hp}/${player.maxHp}`;

    // Energy
    document.getElementById('playerEnergy').textContent = player.energy;

    // Shield with sound
    const currentShield = parseInt(document.getElementById('playerShield').textContent) || 0;
    if (player.shield > currentShield && battleSounds) {
        battleSounds.playShield();
    }
    document.getElementById('playerShield').textContent = player.shield;

    // Score
    document.getElementById('playerScore').textContent = player.score;
}

/**
 * Update opponent stats
 */
function updateOpponentStats() {
    const opponent = gameEngine.opponent;

    // HP
    const hpPercentage = (opponent.hp / opponent.maxHp) * 100;
    document.getElementById('opponentHpFill').style.width = hpPercentage + '%';
    document.getElementById('opponentHpText').textContent = `${opponent.hp}/${opponent.maxHp}`;

    // Energy
    document.getElementById('opponentEnergy').textContent = opponent.energy;

    // Shield
    document.getElementById('opponentShield').textContent = opponent.shield;

    // Score
    document.getElementById('opponentScore').textContent = opponent.score;
}

/**
 * Render player hand
 */
function renderPlayerHand() {
    const handContainer = document.getElementById('playerHand');
    const previousHandSize = handContainer.children.length;
    handContainer.innerHTML = '';

    gameEngine.player.hand.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        handContainer.appendChild(cardElement);
    });

    // Play card draw sound if hand grew
    if (battleSounds && gameEngine.player.hand.length > previousHandSize) {
        battleSounds.playCardDraw();
    }
}

/**
 * Create card element
 */
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'battle-card';

    // Check if card is affordable
    if (card.cost > gameEngine.player.energy) {
        cardDiv.classList.add('disabled');
    }

    cardDiv.innerHTML = `
        <div class="card-cost">${card.cost}</div>
        <div class="card-icon">${card.icon}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-type ${card.type}">${getCardTypeText(card.type)}</div>
        <div class="card-description">${card.description}</div>
    `;

    cardDiv.onclick = () => {
        if (card.cost <= gameEngine.player.energy) {
            showCardModal(card, index);
        } else {
            showNotification('Không đủ năng lượng!', 'error');
        }
    };

    return cardDiv;
}

/**
 * Show card modal
 */
function showCardModal(card, index) {
    selectedCardIndex = index;

    const modal = document.getElementById('cardModal');
    const cardDetail = document.getElementById('cardDetail');

    cardDetail.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${card.icon}</div>
            <h2 style="color: var(--gold); margin-bottom: 0.5rem;">${card.name}</h2>
            <div class="card-type ${card.type}" style="display: inline-block; margin-bottom: 1.5rem;">
                ${getCardTypeText(card.type)}
            </div>
            <p style="color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.8;">
                ${card.description}
            </p>
            <p style="color: var(--text-gray); font-style: italic; margin-bottom: 1.5rem;">
                "${card.flavor_text}"
            </p>
            <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 1rem;">
                <div>
                    <div style="color: var(--gold); font-size: 1.5rem; font-weight: 700;">⚡ ${card.cost}</div>
                    <div style="color: var(--text-gray); font-size: 0.9rem;">Năng lượng</div>
                </div>
                <div>
                    <div style="color: var(--gold); font-size: 1.5rem; font-weight: 700;">🔄 ${card.cooldown}</div>
                    <div style="color: var(--text-gray); font-size: 0.9rem;">Hồi chiêu</div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';

    // Setup buttons
    document.querySelector('.card-modal-close').onclick = () => {
        modal.style.display = 'none';
    };

    document.querySelector('.card-modal-overlay').onclick = () => {
        modal.style.display = 'none';
    };

    document.getElementById('useCardBtn').onclick = async () => {
        modal.style.display = 'none';
        await useCard(selectedCardIndex);
    };
}

/**
 * Use card
 */
async function useCard(cardIndex) {
    const card = gameEngine.player.hand[cardIndex];

    const result = await gameEngine.playCard(
        gameEngine.player,
        cardIndex,
        gameEngine.opponent
    );

    if (result.success) {
        // Play card sound based on type
        if (battleSounds && card) {
            switch (card.type) {
                case 'knowledge':
                    battleSounds.playCardKnowledge();
                    break;
                case 'attack':
                    battleSounds.playCardAttack();
                    break;
                case 'defense':
                    battleSounds.playCardDefense();
                    break;
                case 'special':
                    battleSounds.playCardSpecial();
                    break;
                default:
                    battleSounds.playCardPlay();
            }
        }

        showNotification(result.message, 'success');

        if (result.effect.messages) {
            showEffects(result.effect.messages);
        }

        // Update UI
        updatePlayerStats();
        updateOpponentStats();
        renderPlayerHand();

        // Apply card effects to UI
        applyCardEffectsToUI(result.effect);
    } else {
        showNotification(result.message, 'error');
    }
}

/**
 * Apply card effects to UI
 */
function applyCardEffectsToUI(effect) {
    // Card #10: Change Question - Đổi Vận Đảo Càn Khôn
    if (effect.effect === 'change_question') {
        // Clear timer
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        showNotification('🔄 Đang đổi sang câu hỏi mới...', 'info');

        setTimeout(() => {
            // Increment to next question
            gameEngine.currentQuestionIndex++;

            // Get new question
            const question = gameEngine.getCurrentQuestion();

            // Reset and display new question
            displayQuestion(question);

            showNotification('✨ Đã đổi sang câu hỏi mới!', 'success');
        }, 800);
    }

    // Note: eliminate_answers and add_time are now handled in displayQuestion() and startTimer()
}

/**
 * Show effects
 */
function showEffects(messages) {
    const effectsDisplay = document.getElementById('effectsDisplay');
    effectsDisplay.innerHTML = '';

    messages.forEach(msg => {
        const effectMsg = document.createElement('div');
        effectMsg.className = 'effect-message';
        effectMsg.textContent = msg;
        effectsDisplay.appendChild(effectMsg);
    });

    effectsDisplay.style.display = 'block';

    setTimeout(() => {
        effectsDisplay.style.display = 'none';
    }, 3000);
}

/**
 * Show game over screen
 */
function showGameOver(result) {
    // Stop BGM
    if (battleSounds) {
        battleSounds.stopBGM();
    }

    battleArena.style.display = 'none';
    gameOverScreen.style.display = 'block';

    // Update victory status
    const victoryStatus = document.getElementById('victoryStatus');
    const victoryIcon = victoryStatus.querySelector('.victory-icon');
    const victoryText = victoryStatus.querySelector('.victory-text');

    if (result.winner === 'player') {
        victoryIcon.textContent = '🏆';
        victoryText.textContent = 'Chiến Thắng!';
        if (battleSounds) battleSounds.playVictory();

        // Victory sparkles!
        if (animationEngine) {
            animationEngine.createSparkles(gameOverScreen, 3000);
        }
    } else if (result.winner === 'opponent') {
        victoryIcon.textContent = '💀';
        victoryText.textContent = 'Thất Bại!';
        if (battleSounds) battleSounds.playDefeat();
    } else {
        victoryIcon.textContent = '🤝';
        victoryText.textContent = 'Hòa!';
    }

    // Update player stats
    document.getElementById('finalPlayerScore').textContent = result.playerStats.score;
    document.getElementById('finalPlayerHP').textContent = result.playerStats.hp;
    document.getElementById('finalPlayerCorrect').textContent = result.playerStats.correctAnswers;
    document.getElementById('finalPlayerAccuracy').textContent = result.playerStats.accuracy + '%';

    // Update opponent stats
    document.getElementById('finalOpponentScore').textContent = result.opponentStats.score;
    document.getElementById('finalOpponentHP').textContent = result.opponentStats.hp;
    document.getElementById('finalOpponentCorrect').textContent = result.opponentStats.correctAnswers;

    // Update XP
    document.getElementById('xpEarned').textContent = result.xpEarned;

    // Save XP to user profile and track activity
    trackQuizBattleActivity(result);
}

/**
 * Track quiz battle activity and save XP
 */
async function trackQuizBattleActivity(result) {
    const token = Auth.getToken();
    if (token) {
        try {
            const battleResult = result.winner === 'player' ? 'win' :
                                result.winner === 'opponent' ? 'lose' : 'draw';

            const response = await API.trackActivity('quiz_battle', {
                result: battleResult,
                score: result.playerStats.score,
                correct: result.playerStats.correctAnswers,
                accuracy: result.playerStats.accuracy
            });

            if (response && response.xp_earned > 0) {
                showNotification(`+${response.xp_earned} XP`, 'success');
                if (response.leveled_up) {
                    showNotification(`🎉 Level Up! Level ${response.level}!`, 'success');
                }
            }
        } catch (error) {
            console.log('Failed to track quiz battle activity', error);
            // Fallback to local XP
            if (result.xpEarned > 0) {
                await UserData.addXP(result.xpEarned, 'quiz_battle');
            }
        }
    } else {
        // Not logged in, use local XP
        if (result.xpEarned > 0) {
            await UserData.addXP(result.xpEarned, 'quiz_battle');
        }
    }
}

/**
 * Reset game
 */
function resetGame() {
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'block';

    // Reset selections
    difficultyCards.forEach(c => c.classList.remove('selected'));
    selectedDifficulty = null;
    startBattleBtn.disabled = true;

    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Create notification element
    const existing = document.querySelector('.game-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `game-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#50C878' : type === 'error' ? '#E94B3C' : type === 'warning' ? '#FFA500' : '#4A90E2'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

/**
 * Helper functions
 */
function getCategoryIcon(category) {
    const icons = {
        dynasty: '👑',
        war: '⚔️',
        figures: '🎭',
        culture: '📜',
        heritage: '🏛️',
        diplomacy: '🌍',
        science: '🔬',
        art: '🎨'
    };
    return icons[category] || '📚';
}

function getCategoryName(category) {
    const names = {
        dynasty: 'Triều Đại',
        war: 'Chiến Tranh',
        figures: 'Nhân Vật',
        culture: 'Văn Hóa',
        heritage: 'Di Sản',
        diplomacy: 'Ngoại Giao',
        science: 'Khoa Học',
        art: 'Nghệ Thuật'
    };
    return names[category] || 'Lịch Sử';
}

function getDifficultyText(difficulty) {
    const texts = {
        easy: 'Dễ',
        medium: 'Trung bình',
        hard: 'Khó'
    };
    return texts[difficulty] || 'Trung bình';
}

function getCardTypeText(type) {
    const texts = {
        knowledge: 'Tri Thức',
        attack: 'Tấn Công',
        defense: 'Phòng Thủ',
        special: 'Đặc Biệt'
    };
    return texts[type] || type;
}

/**
 * Card #1: Apply 50-50 effect - Eliminate wrong answers
 */
function applyEliminateAnswers(correctIndex, count = 2) {
    const options = document.querySelectorAll('.answer-option');
    const wrongIndices = [];

    // Collect all wrong answer indices
    options.forEach((opt, i) => {
        if (i !== correctIndex) {
            wrongIndices.push(i);
        }
    });

    // Shuffle and take first 'count' wrong answers
    wrongIndices.sort(() => Math.random() - 0.5);
    const toEliminate = wrongIndices.slice(0, count);

    // Apply eliminated style and disable
    toEliminate.forEach(index => {
        const option = options[index];
        option.classList.add('eliminated');
        option.style.opacity = '0.3';
        option.style.textDecoration = 'line-through';
        option.style.pointerEvents = 'none';
    });

    showNotification(`💡 Đã loại bỏ ${count} đáp án sai!`, 'success');
}

/**
 * Card #3: Show Audience Poll statistics
 */
function showAudiencePoll(correctIndex) {
    const options = document.querySelectorAll('.answer-option');

    // Generate realistic percentages (correct answer has higher %)
    const percentages = [];
    let remaining = 100;

    options.forEach((opt, i) => {
        if (i === correctIndex) {
            // Correct answer: 40-60%
            const percent = 40 + Math.floor(Math.random() * 21);
            percentages.push(percent);
            remaining -= percent;
        } else {
            percentages.push(0);
        }
    });

    // Distribute remaining % to wrong answers
    const wrongIndices = [];
    options.forEach((opt, i) => {
        if (i !== correctIndex) wrongIndices.push(i);
    });

    wrongIndices.forEach((i, idx) => {
        if (idx === wrongIndices.length - 1) {
            percentages[i] = remaining;
        } else {
            const percent = Math.floor(Math.random() * (remaining / (wrongIndices.length - idx)));
            percentages[i] = percent;
            remaining -= percent;
        }
    });

    // Display percentages on each option
    options.forEach((opt, i) => {
        const pollBar = document.createElement('div');
        pollBar.className = 'audience-poll-bar';
        pollBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 4px;
            background: linear-gradient(90deg, #4A90E2, #50C878);
            width: ${percentages[i]}%;
            transition: width 0.8s ease;
            border-radius: 0 0 8px 8px;
        `;

        const pollText = document.createElement('div');
        pollText.className = 'audience-poll-text';
        pollText.textContent = `👥 ${percentages[i]}%`;
        pollText.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 0.9rem;
            font-weight: 700;
            color: #4A90E2;
            background: rgba(74, 144, 226, 0.15);
            padding: 2px 8px;
            border-radius: 4px;
        `;

        opt.style.position = 'relative';
        opt.appendChild(pollBar);
        opt.appendChild(pollText);
    });

    showNotification('👥 Khán giả đã bầu chọn!', 'info');
}

/**
 * Card #4: Show damage animation when conditional damage triggers
 */
function showDamageAnimation(target, damage) {
    const targetArea = target === 'player'
        ? document.querySelector('.player-area-self')
        : document.querySelector('.opponent-area');

    // Play damage sound
    if (battleSounds) {
        battleSounds.playDamage(damage);
    }

    // Use animation engine for floating text
    if (animationEngine) {
        const rect = targetArea.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        animationEngine.createFloatingText(`-${damage}`, x, y, '#E94B3C', '3rem', 1000);

        // Shake animation
        animationEngine.shakeElement(targetArea, 10, 300);

        // Explosion particles
        animationEngine.createExplosion(x, y, '#E94B3C', 15);
    } else {
        // Fallback to old method
        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number';
        damageEl.textContent = `-${damage}`;
        damageEl.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: 900;
            color: #E94B3C;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            animation: damageFloat 1s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;

        targetArea.style.position = 'relative';
        targetArea.appendChild(damageEl);

        setTimeout(() => {
            damageEl.remove();
        }, 1000);

        targetArea.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            targetArea.style.animation = '';
        }, 300);
    }
}
