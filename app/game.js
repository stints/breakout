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
  }

  setup() {
    let ball = this._manager.createEntity('balls');
    this._manager.addComponent(ball,
      new RenderComponent('rect', 'green'),
      new DimensionComponent(5, 5),
      new PositionComponent(100, 25),
      new VelocityComponent(-1, 1),
      new CollisionComponent(true)
    );

    let paddle = this._manager.createEntity('paddles');
    this._manager.addComponent(paddle,
      new RenderComponent('rect', 'blue'),
      new DimensionComponent(85, 15),
      new InputComponent('KeyA','KeyD'),
      new CollisionComponent(true),
      new PositionComponent(400, 400),
      new VelocityComponent(0, 0)
    );

    let topWall = this._manager.createEntity('walls');
    this._manager.addComponent(topWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(1000, 5),
      new PositionComponent(0, 5),
      new CollisionComponent(true)
    );

    let rightWall = this._manager.createEntity('walls');
    this._manager.addComponent(rightWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(5, 575),
      new PositionComponent(995, 5),
      new CollisionComponent(true)
    );

    let leftWall = this._manager.createEntity('walls');
    this._manager.addComponent(leftWall,
      new RenderComponent('rect', 'black'),
      new DimensionComponent(5, 575),
      new PositionComponent(0, 5),
      new CollisionComponent(true)
    );

    this._systems.push(
     new CollisionSystem(canvas, this._dispatch, this._manager),
     new InputSystem(canvas, this._dispatch, this._manager, 'KeyA', 'KeyD'),
     new VelocitySystem(canvas, this._dispatch, this._manager),
     new RenderSystem(this._canvas, this._dispatch, this._manager)
     //new PositionSystem(canvas, this._dispatch),
     //new TextSystem(canvas, this._dispatch)
    );
  }

  start() {
    this._levels.nextLevel();
    window.requestAnimationFrame(() => this.update());
  }

  update() {
    for(let i = 0; i < this._systems.length; i++) {
      this._systems[i].update();
    }

    window.requestAnimationFrame(() => this.update());
  }
}
