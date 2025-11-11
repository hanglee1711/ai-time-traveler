/**
 * VIỆT KÝ SỬ - Smart AI System
 * 3 AI personalities with strategic decision making
 */

class SmartAI {
    constructor(personality = 'balanced') {
        this.personality = personality;
        this.strategies = {
            aggressive: new AggressiveStrategy(),
            defensive: new DefensiveStrategy(),
            balanced: new BalancedStrategy()
        };
    }

    /**
     * Get AI answer based on difficulty and personality
     */
    getAnswer(question, difficulty, gameState) {
        const correctChance = this.getCorrectChance(difficulty, gameState);
        const willAnswerCorrect = Math.random() < correctChance;

        let answerIndex;
        if (willAnswerCorrect) {
            answerIndex = question.correct;
        } else {
            const wrongAnswers = [0, 1, 2, 3].filter(i => i !== question.correct);
            answerIndex = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        }

        // Thinking time varies by personality
        const thinkTime = this.getThinkingTime(difficulty, gameState);

        return {
            answerIndex,
            timeSpent: thinkTime
        };
    }

    /**
     * Get correct answer chance based on game state
     */
    getCorrectChance(difficulty, gameState) {
        const baseChance = {
            easy: 0.5,
            medium: 0.7,
            hard: 0.85
        }[difficulty] || 0.7;

        // Adjust based on personality and game state
        const strategy = this.strategies[this.personality];
        return strategy.adjustAnswerChance(baseChance, gameState);
    }

    /**
     * Get thinking time based on personality
     */
    getThinkingTime(difficulty, gameState) {
        const strategy = this.strategies[this.personality];
        return strategy.getThinkingTime(difficulty, gameState);
    }

    /**
     * Decide which card to use
     */
    chooseCard(hand, energy, gameState) {
        const strategy = this.strategies[this.personality];
        return strategy.chooseCard(hand, energy, gameState);
    }

    /**
     * Evaluate game state
     */
    evaluateGameState(aiPlayer, humanPlayer, turn, maxTurns) {
        const hpRatio = aiPlayer.hp / aiPlayer.maxHp;
        const opponentHpRatio = humanPlayer.hp / humanPlayer.maxHp;
        const turnsRemaining = maxTurns - turn;
        const scoreGap = aiPlayer.score - humanPlayer.score;

        return {
            hpRatio,
            opponentHpRatio,
            turnsRemaining,
            scoreGap,
            energy: aiPlayer.energy,
            shield: aiPlayer.shield,
            opponentShield: humanPlayer.shield,
            isWinning: aiPlayer.hp > humanPlayer.hp || aiPlayer.score > humanPlayer.score,
            isLosing: aiPlayer.hp < humanPlayer.hp || aiPlayer.score < humanPlayer.score,
            isClose: Math.abs(scoreGap) < 50,
            isEndgame: turnsRemaining <= 3
        };
    }
}

/**
 * Aggressive Strategy - Attack early, take risks
 */
class AggressiveStrategy {
    adjustAnswerChance(baseChance, gameState) {
        // Aggressive AI doesn't care much about safety
        // Slight penalty to accuracy in favor of speed
        return baseChance * 0.95;
    }

    getThinkingTime(difficulty, gameState) {
        // Fast decisions
        const baseTimes = {
            easy: 5 + Math.random() * 5,    // 5-10s
            medium: 4 + Math.random() * 4,  // 4-8s
            hard: 3 + Math.random() * 3     // 3-6s
        };
        return baseTimes[difficulty] || 5;
    }

    chooseCard(hand, energy, gameState) {
        if (energy <= 0 || hand.length === 0) return null;

        // Priority: Attack > Special > Knowledge > Defense
        const cardPriority = {
            attack: 10,
            special: 7,
            knowledge: 5,
            defense: 3
        };

        // Find affordable cards
        const affordableCards = hand
            .map((card, index) => ({ card, index }))
            .filter(item => item.card.cost <= energy);

        if (affordableCards.length === 0) return null;

        // Always use attack cards if available and opponent HP > 50
        if (gameState.opponentHpRatio > 0.5) {
            const attackCard = affordableCards.find(item => item.card.type === 'attack');
            if (attackCard) {
                return { cardIndex: attackCard.index, card: attackCard.card };
            }
        }

        // Use high-cost cards aggressively (3 energy cards)
        const highCostCard = affordableCards.find(item => item.card.cost === 3);
        if (highCostCard && Math.random() < 0.7) {
            return { cardIndex: highCostCard.index, card: highCostCard.card };
        }

        // Sort by priority and cost
        affordableCards.sort((a, b) => {
            const priorityDiff = (cardPriority[b.card.type] || 0) - (cardPriority[a.card.type] || 0);
            if (priorityDiff !== 0) return priorityDiff;
            return b.card.cost - a.card.cost; // Prefer expensive cards
        });

        // 80% chance to use a card when available
        if (Math.random() < 0.8) {
            return { cardIndex: affordableCards[0].index, card: affordableCards[0].card };
        }

        return null;
    }
}

/**
 * Defensive Strategy - Preserve HP, play safe
 */
