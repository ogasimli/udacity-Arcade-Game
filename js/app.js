// Base class, that has properties and methods that will be used by all
// inheriting subclassses
class GameObject {

    constructor(sprite, x, y) {
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
    update(dt)

    /**
     * Draw object using its sprite, x & y coordinates
     */
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



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
