'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Global variables
var ENEMY_Y_POSITIONS = [60, 145, 230];
var ENEMY_SPEEDS = [200, 250, 280, 300, 320, 350, 400, 500];
var ENEMY_CREATION_DELAYS = [100, 200, 300, 400, 500, 650, 750, 900, 1000];
var PLAYER_X_POSITION = 200;
var PLAYER_Y_POSITION = 380;

var allEnemies = []; // stores all enemy objects
var player = void 0;
var gem = void 0;
var allGems = []; // stores all gem objects
var possibleGems = ['images/Gem-Green.png', 'images/Gem-Blue.png', 'images/Gem-Orange.png'];
var highestScore = 0;
var newHighScore = void 0; // true when a new high score is reached.
var score = 0;
//var div = document.getElementById('score-board');
var audio = new Audio();

/**
* Select array element randomly
*
* @param {Array} arr   array to select random element from
*/
function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Base class, that has properties and methods that will be used by all
// inheriting subclassses

var GameObject = function () {
    function GameObject(sprite, x, y) {
        _classCallCheck(this, GameObject);

        // Sprite of the object
        this.sprite = sprite;
        // X coordinate
        this.x = x;
        // Y coordinate
        this.y = y;
    }

    /**
    * Update object's position
    *
    * @param {number} dt   a time delta between tick to ensure
    *                      same game speed across all computers
    */


    _createClass(GameObject, [{
        key: 'update',
        value: function update(dt) {}

        /**
        * Draw object using its sprite, x & y coordinates
        */

    }, {
        key: 'render',
        value: function render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }]);

    return GameObject;
}();

// Enemies our player must avoid


var Enemy = function (_GameObject) {
    _inherits(Enemy, _GameObject);

    function Enemy() {
        _classCallCheck(this, Enemy);

        var sprite = 'images/enemy-bug.png';
        var x = 0;
        var y = randElement(ENEMY_Y_POSITIONS);

        var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, sprite, x, y));

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
        * Static method to create new Enemy objects randomly
        *
        * @return {Enemy}       new random Enemy object
        */

    }], [{
        key: 'generateEnemies',
        value: function generateEnemies() {
            var delay = randElement(ENEMY_CREATION_DELAYS);
            setTimeout(function () {
                return new Enemy();
            }, delay);
        }
    }]);

    return Enemy;
}(GameObject);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
// Enemies our player must avoid


var Player = function (_GameObject2) {
    _inherits(Player, _GameObject2);

    function Player(y) {
        _classCallCheck(this, Player);

        var sprite = 'images/char-boy.png';
        return _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, sprite, PLAYER_X_POSITION, PLAYER_Y_POSITION));
    }

    _createClass(Player, [{
        key: 'handleInput',
        value: function handleInput() {}
    }]);

    return Player;
}(GameObject);

// Randomly generate enemies


allEnemies.push(Enemy.generateEnemies());

// Instantiate and place the player object in a variable called player
player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