class DefensiveStrategy {
    adjustAnswerChance(baseChance, gameState) {
        // Defensive AI plays safer
        // Bonus accuracy when HP is low
        if (gameState.hpRatio < 0.3) {
            return Math.min(baseChance * 1.1, 0.95);
        }
        return baseChance;
    }

    getThinkingTime(difficulty, gameState) {
        // Slower, more careful
        const baseTimes = {
            easy: 10 + Math.random() * 8,   // 10-18s
            medium: 8 + Math.random() * 6,  // 8-14s
            hard: 6 + Math.random() * 4     // 6-10s
        };
        return baseTimes[difficulty] || 10;
    }

    chooseCard(hand, energy, gameState) {
        if (energy <= 0 || hand.length === 0) return null;

        const affordableCards = hand
            .map((card, index) => ({ card, index }))
            .filter(item => item.card.cost <= energy);

        if (affordableCards.length === 0) return null;

        // Priority: Defense when low HP > Knowledge > Defense > Attack
        const isLowHp = gameState.hpRatio < 0.5;
        const hasNoShield = gameState.shield === 0;

        // Urgent: Heal if HP < 40%
        if (gameState.hpRatio < 0.4) {
            const healCard = affordableCards.find(item =>
                item.card.effect && item.card.effect.type === 'heal'
            );
            if (healCard) {
                return { cardIndex: healCard.index, card: healCard.card };
            }
        }

        // High priority: Shield if no shield and low HP
        if (isLowHp && hasNoShield) {
            const shieldCard = affordableCards.find(item =>
                item.card.effect && item.card.effect.type === 'block_attack'
            );
            if (shieldCard) {
                return { cardIndex: shieldCard.index, card: shieldCard.card };
            }
        }

        // Use knowledge cards to improve accuracy
        const knowledgeCard = affordableCards.find(item => item.card.type === 'knowledge');
        if (knowledgeCard && Math.random() < 0.6) {
            return { cardIndex: knowledgeCard.index, card: knowledgeCard.card };
        }

        // Conservative: Only 40% chance to use other cards
        if (Math.random() < 0.4) {
            // Prefer lower cost cards to save energy
            affordableCards.sort((a, b) => a.card.cost - b.card.cost);
            return { cardIndex: affordableCards[0].index, card: affordableCards[0].card };
        }

        return null;
    }
}

/**
 * Balanced Strategy - Adapt to situation
 */
class BalancedStrategy {
    adjustAnswerChance(baseChance, gameState) {
        // Balanced adapts based on situation
        if (gameState.isEndgame && gameState.isLosing) {
            // Take risks when losing in endgame
            return baseChance * 0.9;
        }
        if (gameState.isWinning) {
            // Play safer when winning
            return baseChance * 1.05;
        }
        return baseChance;
    }

    getThinkingTime(difficulty, gameState) {
        // Moderate speed
        const baseTimes = {
            easy: 8 + Math.random() * 6,    // 8-14s
            medium: 6 + Math.random() * 5,  // 6-11s
            hard: 4 + Math.random() * 4     // 4-8s
        };

        // Think faster when time is critical
        if (gameState.turnsRemaining <= 2) {
            return baseTimes[difficulty] * 0.7;
        }

        return baseTimes[difficulty] || 7;
    }

    chooseCard(hand, energy, gameState) {
        if (energy <= 0 || hand.length === 0) return null;

        const affordableCards = hand
            .map((card, index) => ({ card, index }))
            .filter(item => item.card.cost <= energy);

        if (affordableCards.length === 0) return null;

        // Adaptive decision based on game state
        const situation = this.assessSituation(gameState);

        switch (situation) {
            case 'critical_hp':
                // Need healing/defense urgently
                const defensiveCard = affordableCards.find(item =>
                    item.card.type === 'defense'
                );
                if (defensiveCard) {
                    return { cardIndex: defensiveCard.index, card: defensiveCard.card };
                }
                break;

            case 'winning':
                // Play aggressive to finish
                const attackCard = affordableCards.find(item =>
                    item.card.type === 'attack' && gameState.opponentHpRatio < 0.5
                );
                if (attackCard && Math.random() < 0.7) {
                    return { cardIndex: attackCard.index, card: attackCard.card };
                }
                break;

            case 'losing_endgame':
                // Use expensive cards for comeback
                const expensiveCard = affordableCards.find(item => item.card.cost >= 2);
                if (expensiveCard) {
                    return { cardIndex: expensiveCard.index, card: expensiveCard.card };
                }
                break;

            case 'stable':
            default:
                // Balanced play - knowledge and moderate attacks
                const balancedCards = affordableCards.filter(item =>
                    item.card.type === 'knowledge' || item.card.type === 'attack'
                );
                if (balancedCards.length > 0 && Math.random() < 0.5) {
                    const chosen = balancedCards[Math.floor(Math.random() * balancedCards.length)];
                    return { cardIndex: chosen.index, card: chosen.card };
                }
        }

        return null;
    }

    assessSituation(gameState) {
        if (gameState.hpRatio < 0.3) {
            return 'critical_hp';
        }
        if (gameState.isWinning && gameState.opponentHpRatio < 0.6) {
            return 'winning';
        }
        if (gameState.isLosing && gameState.isEndgame) {
            return 'losing_endgame';
        }
        return 'stable';
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartAI };
}
