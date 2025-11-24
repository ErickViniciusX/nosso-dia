// VARIÁVEIS PRINCIPAIS
const CORRECT_PASSWORD = "amor"; // *** MUDE AQUI PARA A SUA SENHA SECRETA! ***
const memoryGame = document.getElementById('memory-game');
const gameStatus = document.getElementById('game-status');
const loveLetter = document.getElementById('love-letter');

// Configuração das fotos para o jogo (4 pares = 8 cartas)
// *** AS IMAGENS PRECISAM ESTAR EM UMA PASTA CHAMADA 'images' ***
const cardImages = [
    'photo1.jpg', 
    'photo2.jpg', 
    'photo3.jpg', 
    'photo4.jpg'
];

let flippedCards = [];
let matchedPairs = 0;
const totalPairs = cardImages.length;


// ===================================
// 1. LÓGICA DE LOGIN
// ===================================

function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');
    
    if (passwordInput.toLowerCase().trim() === CORRECT_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('content-screen').style.display = 'block';
        initializeGame(); // Inicia o jogo assim que o login for bem-sucedido
    } else {
        errorMessage.textContent = "Senha incorreta. Tente novamente!";
    }
}


// ===================================
// 2. LÓGICA DO JOGO DA MEMÓRIA
// ===================================

function initializeGame() {
    const cards = [...cardImages, ...cardImages]; // Duplica as imagens para formar os pares
    cards.sort(() => 0.5 - Math.random()); // Embaralha as cartas

    memoryGame.innerHTML = ''; // Limpa qualquer conteúdo antigo
    matchedPairs = 0;
    gameStatus.textContent = '';
    loveLetter.style.display = 'none';

    cards.forEach((imageName, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.image = imageName; // Guarda o nome da imagem como identificador
        cardElement.onclick = () => flipCard(cardElement);

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="images/${imageName}" alt="Foto ${index}">
                </div>
                <div class="card-back">
                    ?
                </div>
            </div>
        `;
        memoryGame.appendChild(cardElement);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flip') && !card.classList.contains('match')) {
        card.classList.add('flip');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000); // Verifica a combinação após 1 segundo
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.image === card2.dataset.image;

    if (isMatch) {
        disableCards(card1, card2);
    } else {
        unflipCards(card1, card2);
    }

    flippedCards = []; // Limpa o array para a próxima jogada
}

function disableCards(card1, card2) {
    card1.classList.add('match');
    card2.classList.add('match');
    matchedPairs++;
    gameStatus.textContent = `Pares encontrados: ${matchedPairs} de ${totalPairs}`;

    if (matchedPairs === totalPairs) {
        // Todas as cartas foram combinadas!
        setTimeout(unlockLetter, 500);
    }
}

function unflipCards(card1, card2) {
    // Remove a classe 'flip' para virar as cartas de volta
    setTimeout(() => {
        card1.classList.remove('flip');
        card2.classList.remove('flip');
    }, 1000);
}


// ===================================
// 3. LÓGICA DE DESBLOQUEIO
// ===================================

function unlockLetter() {
    gameStatus.innerHTML = '<h2>🎉 VOCÊ VENCEU! 🎉</h2>';
    loveLetter.style.display = 'block'; // Mostra a carta
    
    // Rola a tela para a carta
    loveLetter.scrollIntoView({ behavior: 'smooth' }); 
}

// O jogo só será inicializado após o login bem-sucedido.