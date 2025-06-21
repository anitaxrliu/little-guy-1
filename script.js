let score = 0;
let currentRequest = null;
let requestTimeout = null;
let isHappy = true;

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
    
    // Option 2: If using CSS background-image (uncomment if needed)
    // catElement.style.backgroundImage = `url(${catImages[mood]})`;
    // catElement.style.backgroundSize = 'cover';
    // catElement.style.backgroundPosition = 'center';
    // catElement.textContent = ''; // Remove emoji when using background image
}

// Initialize the game
function startGame() {
    updateStatus("yippeeyippeeyippee! 😊");
    updateCatImage('happy'); // 🖼️ Uncomment when using images
    scheduleNextRequest();
}

function scheduleNextRequest() {
    // Random delay between 3-8 seconds
    const delay = Math.random() * 5000 + 3000;
    requestTimeout = setTimeout(() => {
        makeRequest();
    }, delay);
}

function makeRequest() {
    if (currentRequest) return; // Don't overlap requests
    
    const randomRequest = requests[Math.floor(Math.random() * requests.length)];
    currentRequest = randomRequest;
    isHappy = false;
    
    // Change cat to sad
    updateCatImage('sad');  // 🖼️ Uncomment when using images
    cat.classList.remove('happy');
    
    // Show request bubble
    requestBubble.textContent = requestMessages[randomRequest];
    requestBubble.classList.add('show');
    
    updateStatus(`your guy needs ${randomRequest}! hurry before she explodes!!!!`);
    
    // Auto-clear request after 15 seconds if not fulfilled
    setTimeout(() => {
        if (currentRequest === randomRequest) {
            // Penalty for missing request
            score -= 50;
            updateScore();
            
            clearRequest();
            updateStatus("mewmew..mewmew 😔");
            // REMOVED: The automatic makeHappy() call after missed requests
            // The cat will now stay sad until the next request is fulfilled
        }
    }, 7000);
}

function clearRequest() {
    currentRequest = null;
    requestBubble.classList.remove('show');
    scheduleNextRequest();
}

function makeHappy() {
    isHappy = true;
    updateCatImage('happy'); // 🖼️ Uncomment when using images
    cat.classList.add('happy');
    updateStatus("yippeeyippeeyippee! 😊");
}

function fulfillRequest(item) {
    if (currentRequest === item) {
        // Successful fulfillment
        score += 10;
        updateScore();
        cat.classList.add('fed');
        setTimeout(() => cat.classList.remove('fed'), 600);
        
        updateStatus(`nomnomnom... ${item}! 🎉`);
        clearRequest();
        
        setTimeout(() => {
            if (!currentRequest) {
                makeHappy();
            }
        }, 2000);
        return true;
    }
    return false;
}

function patCat() {
    score += 2;
    updateScore();
    
    // Create floating heart effect
    createPatEffect();
    
    if (isHappy) {
        updateStatus("hehehuahuahhohooh 💕");
    } else {
        updateStatus("still need something.... 🐾");
    }
    
    // Add a subtle bounce effect
    cat.style.transform = 'scale(1.1)';
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
        draggedItem = e.target.dataset.item;
        e.target.classList.add('dragging');
    });

    item.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
});

cat.addEventListener('dragover', (e) => {
    e.preventDefault();
});

cat.addEventListener('drop', (e) => {
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