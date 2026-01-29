const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  backgroundColor: "#87CEEB",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let bike, ground, cursors;
let coins, fuel = 100, fuelText, score = 0, scoreText;
let gasBtn, brakeBtn;
let touchingGas = false, touchingBrake = false;

function preload() {
  this.load.image('bike', 'https://i.imgur.com/2RXYXQx.png');
  this.load.image('coin', 'https://i.imgur.com/5v5XH3R.png');
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  ground = this.physics.add.staticGroup();

  let x = 0;
  for (let i = 0; i < 40; i++) {
    let h = Phaser.Math.Between(450, 600);
    let g = ground.create(x, h, null)
      .setDisplaySize(200, 40)
      .refreshBody();
    x += 180;
  }

  bike = this.physics.add.sprite(100, 300, 'bike');
  bike.setScale(0.5);
  bike.setCollideWorldBounds(false);
  bike.setBounce(0.1);

  this.physics.add.collider(bike, ground);

  this.cameras.main.startFollow(bike);
  this.cameras.main.setBounds(0, 0, 8000, 640);

  coins = this.physics.add.group();
  for (let i = 0; i < 30; i++) {
    let c = coins.create(400 + i * 250, Phaser.Math.Between(200, 400), 'coin');
    c.setScale(0.4);
  }

  this.physics.add.overlap(bike, coins, collectCoin, null, this);

  scoreText = this.add.text(10, 10, 'Coins: 0', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);
  fuelText = this.add.text(10, 30, 'Fuel: 100', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);

  gasBtn = this.add.rectangle(280, 550, 100, 60, 0x00ff00, 0.6)
    .setScrollFactor(0)
    .setInteractive();

  brakeBtn = this.add.rectangle(80, 550, 100, 60, 0xff0000, 0.6)
    .setScrollFactor(0)
    .setInteractive();

  gasBtn.on('pointerdown', () => touchingGas = true);
  gasBtn.on('pointerup', () => touchingGas = false);
  brakeBtn.on('pointerdown', () => touchingBrake = true);
  brakeBtn.on('pointerup', () => touchingBrake = false);
}

function update() {
  if (fuel <= 0) {
    bike.setVelocityX(0);
    return;
  }

  if (touchingGas || cursors.right.isDown) {
    bike.setVelocityX(200);
    fuel -= 0.1;
  } else if (touchingBrake || cursors.left.isDown) {
    bike.setVelocityX(-100);
  } else {
    bike.setVelocityX(0);
  }

  fuelText.setText('Fuel: ' + Math.floor(fuel));
}

function collectCoin(player, coin) {
  coin.destroy();
  score++;
  scoreText.setText('Coins: ' + score);
}
