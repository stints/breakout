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
    this._systems.push(
     new RenderSystem(this._canvas, this._dispatch, this._manager)
     //new VelocitySystem(canvas, this._dispatch),
     //new InputSystem(canvas, this._dispatch, 38, 40, 81, 65),
     //new CollisionSystem(canvas, this._dispatch),
     //new PositionSystem(canvas, this._dispatch),
     //new TextSystem(canvas, this._dispatch)
    );
  }

  start() {

  }

  update() {
    for(let i = 0; i < this._systems.length; i++) {
      this._systems[i].update();
    }
  }
}
