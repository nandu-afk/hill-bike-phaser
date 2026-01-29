const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let bike, ground, cursors, coins, fuel = 100;

new Phaser.Game(config);

function preload() {
  this.load.image('ground', 'https://i.imgur.com/3ZQ3Z0U.png');
  this.load.image('bike', 'https://i.imgur.com/qIufhof.png');
  this.load.image('coin', 'https://i.imgur.com/Wb1qfhK.png');
}

function create() {
  ground = this.physics.add.staticGroup();
  for (let i = 0; i < 50; i++) {
    let y = 500 + Math.sin(i * 0.5) * 80;
    ground.create(i * 200, y, 'ground').setScale(0.5).refreshBody();
  }

  bike = this.physics.add.sprite(100, 300, 'bike');
  bike.setCollideWorldBounds(true);

  this.physics.add.collider(bike, ground);

  coins = this.physics.add.group();
  for (let i = 1; i < 30; i++) {
    coins.create(i * 300, 300, 'coin');
  }

  this.physics.add.overlap(bike, coins, (b, c) => {
    c.destroy();
  });

  this.cameras.main.startFollow(bike);
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.right.isDown && fuel > 0) {
    bike.setVelocityX(200);
    fuel -= 0.1;
  } else if (cursors.left.isDown) {
    bike.setVelocityX(-150);
  } else {
    bike.setVelocityX(0);
  }
    }
