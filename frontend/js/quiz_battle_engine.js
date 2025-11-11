/**
 * VIỆT SỬ KÝ - Quiz Battle Engine
 * Game 3: Đấu Trí Lịch Sử
 * Core game logic, battle management, scoring system
 */

class QuizBattleEngine {
    constructor() {
        this.gameState = null;
        this.questions = [];
        this.cards = [];
        this.currentQuestionIndex = 0;
        this.player = null;
        this.opponent = null;
        this.turn = 1;
        this.maxTurns = 10;
        this.gameMode = 'ai'; // 'ai' or 'pvp'
        this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
    }

    /**
     * Initialize game with questions and cards data
     */
    async initialize(questionsData, cardsData) {
        this.questions = this.shuffleArray([...questionsData.questions]);
        this.cards = cardsData.cards;
        this.cardTypes = cardsData.card_types;

        // Initialize players
        this.player = new BattlePlayer('player', 'Bạn', true);
        this.opponent = new BattlePlayer('ai', 'AI Đối Thủ', false);

        // Setup starting decks and hands
        this.setupPlayerDecks(cardsData.starter_deck.card_ids);

        console.log('Quiz Battle Engine initialized', {
            questions: this.questions.length,
            cards: this.cards.length
        });
    }

    /**
     * Setup initial decks for both players
     */
    setupPlayerDecks(starterCardIds) {
        // Give both players the starter deck
        starterCardIds.forEach(cardId => {
            const card = this.cards.find(c => c.id === cardId);
            if (card) {
                this.player.deck.push({...card});
                this.opponent.deck.push({...card});
            }
        });

        // Shuffle decks
        this.player.deck = this.shuffleArray(this.player.deck);
        this.opponent.deck = this.shuffleArray(this.opponent.deck);

        // Draw starting hands (3 cards each)
        this.player.drawCards(3);
        this.opponent.drawCards(3);
    }

    /**
     * Start a new game
     */
    startGame(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.currentQuestionIndex = 0;
        this.turn = 1;

        this.gameState = {
            phase: 'question', // 'question', 'answer', 'card_play', 'game_over'
            currentPlayer: this.player,
            winner: null,
            startTime: Date.now(),
            turnHistory: []
        };

        console.log('Game started!', {
            difficulty: this.difficulty,
            playerHP: this.player.hp,
            opponentHP: this.opponent.hp
        });

        return this.getCurrentQuestion();
    }

