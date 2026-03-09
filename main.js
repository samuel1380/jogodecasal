const questions = [
    { text: "O que eu mais gosto em você?", icon: "🥰", theme: "purple" },
    { text: "Qual foi o momento em que eu me apaixonei por você?", icon: "💘", theme: "blue" },
    { text: "O que eu mais sinto falta quando estamos longe?", icon: "😢", theme: "purple" },
    { text: "Qual é o meu lugar favorito para estar com você?", icon: "🌅", theme: "blue" },
    { text: "Qual elogio meu te marcou mais?", icon: "💬", theme: "purple" },
    { text: "O que eu acho mais bonito no seu sorriso?", icon: "😍", theme: "blue" },
    { text: "Qual foi o nosso melhor dia juntos até hoje?", icon: "✨", theme: "purple" },
    { text: "O que me faz te abraçar do nada?", icon: "🤗", theme: "blue" },
    { text: "Qual é a coisa que eu mais amo fazer com você?", icon: "💑", theme: "purple" },
    { text: "O que você faz que me dá mais borboletas na barriga?", icon: "🦋", theme: "blue" }
];

let currentCardIndex = 0;
let scoreP1 = 0;
let scoreP2 = 0;
let player1 = "";
let player2 = "";
let deck = [];

// DOM
const screens = {
    start: document.getElementById('start-screen'),
    names: document.getElementById('names-screen'),
    game: document.getElementById('game-screen'),
    end: document.getElementById('end-screen')
};

const el = {
    btnPlay: document.getElementById('btn-play'),
    btnStartGame: document.getElementById('btn-start-game'),
    btnRestart: document.getElementById('btn-restart'),
    inputP1: document.getElementById('player1-name'),
    inputP2: document.getElementById('player2-name'),
    card: document.getElementById('card-element'),
    cardBack: document.getElementById('card-back-content'),
    actions: document.getElementById('action-buttons'),
    btnP1: document.getElementById('btn-p1'),
    btnP2: document.getElementById('btn-p2'),
    btnBoth: document.getElementById('btn-both'),
    btnNone: document.getElementById('btn-none'),
    btnP1Name: document.getElementById('btn-p1-name'),
    btnP2Name: document.getElementById('btn-p2-name'),
    scoreP1: document.getElementById('score-p1'),
    scoreP2: document.getElementById('score-p2'),
    hudP1Name: document.getElementById('hud-p1-name'),
    hudP2Name: document.getElementById('hud-p2-name'),
    currentCard: document.getElementById('current-card'),
    progressBar: document.getElementById('progress-bar'),
    tapHint: document.getElementById('tap-hint'),
    finalP1Name: document.getElementById('final-p1-name'),
    finalP2Name: document.getElementById('final-p2-name'),
    finalP1Score: document.getElementById('final-p1-score'),
    finalP2Score: document.getElementById('final-p2-score'),
    finalP1Card: document.getElementById('final-p1-card'),
    finalP2Card: document.getElementById('final-p2-card'),
    winnerText: document.getElementById('winner-text'),
    winnerAnnouncement: document.getElementById('winner-announcement'),
    prizeSection: document.getElementById('prize-section'),
    endTitle: document.getElementById('end-title'),
    finalMessage: document.getElementById('final-message'),
    endIcon: document.getElementById('end-icon')
};

// Utils
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function switchScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// Validar nomes
function validateNames() {
    const n1 = el.inputP1.value.trim();
    const n2 = el.inputP2.value.trim();
    el.btnStartGame.disabled = !(n1.length > 0 && n2.length > 0);
}

function updateHUD() {
    el.scoreP1.textContent = scoreP1;
    el.scoreP2.textContent = scoreP2;
    el.currentCard.textContent = currentCardIndex + 1;
    el.progressBar.style.width = `${((currentCardIndex + 1) / deck.length) * 100}%`;
}

function initGame() {
    player1 = el.inputP1.value.trim();
    player2 = el.inputP2.value.trim();

    // Atualizar nomes em todo o jogo
    el.hudP1Name.textContent = player1;
    el.hudP2Name.textContent = player2;
    el.btnP1Name.textContent = player1;
    el.btnP2Name.textContent = player2;

    deck = shuffle(questions).slice(0, 10);
    currentCardIndex = 0;
    scoreP1 = 0;
    scoreP2 = 0;
    el.card.classList.remove('flipped');
    el.actions.classList.add('hidden');
    el.tapHint.style.display = '';
    updateHUD();
    switchScreen('game');
}

function renderCardBack(q, index) {
    const themeClass = q.theme === 'blue' ? 'blue-theme' : 'purple-theme';
    const num = index + 1;
    const cornerIcon = q.theme === 'blue' ? 'fa-droplet' : 'fa-heart';

    el.cardBack.innerHTML = `
        <div class="card-back-bg ${themeClass}">
            <div class="card-corner card-corner-tl">
                ${num}
                <span class="card-corner-icon"><i class="fas ${cornerIcon}"></i></span>
            </div>
            <div class="card-ellipse">
                <p class="card-question-text">${q.text}</p>
                <div class="card-emoji">${q.icon}</div>
            </div>
            <div class="card-corner card-corner-br">
                ${num}
                <span class="card-corner-icon"><i class="fas ${cornerIcon}"></i></span>
            </div>
            <div class="card-subtitle-label">Cartas de Perguntas para Casal</div>
        </div>
    `;
}

