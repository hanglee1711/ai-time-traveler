/**
 * Journey Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
});

function loadUserData() {
    const userData = UserData.get();

    // Update profile - prioritize logged in username
    const authUser = Auth.getUser();
    const displayName = authUser ? (authUser.display_name || authUser.username) : userData.username;
    document.getElementById('username').textContent = displayName;
    document.getElementById('user-level').textContent = `Level ${userData.level}`;

    // Update XP bar
    const xpInLevel = userData.xp % 100;
    const xpFill = document.getElementById('xp-fill');
    const xpText = document.getElementById('xp-text');
    xpFill.style.width = `${xpInLevel}%`;
    xpText.textContent = `${xpInLevel} / 100 XP`;

    // Update stats
    document.getElementById('figures-count').textContent = userData.visitedFigures.length;
    document.getElementById('events-count').textContent = userData.exploredEvents.length;
    document.getElementById('badges-count').textContent = userData.badges.length;
    document.getElementById('quests-count').textContent = userData.completedQuests.length;

    // Display badges
    displayBadges(userData.badges);

    // Display visited figures
    displayVisitedFigures(userData.visitedFigures);

    // Display explored events
    displayExploredEvents(userData.exploredEvents);
}

function displayBadges(badges) {
    const badgesGrid = document.getElementById('badges-grid');

    if (badges.length === 0) return;

    badgesGrid.innerHTML = '';
    badges.forEach(badge => {
        const badgeItem = document.createElement('div');
        badgeItem.className = 'badge-item card';
        badgeItem.innerHTML = `
            <div class="badge-icon">🏆</div>
            <div class="badge-name">${escapeHtml(badge)}</div>
        `;
        badgesGrid.appendChild(badgeItem);
    });
}

function displayVisitedFigures(figures) {
    const figuresGrid = document.getElementById('figures-grid');

    if (figures.length === 0) return;

    figuresGrid.innerHTML = '';
    figures.forEach(figure => {
        const figureCard = document.createElement('div');
        figureCard.className = 'figure-card';
        figureCard.innerHTML = `
            <div class="figure-icon">👤</div>
            <div class="figure-name-display">${escapeHtml(figure)}</div>
        `;
        figuresGrid.appendChild(figureCard);
    });
}

function displayExploredEvents(events) {
    const eventsList = document.getElementById('events-list');

    if (events.length === 0) return;

    eventsList.innerHTML = '';
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-name-display">${escapeHtml(event)}</div>
        `;
        eventsList.appendChild(eventItem);
    });
}
