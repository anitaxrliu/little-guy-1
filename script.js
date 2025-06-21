let score = 0;
let currentRequest = null;
let requestTimeout = null;
let isHappy = true;
let missedRequests = 0; // Track missed requests
let gameOver = false; // Track game state

const cat = document.getElementById('cat');
const requestBubble = document.getElementById('requestBubble');
const statusText = document.getElementById('statusText');
const scoreElement = document.getElementById('score');

const requests = ['coffee', 'soup'];
const requestMessages = {
    coffee: 'COFFEE!!! ☕',
    soup: 'sour fish soup... 🍲'
};

// 🖼️ IMAGE PATHS: Define your image paths here
const catImages = {
    sad: 'https://i.imgur.com/ofsr84v.jpeg',  
    happy: 'https://i.imgur.com/PybMYAu.gif' 
};

// 🖼️ FUNCTION: Update cat image based on mood
function updateCatImage(mood) {
    const catElement = document.getElementById('cat');
    
    // Option 1: If using <img> tag in HTML
    const catImg = catElement.querySelector('.cat-image');
    if (catImg) {
        catImg.src = catImages[mood];
    }
}

// Initialize the game
function startGame() {
    score = 0;
    missedRequests = 0;
    gameOver = false;
    isHappy = true;
    updateScore();
    updateStatus("yippeeyippeeyippee! 😊");
    updateCatImage('happy');
    scheduleNextRequest();
}

function scheduleNextRequest() {
    if (gameOver) return; // Don't schedule if game is over
    
    // Random delay between 3-8 seconds
    const delay = Math.random() * 5000 + 3000;
    requestTimeout = setTimeout(() => {
        makeRequest();
    }, delay);
}

function makeRequest() {
    if (currentRequest || gameOver) return; // Don't overlap requests or make requests if game over
    
    const randomRequest = requests[Math.floor(Math.random() * requests.length)];
    currentRequest = randomRequest;
    isHappy = false;
    
    // Change cat to sad
    updateCatImage('sad');
    cat.classList.remove('happy');
    
    // Show request bubble
    requestBubble.textContent = requestMessages[randomRequest];
    requestBubble.classList.add('show');
    
    updateStatus(`your guy needs ${randomRequest}! hurry before she explodes!!!!`);
    
    // Auto-clear request after 7 seconds if not fulfilled
    setTimeout(() => {
        if (currentRequest === randomRequest && !gameOver) {
            // Penalty for missing request
            score -= 50;
            missedRequests++;
            updateScore();
            
            if (missedRequests >= 3) {
                triggerGameOver();
            } else {
                clearRequest();
                updateStatus(`mewmew..mewmew 😔 (${missedRequests}/3 missed)`);
            }
        }
    }, 7000);
}

function triggerGameOver() {
    gameOver = true;
    currentRequest = null;
    
    // Clear any pending timeouts
    if (requestTimeout) {
        clearTimeout(requestTimeout);
    }
    
    // Hide request bubble
    requestBubble.classList.remove('show');
    
    // Create explosion effect
    createExplosionEffect();
    
    // Update status
    updateStatus("💥 GAME OVER! your guy exploded 😭");
    
    // Add restart button after explosion
    setTimeout(() => {
        addRestartButton();
    }, 2000);
}