    /**
     * Get current question
     */
    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            // Ran out of questions, shuffle and restart
            this.questions = this.shuffleArray(this.questions);
            this.currentQuestionIndex = 0;
        }

        const question = this.questions[this.currentQuestionIndex];
        return {
            ...question,
            turnNumber: this.turn,
            maxTurns: this.maxTurns
        };
    }

    /**
     * Process player answer
     */
    async processAnswer(answerIndex, timeSpent) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = question.correct === answerIndex;

        // Calculate base score
        let score = 0;
        if (isCorrect) {
            score = this.calculateScore(question.difficulty, timeSpent);
        }

        // Apply active card effects
        const effects = this.applyActiveEffects('on_answer', {
            isCorrect,
            score,
            question,
            player: this.player
        });

        score = effects.score;

        // Update player score and stats
        this.player.score += score;
        if (isCorrect) {
            this.player.correctAnswers++;
        } else {
            this.player.wrongAnswers++;
            // Trigger opponent attack cards
            this.triggerOpponentAttacks();
        }

        // Record turn in history
        this.gameState.turnHistory.push({
            turn: this.turn,
            player: 'user',
            question: question.question,
            answer: question.answers[answerIndex],
            isCorrect,
            score,
            timeSpent
        });

        const result = {
            isCorrect,
            score,
            correctAnswer: question.correct,
            explanation: question.explanation,
            playerScore: this.player.score,
            playerHP: this.player.hp,
            opponentHP: this.opponent.hp,
            effects: effects.messages
        };

        return result;
    }

    /**
     * Calculate score based on difficulty and time
     */
    calculateScore(difficulty, timeSpent) {
        const baseScores = {
            easy: 10,
            medium: 20,
            hard: 30
        };

        let score = baseScores[difficulty] || 20;

        // Time bonus (faster = more points)
        const timeLimit = 30; // seconds
        const timeBonus = Math.max(0, Math.floor((timeLimit - timeSpent) / 2));
        score += timeBonus;

        return score;
    }

    /**
     * Trigger opponent attacks when player answers wrong
     */
    triggerOpponentAttacks() {
        // Check opponent's active attack cards
        this.opponent.activeEffects.forEach(effect => {
            if (effect.type === 'conditional_damage' && effect.condition === 'opponent_wrong') {
                const damage = effect.value;
                this.dealDamage(this.opponent, this.player, damage);
            }
        });
    }

    /**
     * Let AI opponent take turn
     */
    async opponentTurn() {
        try {
            console.log('🤖 QuizBattleEngine.opponentTurn started');

            const question = this.getCurrentQuestion();
            console.log('📝 Current question:', question);

            // AI decision making based on difficulty
            const aiAnswer = this.getAIAnswer(question, this.difficulty);
            console.log('🎯 AI answer:', aiAnswer);

            const isCorrect = aiAnswer.answerIndex === question.correct;
            console.log('✅ Is correct:', isCorrect);

            // Calculate AI score
            let score = 0;
            if (isCorrect) {
                score = this.calculateScore(question.difficulty, aiAnswer.timeSpent);
            }

            this.opponent.score += score;
            if (isCorrect) {
                this.opponent.correctAnswers++;
            } else {
                this.opponent.wrongAnswers++;
                // Trigger player attack cards
                this.triggerPlayerAttacks();
            }

            // AI card usage
            const aiCardUsage = this.getAICardUsage();
            if (aiCardUsage) {
                await this.playCard(this.opponent, aiCardUsage.cardIndex, this.player);
            }

            // Record turn
            this.gameState.turnHistory.push({
                turn: this.turn,
                player: 'ai',
                question: question.question,
                answer: question.answers[aiAnswer.answerIndex],
                isCorrect,
                score,
                timeSpent: aiAnswer.timeSpent,
                cardUsed: aiCardUsage ? aiCardUsage.card.name : null
            });

            const result = {
                isCorrect,
                score,
                opponentScore: this.opponent.score,
                opponentHP: this.opponent.hp,
                playerHP: this.player.hp,
                cardUsed: aiCardUsage ? aiCardUsage.card.name : null
            };

            console.log('✅ OpponentTurn result:', result);
            return result;
        } catch (error) {
            console.error('❌ Error in opponentTurn:', error);
            throw error;
        }
    }

    /**
     * Get AI answer based on difficulty
     */
    getAIAnswer(question, difficulty) {
        // Use Smart AI if available (from global scope)
        if (typeof smartAI !== 'undefined' && smartAI) {
            const gameState = smartAI.evaluateGameState(
                this.opponent,
                this.player,
                this.turn,
                this.maxTurns
            );
            return smartAI.getAnswer(question, difficulty, gameState);
        }

        // Fallback to basic AI
        const correctChance = {
            easy: 0.5,    // 50% correct
            medium: 0.7,  // 70% correct
            hard: 0.85    // 85% correct
        };

        const chance = correctChance[difficulty] || 0.7;
        const willAnswerCorrect = Math.random() < chance;

        let answerIndex;
        if (willAnswerCorrect) {
            answerIndex = question.correct;
        } else {
            // Pick a wrong answer
            const wrongAnswers = [0, 1, 2, 3].filter(i => i !== question.correct);
            answerIndex = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        }

        // AI thinking time (faster on harder difficulty)
        const thinkTime = {
            easy: Math.random() * 10 + 15,      // 15-25s
            medium: Math.random() * 8 + 10,     // 10-18s
            hard: Math.random() * 5 + 5         // 5-10s
        };

        return {
            answerIndex,
            timeSpent: thinkTime[difficulty] || 10
        };
    }

    /**
     * Trigger player attacks when opponent answers wrong
     */
    triggerPlayerAttacks() {
        this.player.activeEffects.forEach(effect => {
            if (effect.type === 'conditional_damage' && effect.condition === 'opponent_wrong') {
                const damage = effect.value;
                this.dealDamage(this.player, this.opponent, damage);
            }
        });
    }

    /**
     * Get AI card usage decision
     */
    getAICardUsage() {
        // Use Smart AI if available
        if (typeof smartAI !== 'undefined' && smartAI) {
            const gameState = smartAI.evaluateGameState(
                this.opponent,
                this.player,
                this.turn,
                this.maxTurns
            );
            return smartAI.chooseCard(
                this.opponent.hand,
                this.opponent.energy,
                gameState
            );
        }

        // Fallback to simple AI
        if (this.opponent.energy <= 0 || this.opponent.hand.length === 0) {
            return null;
        }

        // Priority: Defense if low HP, Attack if opponent high HP, else Knowledge
        if (this.opponent.hp < 30) {
            // Try to use defense card
            const defenseCardIndex = this.opponent.hand.findIndex(
                card => card.type === 'defense' && card.cost <= this.opponent.energy
            );
            if (defenseCardIndex !== -1) {
                return { cardIndex: defenseCardIndex, card: this.opponent.hand[defenseCardIndex] };
            }
        }

        if (this.player.hp > 50) {
            // Try to use attack card
            const attackCardIndex = this.opponent.hand.findIndex(
                card => card.type === 'attack' && card.cost <= this.opponent.energy
            );
            if (attackCardIndex !== -1) {
                return { cardIndex: attackCardIndex, card: this.opponent.hand[attackCardIndex] };
            }
        }

        // Random card usage (30% chance)
        if (Math.random() < 0.3) {
            const affordableCards = this.opponent.hand
                .map((card, index) => ({ card, index }))
                .filter(item => item.card.cost <= this.opponent.energy);

            if (affordableCards.length > 0) {
                const chosen = affordableCards[Math.floor(Math.random() * affordableCards.length)];
                return { cardIndex: chosen.index, card: chosen.card };
            }
        }

        return null;
    }

    /**
     * Play a card
     */
    async playCard(player, cardIndex, target) {
        const card = player.hand[cardIndex];

        if (!card) {
            return { success: false, message: 'Thẻ không tồn tại' };
        }

        if (card.cost > player.energy) {
            return { success: false, message: 'Không đủ năng lượng' };
        }

        // Check cooldown
        if (player.cardCooldowns[card.id] > 0) {
            return { success: false, message: 'Thẻ đang hồi chiêu' };
        }

        // Deduct energy
        player.energy -= card.cost;

        // Remove card from hand
        player.hand.splice(cardIndex, 1);

        // Apply card effect
        const result = await this.applyCardEffect(card, player, target);

        // Set cooldown
        if (card.cooldown > 0) {
            player.cardCooldowns[card.id] = card.cooldown;
        }

        // Move card to discard pile
        player.discardPile.push(card);

        return {
            success: true,
            message: `Đã sử dụng ${card.name}`,
            effect: result
        };
    }

    /**
     * Apply card effect
     */
    async applyCardEffect(card, player, target) {
        const effect = card.effect;
        const messages = [];

        switch (effect.type) {
            case 'eliminate_answers':
                // Remove wrong answers (handled by UI)
                messages.push(`Loại bỏ ${effect.value} đáp án sai`);
                player.activeEffects.push({
                    ...effect,
                    cardName: card.name,
                    duration: 1
                });
                break;

            case 'add_time':
                messages.push(`+${effect.value} giây`);
                player.activeEffects.push({
                    ...effect,
                    cardName: card.name,
                    duration: 1
                });
                break;

            case 'show_statistics':
                messages.push('Hiển thị thống kê đáp án');
                player.activeEffects.push({
                    ...effect,
                    cardName: card.name,
                    duration: 1
                });
                break;

            case 'conditional_damage':
                messages.push(`Chờ đối thủ trả lời sai để gây ${effect.value} sát thương`);
                player.activeEffects.push({
                    ...effect,
                    cardName: card.name,
                    duration: 2
                });
                break;

            case 'reduce_energy':
                target.energy = Math.max(0, target.energy - effect.value);
                messages.push(`Đối thủ mất ${effect.value} năng lượng`);
                break;

            case 'reduce_time':
                messages.push(`Đối thủ mất ${effect.value}s ở câu tiếp theo`);
                target.activeEffects.push({
                    ...effect,
                    cardName: card.name,
                    duration: effect.duration || 1
                });
                break;

            case 'block_attack':
                player.shield += effect.value;
                messages.push(`+${effect.value} lá chắn`);
                break;

            case 'heal':
                player.hp = Math.min(100, player.hp + effect.value);
                messages.push(`Hồi ${effect.value} HP`);
                break;

            case 'draw_cards':
                player.drawCards(effect.value);
                messages.push(`Rút ${effect.value} thẻ bài`);
                break;

            case 'change_question':
                messages.push('Đổi sang câu hỏi khác');
                player.activeEffects.push({
                    ...effect,
                    cardName: card.name,
                    duration: 1
                });
                break;

            default:
                messages.push('Hiệu ứng không xác định');
        }

        return { messages, effect: effect.type };
    }

    /**
     * Apply active effects
     */
    applyActiveEffects(timing, context) {
        const messages = [];
        let modifiedContext = { ...context };

        // Process player effects
        this.player.activeEffects = this.player.activeEffects.filter(effect => {
            if (effect.timing === timing) {
                // Apply effect
                const result = this.processEffect(effect, modifiedContext);
                messages.push(...result.messages);
                modifiedContext = result.context;
            }

            // Decrease duration
            effect.duration--;
            return effect.duration > 0;
        });

        // Process opponent effects
        this.opponent.activeEffects = this.opponent.activeEffects.filter(effect => {
            effect.duration--;
            return effect.duration > 0;
        });

        return { ...modifiedContext, messages };
    }

    /**
     * Process a single effect
     */
    processEffect(effect, context) {
        const messages = [];

        // Effect processing logic here
        // This is called by applyActiveEffects

        return { context, messages };
    }

    /**
     * Deal damage from attacker to target
     */
    dealDamage(attacker, target, damage) {
        // Check shield
        if (target.shield > 0) {
            target.shield--;
            console.log(`${target.name} blocked attack with shield!`);
            return { blocked: true, damage: 0 };
        }

        // Apply damage
        target.hp = Math.max(0, target.hp - damage);
        console.log(`${attacker.name} dealt ${damage} damage to ${target.name}!`);

        // Trigger UI animation if function exists
        if (typeof showDamageAnimation === 'function') {
            const targetType = target.id === 'player' ? 'player' : 'opponent';
            showDamageAnimation(targetType, damage);
        }

        return { blocked: false, damage };
    }

    /**
     * Next question (advance turn)
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        this.turn++;

        // Regenerate energy at start of turn
        this.player.energy = Math.min(3, this.player.energy + 1);
        this.opponent.energy = Math.min(3, this.opponent.energy + 1);

        // Decrease cooldowns
        Object.keys(this.player.cardCooldowns).forEach(cardId => {
            if (this.player.cardCooldowns[cardId] > 0) {
                this.player.cardCooldowns[cardId]--;
            }
        });
        Object.keys(this.opponent.cardCooldowns).forEach(cardId => {
            if (this.opponent.cardCooldowns[cardId] > 0) {
                this.opponent.cardCooldowns[cardId]--;
            }
        });

        // Draw cards - draw 1 card every turn to maintain hand size
        this.player.drawCards(1);
        this.opponent.drawCards(1);

        // Check win conditions
        const gameOver = this.checkGameOver();
        if (gameOver) {
            return { gameOver: true, result: gameOver };
        }

        return { gameOver: false, question: this.getCurrentQuestion() };
    }

    /**
     * Check game over conditions
     */
    checkGameOver() {
        // Check HP
        if (this.player.hp <= 0) {
            return this.endGame('opponent');
        }
        if (this.opponent.hp <= 0) {
            return this.endGame('player');
        }

        // Check turns
        if (this.turn > this.maxTurns) {
            // Winner by score
            if (this.player.score > this.opponent.score) {
                return this.endGame('player');
            } else if (this.opponent.score > this.player.score) {
                return this.endGame('opponent');
            } else {
                return this.endGame('draw');
            }
        }

        return null;
    }

    /**
     * End game and calculate final results
     */
    endGame(winner) {
        this.gameState.phase = 'game_over';
        this.gameState.winner = winner;

        const totalTime = Math.floor((Date.now() - this.gameState.startTime) / 1000);

        const result = {
            winner,
            playerStats: {
                score: this.player.score,
                hp: this.player.hp,
                correctAnswers: this.player.correctAnswers,
                wrongAnswers: this.player.wrongAnswers,
                accuracy: Math.round((this.player.correctAnswers / (this.player.correctAnswers + this.player.wrongAnswers)) * 100) || 0
            },
            opponentStats: {
                score: this.opponent.score,
                hp: this.opponent.hp,
                correctAnswers: this.opponent.correctAnswers,
                wrongAnswers: this.opponent.wrongAnswers
            },
            totalTime,
            turns: this.turn - 1,
            xpEarned: this.calculateXP(winner)
        };

        console.log('Game Over!', result);
        return result;
    }

    /**
     * Calculate XP earned
     */
    calculateXP(winner) {
        let xp = 0;

        // Base XP for completing game
        xp += 50;

        // Win bonus
        if (winner === 'player') {
            xp += 100;
        } else if (winner === 'draw') {
            xp += 50;
        }

        // Score bonus
        xp += Math.floor(this.player.score / 10);

        // Accuracy bonus
        const accuracy = this.player.correctAnswers / (this.player.correctAnswers + this.player.wrongAnswers);
        if (accuracy >= 0.8) xp += 50;
        if (accuracy >= 0.9) xp += 50;

        // Difficulty bonus
        const difficultyBonus = {
            easy: 1.0,
            medium: 1.5,
            hard: 2.0
        };
        xp = Math.floor(xp * difficultyBonus[this.difficulty]);

        return xp;
    }

    /**
     * Utility: Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

/**
 * Battle Player Class
 */
