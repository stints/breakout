/*
  Level handles the creation of each levels entities
*/
class Level {
  constructor(manager, dispatch) {
    this.manager = manager;      // EntityManager
    this.dispatch = dispatch;    // Event dispatcher
    this.levels = LEVELDATA;     // array of level objects

    this.currentLevel = -1;
  }

  get level() {
    return this.currentLevel;
  }

  hasNextLevel() {
    return this.currentLevel + 1 < this.levels.length;
  }

  nextLevel() {
    this.currentLevel++;

    this.loadLevel();
  }

  // loads a level, each level corrosponds to a this._levels index
  loadLevel() {
    let level = this.levels[this.level];

    // delete all current bricks from group
    this.manager.removeEntitiesByGroup(level.group);

    let width = level.dimensions.width;
    let height = level.dimensions.height;
    let types = level.types;

    let startingX = 67;
    let startingY = 147;

    for(var row = 0; row < level.entities.length; row++) {
      for(var col = 0; col < level.entities[row].length; col++) {
        if(level.entities[row][col] === 0) {
          continue;
        };
        let x = startingX + (col * width) + col;
        let y = startingY + (row * height) + row;
        let color = types[level.entities[row][col] - 1].color;
        let health = types[level.entities[row][col] - 1].health;
        let entity = this.manager.createEntity(level.group);
        this.manager.addComponent(entity,
          new DimensionComponent(width, height),
          new RenderComponent('rect', color),
          new CollisionComponent(true),
          new HealthComponent(health),
          new PositionComponent(x, y)
        );
      }
    }
  }
}
