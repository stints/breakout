/*
  Level handles the creation of each levels entities
*/
class Level {
  constructor(manager, dispatch) {
    this._manager = manager;      // EntityManager
    this._dispatch = dispatch;    // Event dispatcher
    this._levels = [];            // array of level objects, loaded via setLevelData
  }

  // setLevelData reads the JSON file containing the details for the level
  setLevelData(file) {
    
  }

  // loads a level, each level corrosponds to a this._levels index
  loadLevel(level) {

  }
}
