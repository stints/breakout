/*
  Game
*/
class Game {
  constructor(canvas) {
    this._canvas = canvas;
    this._dispatch = new EventManager();
    this._manager = new EntityManager(this._dispatch);
    this._levels = new Level(this._manager, this._dispatch)
    this._systems = []

    this._scoreScene = new Score(document.getElementById('score'), this._manager, this._dispatch);
    this._overlayScene= new Overlay(document.getElementById('scene'), this._manager, this._dispatch);
  }

  setup() {
    this._overlayScene.drawStart();
    this._inStartScene = true;
    this._inPlay = false;

    let paddle = this._manager.createEntity('paddles');
    this._manager.addComponent(paddle,
      new RenderComponent('rect', 'blue'),
      new DimensionComponent(140, 15),
      new CollisionComponent(true),
      new PositionComponent(430, 545),
      new VelocityComponent(0, 0, 10, 10)
    );

    let topWall = this._manager.createEntity('walls');
    this._manager.addComponent(topWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(1000, 5),
      new PositionComponent(0, 80),
      new CollisionComponent(true)
    );

    let rightWall = this._manager.createEntity('walls');
    this._manager.addComponent(rightWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(5, 500),
      new PositionComponent(995, 80),
      new CollisionComponent(true)
    );

    let leftWall = this._manager.createEntity('walls');
    this._manager.addComponent(leftWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(5, 500),
      new PositionComponent(0, 80),
      new CollisionComponent(true)
    );

    let bottomWall = this._manager.createEntity('walls');
    this._manager.addComponent(bottomWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(990, 5),
      new PositionComponent(5, 575),
      new CollisionComponent(true)
    );

    this._systems.push(
     new InputSystem(this._canvas, this._dispatch, this._manager, 'KeyA', 'KeyD'),
     new VelocitySystem(this._canvas, this._dispatch, this._manager),
     new CollisionSystem(this._canvas, this._dispatch, this._manager),
     new HealthSystem(this._canvas, this._dispatch, this._manager),
     new RenderSystem(this._canvas, this._dispatch, this._manager),
     new PositionSystem(this._canvas, this._dispatch, this._manager)
     //new TextSystem(canvas, this._dispatch)
    );

    this._canvas.focus();

    this._dispatch.on('restartBall', (entity, args) => this.restartBall(entity, args));
    this._scoreScene.draw(3);

    this._dispatch.on('spaceEntered', (entity, args) => this.spaceEntered(entity, args));
    this._dispatch.on('gameover', (entity, args) => this.gameover());
  }

  gameover() {
    this._overlayScene.drawGameOver();
    this._manager.removeAllEntites();
  }

  spaceEntered(entity, args) {
    if(this._inStartScene) {
      this._overlayScene.clearCanvas();
      this._inStartScene = false;
      this.restartBall();
    } else {
      if(!this._inPlay) {
        this._dispatch.emit('shoot', entity, args);
      }
    }
  }

  restartBall(entity = null, args = null) {
    this._inPlay = false;
    let health = entity != null ? entity.health.health : 3;
    this._manager.removeEntitiesByGroup('balls');

    let ball = this._manager.createEntity('balls');
    this._manager.addComponent(ball,
      new RenderComponent('rect', 'green'),
      new DimensionComponent(6, 6),
      new PositionComponent(497, 542),
      new VelocityComponent(0, 0, 5, 5),
      new CollisionComponent(true),
      new HealthComponent(health)
    );

    let paddle = this._manager.getEntitiesByGroup('paddles')[0];
    this._manager.removeComponent(paddle, 'input');
    paddle.position.x = 430;
    paddle.position.y = 545;

    this._dispatch.on('shoot', (entity, args) => this.shootBall(entity, args));
  }

  shootBall(entity, args) {
    this._inPlay = true;
    let ball = this._manager.getEntitiesByGroup('balls')[0];
    let paddle = this._manager.getEntitiesByGroup('paddles')[0];

    ball.velocity.dx = 2.5;
    ball.velocity.dy = -2.5;

    this._manager.addComponent(paddle,
      new InputComponent('KeyA', 'KeyD')
    );

    this._dispatch.off('shoot');
  }

  start() {
    this._levels.nextLevel();

    window.requestAnimationFrame(() => this.update());
  }

  update() {
    for(let i = 0; i < this._systems.length; i++) {
      this._systems[i].update();
    }

    if(this._manager.getEntitiesByGroup('bricks').length <= 0) {
      if(this._levels.hasNextLevel()) {
        this.restartBall();
        this._overlayScene.drawNextLevel();
        this._levels.nextLevel();
      }
    }


    window.requestAnimationFrame(() => this.update());
  }
}
