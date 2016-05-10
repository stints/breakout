class System {
  constructor(canvas, dispatch, manager) {
    this._canvas = canvas;
    this._dispatch = dispatch;
    this._manager = manager;
  }
}

class RenderSystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);
    this._ctx = this._canvas.getContext('2d');
  }

  clearCanvas(x, y, width, height) {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  // RenderSystem assumes that anything with a RenderComponent also has a PositionComponent
  update() {
    var entities = this._manager.getEntitiesByComponent('render');

    this.clearCanvas();

    for(let i = 0; i < entities.length; i++) {
      // DimensionComponent
      let width = entities[i].dimension.width;
      let height = entities[i].dimension.height;

      // RenderComponent
      let color = entities[i].render.color;

      // PositionComponent
      let x = entities[i].position.x;
      let y = entities[i].position.y;

      this._ctx.fillStyle = color;
      this._ctx.fillRect(x, y, width, height);
    }
  }
}

class VelocitySystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);
  }

  // VelocitySystem assumes that anything with a VelocityComponent also has a PositionComponent
  update() {
    var entities = this._manager.getEntitiesByComponent('velocity');

    for(let i = 0; i < entities.length; i++) {
      let dx = entities[i].velocity.dx;
      let dy = entities[i].velocity.dy;

      entities[i].position.x += dx;
      entities[i].position.y += dy;
    }
  }
}

class InputSystem extends System {
  constructor(canvas, dispatch, manager, ...allowedKeys) {
    super(canvas, dispatch, manager);

    this._keys = {};
    for(let key = 0; key < allowedKeys.length; key++) {
      this._keys[allowedKeys[key]] = false;
    }

    canvas.onkeydown = canvas.onkeyup = (e) => this.listener(e);
  }

  listener(e) {
    if(this._keys.hasOwnProperty(e.code)) {
      this._keys[e.code] = e.type == 'keydown';
    }

    //this.dispatch.emit('keydown');
    e.preventDefault();
  }

  // InputSystem assumes that anything with an InputComponent also has a VelocityComponent
  update() {
    var entities = this._manager.getEntitiesByComponent('input');

    for(let i = 0; i < entities.length; i++) {
      let left = entities[i].input.left;
      let right = entities[i].input.right;

      entities[i].velocity.dx = this._keys[left] ? -5 : this._keys[right] ? 5 : 0;
    }
  }
}

class CollisionSystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);
  }

  intersect(entity1, entity2) {
    return entity1.position.x < entity2.position.x + entity2.dimension.width &&
            entity1.position.x + entity1.dimension.width > entity2.position.x &&
            entity1.position.y < entity2.position.y + entity2.dimension.height &&
            entity1.position.y + entity1.dimension.height > entity2.position.y;
  }

  // CollisionSystem assumes that anything with an CollisionComponent also has a PositionComponent
  update() {
    // Since the only thing that is moving in the game are balls and paddles
    let balls = this._manager.getEntitiesByGroup('balls');
    let paddles = this._manager.getEntitiesByGroup('paddles');

    let collidableEntities = this._manager.getEntitiesByComponent('collision');
    let walls = this._manager.getEntitiesByGroup('walls');

    // check if balls are colliding with anything
    for(let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      for(let j = 0; j < collidableEntities.length; j++) {
        let entity = collidableEntities[j];
        if(ball.id === entity.id) {
          continue;
        }
        if(this.intersect(ball, entity)) {
          //this._dispatch('hit', entity, ball);
          if(ball.position.y < entity.position.y || ball.position.y + ball.dimension.height > entity.position.y + entity.dimension.height) {
            ball.velocity.dy *= -1;
          }
          if(ball.position.x < entity.position.x || ball.position.x + ball.dimension.width > entity.position.x + entity.dimension.width) {
            ball.velocity.dx *= -1;
          }
        }
      }
    }

    // check if paddles are colliding with walls
    for(let i = 0; i < paddles.length; i++) {
      let paddle = paddles[i];
      for(let j = 0; j < walls.length; j++) {
        let wall = walls[j];
        if(this.intersect(paddle, wall)) {
          if(paddle.position.x < wall.position.x + wall.dimension.width &&
            paddle.position.x + paddle.dimension.width > wall.position.x + wall.dimension.width) { // paddle hits left wall
            console.log(paddle.position.x);
            paddle.position.x = wall.position.x + wall.dimension.width
          } else if(paddle.position.x + paddle.dimension.width >= wall.position.x) {
            paddle.position.x = wall.position.x - paddle.dimension.width;
          }
        }
      }
    }
  }
}
