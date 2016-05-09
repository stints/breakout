/*
  Game
*/
class Game {
  constructor() {
    this._canvas = {};
    this._dispatch = new EventManager();
    this._manager = new EntityManager(this._dispatch);
    this._levels = new Level(this._manager, this._dispatch)
  }

  setup() {

  }

  start() {

  }

  update() {

  }
}
