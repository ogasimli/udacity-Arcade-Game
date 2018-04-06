// Global variables

// Static constant values that don't belong to any particular enemy instance
const ENEMY_Y_POSITIONS = [60, 145, 230];
const ENEMY_SPEEDS = [200, 250, 280, 300, 320, 350, 400, 500];
const ENEMY_CREATION_DELAYS = [200, 300, 400, 500, 650, 750, 900, 1000];

// Static constant values that don't belong to any particular gem instance
const GEM_STRIPES = ['images/gem-blue.png', 'images/gem-orange.png', 'images/gem-green.png'];
const GEM_X_POSITIONS = [126, 227, 328];
const GEM_Y_POSITIONS = [115, 200, 275];
const GEM_EXPIRE_TIMES = [5000, 7000, 8000, 9000]
const GEM_DELAY_TIMES = [10000, 15000, 20000]

// Game variable
let game;
// Array of enemies
const allEnemies = []; // stores all enemy objects
// Player variable
let player;
// Gem variable
let allGems = [];

// DOM elements
const scoreBoard = document.querySelector('#score-board');
const scoreElement = document.querySelector('.score');
const modal = document.querySelector('#simpleModal');
const modalCloseBtn = document.querySelector('.modal-close-btn');


// Base class, that has properties and methods that will be used by all
// inheriting subclassses
class GameObject {

    constructor(sprite, x, y, width = 0, height = 0) {
        // Sprite of the object
        this.sprite = sprite;
        // X coordinate
        this.x = x;
        // Y coordinate
        this.y = y;
        // Width
        this.width = width;
        // Height
        this.height = height;
    }

    /**
    * Update object's position
    *
    * @param {number} dt   a time delta between tick to ensure
    *                      same game speed across all computers
    */
    update(dt = 0) { }

    /**
    * Reset object to ints initial state
    */
    reset() { }

    /**
    * Draw object using its sprite, x & y coordinates
    */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
    * Checks if two GameObjects on the canvas overlap or touch.
    *
    * @param {GameObject} other    other GameObject
    * @returns                     true if collision happened
    */
    collides(other) {
        const xCheck = this.x <= other.x + other.width / 2 &&
            this.x >= other.x - other.width / 2;
        const yCheck = other.y <= this.y + this.height / 2 &&
            other.y >= this.y;
        return xCheck && yCheck;
    }
}


// Enemies our player must avoid
class Enemy extends GameObject {

    constructor() {
        const y = randElement(ENEMY_Y_POSITIONS);
        super('images/enemy-bug.png', 0, y, 101, 171);
        this.speed = randElement(ENEMY_SPEEDS);
    }

    /**
    * Update object's position
    *
    * @param {number} dt   a time delta between tick to ensure
    *                      same game speed across all computers
    */
    update(dt) { this.x += this.speed * dt; }

    /**
    * Reset object to ints initial state
    */
    reset() { this.x = 0; }

    /**
    * Static method to create new Enemy objects randomly
    */
    static generateEnemies() {
        allEnemies.push(new Enemy());
        const delay = randElement(ENEMY_CREATION_DELAYS);
        setTimeout(Enemy.generateEnemies, delay);
    }

    /**
    * Reset all objects inside allEnemies array to their initial states
    */
    static resetAllEnemies() {
        allEnemies.forEach(enemy => enemy.reset());
    }
}

// Gems our player must collect
class Gem extends GameObject {

    constructor() {
        const x = randElement(GEM_X_POSITIONS)
        const y = randElement(GEM_Y_POSITIONS);
        const stripe = randElement(GEM_STRIPES);
        super(stripe, x, y, 50, 85);
        this.expireTime = randElement(GEM_EXPIRE_TIMES);
        switch (stripe) {
            case GEM_STRIPES[0]:
                this.value = 20
                break;
            case GEM_STRIPES[1]:
                this.value = 30
                break;
            case GEM_STRIPES[2]:
                this.value = 50
                break;
            default:
                this.value = 20;
                break;
        }
    }

    /**
     * Static method to remove expired gems from array
     *
     * @param {Gem} gem     expired gem, to be removed from array
     */
    static expireGem(gem) {
        allGems.forEach((element, index) => {
            if (gem == element) {
                allGems.splice(index, 1);
            }
        });
    }