class BattlePlayer {
    constructor(id, name, isHuman) {
        this.id = id;
        this.name = name;
        this.isHuman = isHuman;

        // Battle stats
        this.hp = 100;
        this.maxHp = 100;
        this.energy = 1; // Start with 1 energy so players can use cards immediately
        this.maxEnergy = 3;
        this.shield = 0;

        // Game stats
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;

        // Cards
        this.deck = [];
        this.hand = [];
        this.discardPile = [];
        this.maxHandSize = 5;

        // Effects
        this.activeEffects = [];
        this.cardCooldowns = {};
    }

    /**
     * Draw cards from deck to hand
     */
    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.hand.length >= this.maxHandSize) {
                break;
            }

            if (this.deck.length === 0) {
                // Shuffle discard pile back into deck
                this.deck = this.shuffleArray([...this.discardPile]);
                this.discardPile = [];
            }

            if (this.deck.length > 0) {
                const card = this.deck.pop();
                this.hand.push(card);
            }
        }
    }

    /**
     * Shuffle array helper
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Get player state for UI
     */
    getState() {
        return {
            id: this.id,
            name: this.name,
            hp: this.hp,
            maxHp: this.maxHp,
            energy: this.energy,
            maxEnergy: this.maxEnergy,
            shield: this.shield,
            score: this.score,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            handSize: this.hand.length,
            deckSize: this.deck.length,
            activeEffects: this.activeEffects.length
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizBattleEngine, BattlePlayer };
}
