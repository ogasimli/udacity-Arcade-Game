'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Global variables

// Static constant values that don't belong to any particular enemy instance
var ENEMY_Y_POSITIONS = [60, 145, 230];
var ENEMY_SPEEDS = [200, 250, 280, 300, 320, 350, 400, 500];
var ENEMY_CREATION_DELAYS = [200, 300, 400, 500, 650, 750, 900, 1000];

// Static constant values that don't belong to any particular gem instance
var GEM_STRIPES = ['images/gem-blue.png', 'images/gem-orange.png', 'images/gem-green.png'];
var GEM_X_POSITIONS = [126, 227, 328];
var GEM_Y_POSITIONS = [115, 200, 275];
var GEM_EXPIRE_TIMES = [5000, 7000, 8000, 9000];
var GEM_DELAY_TIMES = [10000, 15000, 20000];

// Game variable
var game = void 0;
// Array of enemies
var allEnemies = []; // stores all enemy objects
// Player variable
var player = void 0;
// Gem variable
var allGems = [];

// DOM elements
var scoreBoard = document.querySelector('#score-board');
var scoreElement = document.querySelector('.score');
var modal = document.querySelector('#simpleModal');
var modalCloseBtn = document.querySelector('.modal-close-btn');

// Base class, that has properties and methods that will be used by all
// inheriting subclassses

var GameObject = function () {
    function GameObject(sprite, x, y) {
        var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        _classCallCheck(this, GameObject);

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


    _createClass(GameObject, [{
        key: 'update',
        value: function update() {
            var dt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        }

        /**
        * Reset object to ints initial state
        */

    }, {
        key: 'reset',
        value: function reset() {}

        /**
        * Draw object using its sprite, x & y coordinates
        */

    }, {
        key: 'render',
        value: function render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        /**
        * Checks if two GameObjects on the canvas overlap or touch.
        *
        * @param {GameObject} other    other GameObject
        * @returns                     true if collision happened
        */

    }, {
        key: 'collides',
        value: function collides(other) {
            var xCheck = this.x <= other.x + other.width / 2 && this.x >= other.x - other.width / 2;
            var yCheck = other.y <= this.y + this.height / 2 && other.y >= this.y;
            return xCheck && yCheck;
        }
    }]);

    return GameObject;
}();

// Enemies our player must avoid


var Enemy = function (_GameObject) {
    _inherits(Enemy, _GameObject);

    function Enemy() {
        _classCallCheck(this, Enemy);

        var y = randElement(ENEMY_Y_POSITIONS);

        var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, 'images/enemy-bug.png', 0, y, 101, 171));

        _this.speed = randElement(ENEMY_SPEEDS);
        return _this;
    }

    /**
    * Update object's position
    *
    * @param {number} dt   a time delta between tick to ensure
    *                      same game speed across all computers
    */


    _createClass(Enemy, [{
        key: 'update',
        value: function update(dt) {
            this.x += this.speed * dt;
        }

        /**
        * Reset object to ints initial state
        */

    }, {
        key: 'reset',
        value: function reset() {
            this.x = 0;
        }

        /**
        * Static method to create new Enemy objects randomly
        */

    }], [{
        key: 'generateEnemies',
        value: function generateEnemies() {
            allEnemies.push(new Enemy());
            var delay = randElement(ENEMY_CREATION_DELAYS);
            setTimeout(Enemy.generateEnemies, delay);
        }

        /**
        * Reset all objects inside allEnemies array to their initial states
        */

    }, {
        key: 'resetAllEnemies',
        value: function resetAllEnemies() {
            allEnemies.forEach(function (enemy) {
                return enemy.reset();
            });
        }
    }]);

    return Enemy;
}(GameObject);

// Gems our player must collect


var Gem = function (_GameObject2) {
    _inherits(Gem, _GameObject2);

    function Gem() {
        _classCallCheck(this, Gem);

        var x = randElement(GEM_X_POSITIONS);
        var y = randElement(GEM_Y_POSITIONS);
        var stripe = randElement(GEM_STRIPES);

        var _this2 = _possibleConstructorReturn(this, (Gem.__proto__ || Object.getPrototypeOf(Gem)).call(this, stripe, x, y, 50, 85));

        _this2.expireTime = randElement(GEM_EXPIRE_TIMES);
        switch (stripe) {
            case GEM_STRIPES[0]:
                _this2.value = 20;
                break;
            case GEM_STRIPES[1]:
                _this2.value = 30;
                break;
            case GEM_STRIPES[2]:
                _this2.value = 50;
                break;
            default:
                _this2.value = 20;
                break;
        }
        return _this2;
    }

    /**
     * Static method to remove expired gems from array
     *
     * @param {Gem} gem     expired gem, to be removed from array
     */


    _createClass(Gem, null, [{
        key: 'expireGem',
        value: function expireGem(gem) {
            allGems.forEach(function (element, index) {
                if (gem == element) {
                    allGems.splice(index, 1);
                }
            });
        }

        /**
        * Static method to create new Enemy objects randomly
        */

    }, {
        key: 'generateGems',
        value: function generateGems() {
            var gem = new Gem();
            allGems.push(gem);
            setTimeout(function () {
                Gem.expireGem(gem);
            }, gem.expireTime);
            setTimeout(Gem.generateGems, randElement(GEM_DELAY_TIMES));
        }
    }]);

    return Gem;
}(GameObject);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
// Enemies our player must avoid