    /**
    * Static method to create new Enemy objects randomly
    */
    static generateGems() {
        const gem = new Gem();
        allGems.push(gem);
        setTimeout(function () {
            Gem.expireGem(gem);
        }, gem.expireTime);
        setTimeout(Gem.generateGems, randElement(GEM_DELAY_TIMES));
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
// Enemies our player must avoid
class Player extends GameObject {

    constructor() {
        const sprite = 'images/char-princess-girl.png';
        const initXPos = 202;
        const initYPos = 380;
        super(sprite, initXPos, initYPos, 101, 171);
        this.INITIAL_X_POSITION = initXPos;
        this.INITIAL_Y_POSITION = initYPos;
        this.VERTICAL_STEP = 83;
        this.HORIZONTAL_STEP = 101;
        this.MIN_X_POSITION = 0;
        this.MAX_X_POSITION = 404;
    }

    /**
    * Reset object to ints initial state
    */
    reset() {
        this.x = this.INITIAL_X_POSITION;
        this.y = this.INITIAL_Y_POSITION;
    }

    /**
     * Navigate player when arrow keys are pressed
     *
     * @param {String} keyCode  text representation of key pressed by user
     */
    handleInput(keyCode) {
        // Return if modal is currently showing
        if (!modal.classList.contains('close')) {
            return;
        }
        switch (keyCode) {
            case 'up':
                game.playJump();
                if (this.y - this.VERTICAL_STEP < 0) { // winning situation
                    game.win();
                } else {
                    this.y -= this.VERTICAL_STEP
                }
                break;
            case 'down':
                if (this.y + this.VERTICAL_STEP <= this.INITIAL_Y_POSITION) {
                    game.playJump();

                    this.y += this.VERTICAL_STEP
                }
                break;
            case 'left':
                if (this.x - this.HORIZONTAL_STEP >= 0) {
                    game.playJump();

                    this.x -= this.HORIZONTAL_STEP
                }
                break;
            case 'right':
                if (this.x + this.HORIZONTAL_STEP <= this.MAX_X_POSITION) {
                    game.playJump();

                    this.x += this.HORIZONTAL_STEP
                }
                break;
            default:
                break;
        }
    }
}

/**
 * Game class holding general game info like score and managing game states
 */
class Game {

    constructor() {
        this._score = 0;
        // Generate Audio objects
        this.jumpAudio = new Audio;
        this.winLoseAudio = new Audio;
        this.powerUpAudio = new Audio;
        // Initialize game
        this.start();
    }

    /**
     * Getter method for score field
     */
    get score() {
        return this._score;
    }

    /**
     * Setter method for score field
     *
     * @param (Number) newScore     new score
     */
    set score(newScore) {
        this._score = Math.max(0, newScore);
        this.updateScoreBoard();
    }

    /**
     * Initialize and start game
     */
    start() {
        // Play start sound
        this.playStart();
        // Randomly generate enemies
        Enemy.generateEnemies();
        // Instantiate and place the player object in a variable called player
        player = new Player();
        // Instantiate gem object
        Gem.generateGems();
    }

    /**
     * Update score board, whenever score is updated
     */
    updateScoreBoard() {
        scoreElement.textContent = this._score;
    }

    /**
     * Reset game state
     */
    reset() {
        this._score = 0;
        Enemy.resetAllEnemies();
        player.reset();
    }

    /**
     * Manage case when player collides with bugs
     */
    die() {
        this.playDeath();
        animateScoreLost();
        this.score -= 50;
        player.reset();
    }

    /**
     * Manage case when player reaches water
     */
    win() {
        this.playWin();
        animateScoreAdd();
        this.score += 10;
        player.reset();
    }

    /**
     * Manage case when player collides with gem
     *
     * @param {Gem} gem     gem that player collided with
     */
    powerUp(gem) {
        Gem.expireGem(gem);
        this.playPowerup();
        animateScoreAdd();
        this.score += gem.value;
    }

    /**
     * Play start audio
     */
    playStart() {
        this.winLoseAudio.src = 'sounds/start.wav';
        this.play(this.winLoseAudio);
    }

    /**
     * Play win audio
     */
    playWin() {
        this.winLoseAudio.src = 'sounds/win.wav';
        this.play(this.winLoseAudio);
    }

    /**
     * Play death audio
     */
    playDeath() {
        this.winLoseAudio.src = 'sounds/death.wav';
        this.play(this.winLoseAudio);
    }

    /**
     * Play powerup audio
     */
    playPowerup() {
        this.powerUpAudio.src = 'sounds/powerup.wav';
        this.play(this.powerUpAudio);
    }

    /**
     * Play jump audio
     */
    playJump() {
        this.jumpAudio.src = 'sounds/jump.wav';
        this.play(this.jumpAudio);
    }

    /**
     * Play audio
     *
     * @param {Audio} audio     audio object that should be played
     */
    play(audio) {
        audio.play();
    }
}

// Function to animate clouds after page load
window.onload = function () {
    const tl = new TimelineMax({ repeat: -1 });
    tl.to("#clouds", 30, {
        backgroundPosition: "-2247px 0px",
        //autoRound:false,
        ease: Linear.easeNone
    });
}

/**
 * IIFE starting game
 */
void function startGame() {
    game = new Game();
}();

// Listen for clicks and close modal when close button
modalCloseBtn.addEventListener('click', toggleModal);

// Listens for key presses and send the keys to Player.handleInput() method
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
* Open/close modal
*/
function toggleModal() {
    modal.classList.toggle('close');
}

/**
* Select array element randomly
*
* @param {Array} arr   array to select random element from
*/
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Add score-add class to score-board to animate score increase
 */
function animateScoreAdd() {
    removeScoreAnimations();
    scoreBoard.classList.add('score-add');
}

/**
 * Add score-lost class to score-board to animate score decrease
 */
function animateScoreLost() {
    removeScoreAnimations();
    scoreBoard.classList.add('score-lost');
}

/**
 * Remove previous animation class from score-board and force reflow
 */
function removeScoreAnimations() {
    scoreBoard.classList.remove('score-add');
    scoreBoard.classList.remove('score-lost')
    void scoreBoard.offsetWidth;
}