function revealCard() {
    if (el.card.classList.contains('flipped')) return;
    renderCardBack(deck[currentCardIndex], currentCardIndex);
    el.card.classList.add('flipped');
    el.tapHint.style.display = 'none';
    setTimeout(() => {
        el.actions.classList.remove('hidden');
    }, 800);
}

function scoreAnimation(elTarget, isPositive) {
    elTarget.classList.add(isPositive ? 'score-pop-right' : 'score-pop-wrong');
    setTimeout(() => {
        elTarget.classList.remove('score-pop-right', 'score-pop-wrong');
    }, 500);
}

function answerQuestion(who) {
    // who: 'p1', 'p2', 'both', 'none'
    if (who === 'p1') {
        scoreP1++;
        scoreAnimation(el.scoreP1, true);
    } else if (who === 'p2') {
        scoreP2++;
        scoreAnimation(el.scoreP2, true);
    } else if (who === 'both') {
        scoreP1++;
        scoreP2++;
        scoreAnimation(el.scoreP1, true);
        scoreAnimation(el.scoreP2, true);
    }
    // 'none' → ninguém ganha ponto

    el.actions.classList.add('hidden');
    el.card.classList.remove('flipped');

    setTimeout(() => {
        currentCardIndex++;
        if (currentCardIndex >= deck.length) {
            showEndScreen();
        } else {
            el.tapHint.style.display = '';
            updateHUD();
        }
    }, 600);
}

function showEndScreen() {
    el.finalP1Name.textContent = player1;
    el.finalP2Name.textContent = player2;
    el.finalP1Score.textContent = scoreP1;
    el.finalP2Score.textContent = scoreP2;

    // Reset de classes
    el.finalP1Card.classList.remove('winner-card');
    el.finalP2Card.classList.remove('winner-card');

    let winnerName = "";
    let loserName = "";

    if (scoreP1 > scoreP2) {
        winnerName = player1;
        loserName = player2;
        el.finalP1Card.classList.add('winner-card');
        el.endIcon.className = 'fas fa-crown';
    } else if (scoreP2 > scoreP1) {
        winnerName = player2;
        loserName = player1;
        el.finalP2Card.classList.add('winner-card');
        el.endIcon.className = 'fas fa-crown';
    } else {
        // Empate
        winnerName = "";
        el.finalP1Card.classList.add('winner-card');
        el.finalP2Card.classList.add('winner-card');
        el.endIcon.className = 'fas fa-heart';
    }

    if (winnerName) {
        el.endTitle.textContent = `${winnerName} venceu!`;
        el.winnerText.textContent = `👑 Parabéns, ${winnerName}!`;
        el.winnerAnnouncement.style.display = 'flex';
        el.prizeSection.innerHTML = `
            <p class="prize-label">O prêmio é...</p>
            <div class="prize-icon">💋</div>
            <p class="prize-text">Um selinho de ${loserName}!</p>
        `;
        el.finalMessage.textContent = `${loserName}, pague o selinho agora! 😘`;
    } else {
        // Empate
        el.endTitle.textContent = "Empate!";
        el.winnerText.textContent = "💕 Vocês dois são incríveis!";
        el.winnerAnnouncement.style.display = 'flex';
        el.prizeSection.innerHTML = `
            <p class="prize-label">O prêmio é...</p>
            <div class="prize-icon">💋</div>
            <p class="prize-text">Um selinho dos dois!</p>
        `;
        el.finalMessage.textContent = "A sintonia de vocês é perfeita! 💖";
    }

    switchScreen('end');
}

// ==================== EVENT LISTENERS ====================

// Tela Inicial → Tela de Nomes
el.btnPlay.addEventListener('click', () => {
    switchScreen('names');
    el.inputP1.focus();
});

// Validar nomes enquanto digita
el.inputP1.addEventListener('input', validateNames);
el.inputP2.addEventListener('input', validateNames);

// Tela de Nomes → Jogo
el.btnStartGame.addEventListener('click', () => {
    if (el.inputP1.value.trim() && el.inputP2.value.trim()) {
        initGame();
    }
});

// Virar carta
el.card.addEventListener('click', revealCard);

// Botões de resposta
el.btnP1.addEventListener('click', () => answerQuestion('p1'));
el.btnP2.addEventListener('click', () => answerQuestion('p2'));
el.btnBoth.addEventListener('click', () => answerQuestion('both'));
el.btnNone.addEventListener('click', () => answerQuestion('none'));

// Reiniciar
el.btnRestart.addEventListener('click', () => {
    switchScreen('start');
});