function createExplosionEffect() {
    // Create multiple explosion particles
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'explosion-container';
    explosionContainer.style.position = 'absolute';
    explosionContainer.style.top = '0';
    explosionContainer.style.left = '0';
    explosionContainer.style.width = '100%';
    explosionContainer.style.height = '100%';
    explosionContainer.style.pointerEvents = 'none';
    explosionContainer.style.zIndex = '1000';
    
    document.querySelector('.cat-container').appendChild(explosionContainer);
    
    // Create explosion particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.textContent = ['💥', '🔥', '⭐', '✨', '💫'][Math.floor(Math.random() * 5)];
        particle.style.position = 'absolute';
        particle.style.fontSize = Math.random() * 30 + 20 + 'px';
        particle.style.left = Math.random() * 300 + 'px';
        particle.style.top = Math.random() * 300 + 'px';
        particle.style.animation = `explode ${Math.random() * 0.5 + 0.5}s ease-out forwards`;
        
        explosionContainer.appendChild(particle);
    }
    
    // Add explosion animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes explode {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1.5) rotate(180deg);
                opacity: 0.8;
            }
            100% {
                transform: scale(2) rotate(360deg);
                opacity: 0;
            }
        }
        
        .restart-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            transition: all 0.3s ease;
            z-index: 1001;
        }
        
        .restart-button:hover {
            background: #ff5252;
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
    `;
    document.head.appendChild(style);
    
    // Make cat shake and fade
    cat.style.animation = 'shake 0.5s ease-in-out infinite';
    cat.style.opacity = '0.3';
    
    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-5px, -5px) rotate(-2deg); }
            50% { transform: translate(5px, -5px) rotate(2deg); }
            75% { transform: translate(-5px, 5px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(shakeStyle);
    
    // Remove explosion after animation
    setTimeout(() => {
        explosionContainer.remove();
    }, 2000);
}

function addRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = '🔄 try again';
    restartButton.className = 'restart-button';
    restartButton.onclick = restartGame;
    
    document.querySelector('.cat-container').appendChild(restartButton);
}

function restartGame() {
    // Remove restart button
    const restartButton = document.querySelector('.restart-button');
    if (restartButton) {
        restartButton.remove();
    }
    
    // Reset cat appearance
    cat.style.animation = '';
    cat.style.opacity = '1';
    cat.style.transform = '';
    cat.style.backgroundColor = '';
    
    // Reset game state
    startGame();
}

function clearRequest() {
    currentRequest = null;
    requestBubble.classList.remove('show');
    if (!gameOver) {
        scheduleNextRequest();
    }
}

function makeHappy() {
    if (gameOver) return;
    
    isHappy = true;
    updateCatImage('happy');
    cat.classList.add('happy');
    updateStatus("yippeeyippeeyippee! 😊");
}

function fulfillRequest(item) {
    if (gameOver) return false;
    
    if (currentRequest === item) {
        // Successful fulfillment
        score += 10;
        updateScore();
        cat.classList.add('fed');
        setTimeout(() => cat.classList.remove('fed'), 600);
        
        updateStatus(`nomnomnom... ${item}! 🎉`);
        clearRequest();
        
        setTimeout(() => {
            if (!currentRequest && !gameOver) {
                makeHappy();
            }
        }, 2000);
        return true;
    }
    return false;
}

function patCat() {
    if (gameOver) return;
    
    score += 2;
    updateScore();
    
    // Create floating heart effect
    createPatEffect();
    
    if (isHappy) {
        updateStatus("hehehuahuahhohooh 💕");
    } else {
        updateStatus("hehehuhauh.... but still need something....");
    }
    
    // Add a subtle bounce effect
    cat.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cat.style.transform = '';
    }, 200);
}

function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0; // Reset to beginning
        audioElement.play().catch(e => {
            console.log('Audio play failed:', e);
            // Browsers block autoplay, so this handles the error gracefully
        });
    }
}

function createPatEffect() {
    const effect = document.createElement('div');
    effect.className = 'pat-effect';
    effect.textContent = '💕';
    effect.style.left = Math.random() * 200 + 50 + 'px';
    effect.style.top = Math.random() * 100 + 100 + 'px';
    
    document.querySelector('.cat-container').appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function updateStatus(message) {
    statusText.innerHTML = message;
}

function updateScore() {
    scoreElement.textContent = score;
}

// Drag and drop functionality
let draggedItem = null;

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
        if (gameOver) {
            e.preventDefault();
            return;
        }
        draggedItem = e.target.dataset.item;
        e.target.classList.add('dragging');
    });

    item.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
});

cat.addEventListener('dragover', (e) => {
    if (!gameOver) {
        e.preventDefault();
    }
});

cat.addEventListener('drop', (e) => {
    if (gameOver) return;
    
    e.preventDefault();
    if (draggedItem) {
        if (fulfillRequest(draggedItem)) {
            // Success feedback
            cat.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                cat.style.backgroundColor = '';
            }, 300);
        } else {
            // Wrong item feedback
            cat.style.backgroundColor = '#ffeaea';
            setTimeout(() => {
                cat.style.backgroundColor = '';
            }, 300);
            updateStatus("wut da... 🤔");
        }
        draggedItem = null;
    }
});

// Start the game
startGame();