var Player = function (_GameObject3) {
    _inherits(Player, _GameObject3);

    function Player() {
        _classCallCheck(this, Player);

        var sprite = 'images/char-princess-girl.png';
        var initXPos = 202;
        var initYPos = 380;

        var _this3 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, sprite, initXPos, initYPos, 101, 171));

        _this3.INITIAL_X_POSITION = initXPos;
        _this3.INITIAL_Y_POSITION = initYPos;
        _this3.VERTICAL_STEP = 83;
        _this3.HORIZONTAL_STEP = 101;
        _this3.MIN_X_POSITION = 0;
        _this3.MAX_X_POSITION = 404;
        return _this3;
    }

    /**
    * Reset object to ints initial state
    */


    _createClass(Player, [{
        key: 'reset',
        value: function reset() {
            this.x = this.INITIAL_X_POSITION;
            this.y = this.INITIAL_Y_POSITION;
        }

        /**
         * Navigate player when arrow keys are pressed
         *
         * @param {String} keyCode  text representation of key pressed by user
         */

    }, {
        key: 'handleInput',
        value: function handleInput(keyCode) {
            // Return if modal is currently showing
            if (!modal.classList.contains('close')) {
                return;
            }
            switch (keyCode) {
                case 'up':
                    game.playJump();
                    if (this.y - this.VERTICAL_STEP < 0) {
                        // winning situation
                        game.win();
                    } else {
                        this.y -= this.VERTICAL_STEP;
                    }
                    break;
                case 'down':
                    if (this.y + this.VERTICAL_STEP <= this.INITIAL_Y_POSITION) {
                        game.playJump();

                        this.y += this.VERTICAL_STEP;
                    }
                    break;
                case 'left':
                    if (this.x - this.HORIZONTAL_STEP >= 0) {
                        game.playJump();

                        this.x -= this.HORIZONTAL_STEP;
                    }
                    break;
                case 'right':
                    if (this.x + this.HORIZONTAL_STEP <= this.MAX_X_POSITION) {
                        game.playJump();

                        this.x += this.HORIZONTAL_STEP;
                    }
                    break;
                default:
                    break;
            }
        }
    }]);

    return Player;
}(GameObject);

/**
 * Game class holding general game info like score and managing game states
 */


var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this._score = 0;
        // Generate Audio objects
        this.jumpAudio = new Audio();
        this.winLoseAudio = new Audio();
        this.powerUpAudio = new Audio();
        // Initialize game
        this.start();
    }

    /**
     * Getter method for score field
     */


    _createClass(Game, [{
        key: 'start',


        /**
         * Initialize and start game
         */
        value: function start() {
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

    }, {
        key: 'updateScoreBoard',
        value: function updateScoreBoard() {
            scoreElement.textContent = this._score;
        }

        /**
         * Reset game state
         */

    }, {
        key: 'reset',
        value: function reset() {
            this._score = 0;
            Enemy.resetAllEnemies();
            player.reset();
        }

        /**
         * Manage case when player collides with bugs
         */

    }, {
        key: 'die',
        value: function die() {
            this.playDeath();
            animateScoreLost();
            this.score -= 50;
            player.reset();
        }

        /**
         * Manage case when player reaches water
         */

    }, {
        key: 'win',
        value: function win() {
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

    }, {
        key: 'powerUp',
        value: function powerUp(gem) {
            Gem.expireGem(gem);
            this.playPowerup();
            animateScoreAdd();
            this.score += gem.value;
        }

        /**
         * Play start audio
         */

    }, {
        key: 'playStart',
        value: function playStart() {
            this.winLoseAudio.src = 'sounds/start.wav';
            this.play(this.winLoseAudio);
        }

        /**
         * Play win audio
         */

    }, {
        key: 'playWin',
        value: function playWin() {
            this.winLoseAudio.src = 'sounds/win.wav';
            this.play(this.winLoseAudio);
        }

        /**
         * Play death audio
         */

    }, {
        key: 'playDeath',
        value: function playDeath() {
            this.winLoseAudio.src = 'sounds/death.wav';
            this.play(this.winLoseAudio);
        }

        /**
         * Play powerup audio
         */

    }, {
        key: 'playPowerup',
        value: function playPowerup() {
            this.powerUpAudio.src = 'sounds/powerup.wav';
            this.play(this.powerUpAudio);
        }

        /**
         * Play jump audio
         */

    }, {
        key: 'playJump',
        value: function playJump() {
            this.jumpAudio.src = 'sounds/jump.wav';
            this.play(this.jumpAudio);
        }

        /**
         * Play audio
         *
         * @param {Audio} audio     audio object that should be played
         */

    }, {
        key: 'play',
        value: function play(audio) {
            audio.play();
        }
    }, {
        key: 'score',
        get: function get() {
            return this._score;
        }

        /**
         * Setter method for score field
         *
         * @param (Number) newScore     new score
         */
        ,
        set: function set(newScore) {
            this._score = Math.max(0, newScore);
            this.updateScoreBoard();
        }
    }]);

    return Game;
}();

// Function to animate clouds after page load


window.onload = function () {
    var tl = new TimelineMax({ repeat: -1 });
    tl.to("#clouds", 30, {
        backgroundPosition: "-2247px 0px",
        //autoRound:false,
        ease: Linear.easeNone
    });
};

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
    scoreBoard.classList.remove('score-lost');
    void scoreBoard.offsetWidth;
}
