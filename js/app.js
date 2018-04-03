// Abstract game object class
class GameObject {
    constructor(sprite, x, y) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
    }

    update(dt) { }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


// Enemies our player must avoid
class Enemy extends GameObject {
    constructor(x, y, speed) {
        const sprite = 'images/enemy-bug.png';
        super(sprite, x, y);
        this.speed = speed;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
// Enemies our player must avoid
class Player extends GameObject {
    constructor(x, y) {
        const sprite = 'images/char-boy.png';
        super(sprite, x, y);
    }

    handleInput() { }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(0, 60, 200),
    new Enemy(0, 145, 250)
]; // stores all enemy objects
var player = new Player(100, 380);


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