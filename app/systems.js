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
      let maxdx = entities[i].velocity.maxdx;
      let maxdy = entities[i].velocity.maxdy;

      if(Math.abs(dx) > maxdx) {
        dx = dx >= 0 ? maxdx : -1*maxdx;
        entities[i].velocity.dx = dx;
      }
      if(Math.abs(dy) > maxdy) {
        dy = dy >= 0 ? maxdy : -1*maxdy;
        entities[i].velocity.dy = dy;
      }

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

    if(e.code == 'Space' && e.type == 'keyup') {
      this._dispatch.emit('shoot', null, null);
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

      entities[i].velocity.dx = this._keys[left] ? -20 : this._keys[right] ? 20 : 0;
    }
  }
}

class CollisionSystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);
  }

  intersect(entity1, entity2) {
    return entity1.position.x + entity1.velocity.dx <= entity2.position.x + entity2.dimension.width &&
            entity1.position.x + entity1.velocity.dx + entity1.dimension.width >= entity2.position.x &&
            entity1.position.y + entity1.velocity.dy <= entity2.position.y + entity2.dimension.height &&
            entity1.position.y + entity1.velocity.dy + entity1.dimension.height >= entity2.position.y;
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
          if(ball.position.y + ball.velocity.dy <= entity.position.y) {
            ball.velocity.dy *= -1;
            ball.position.y = entity.position.y - ball.dimension.height;
          } else if(ball.position.y + ball.velocity.dy + ball.dimension.height >= entity.position.y + entity.dimension.height) {
            ball.velocity.dy *= -1;
            ball.position.y = entity.position.y + entity.dimension.height;
          } else if(ball.position.x + ball.velocity.dx <= entity.position.x) {
            ball.velocity.dx *= -1;
            ball.position.x = entity.position.x - ball.dimension.width;
          } else if(ball.position.x + ball.dimension.width >= entity.position.x + entity.dimension.width) {
            ball.velocity.dx *= -1;
            ball.position.x = entity.position.x + entity.dimension.width;
          }

          if(entity.group === 'bricks') {
            this._dispatch.emit('hit', entity, ball);
          }
          if(entity.group === 'paddles' && Math.abs(ball.velocity.dx) > 0) {
            let args = {
              'ballx': ball.position.x,
              'paddlex': entity.position.x
            }
            this._dispatch.emit('paddleHit', entity, args)
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
          if(paddle.position.x + paddle.velocity.dx <= wall.position.x + wall.dimension.width &&
            paddle.position.x + paddle.dimension.width + (-1*paddle.velocity.dx) >= wall.position.x + wall.dimension.width) { // paddle hits left wall
            paddle.position.x = wall.position.x + wall.dimension.width;
          } else if(paddle.position.x + paddle.dimension.width >= wall.position.x) {
            paddle.position.x = wall.position.x - paddle.dimension.width;
          }
        }
      }
    }
  }
}

class HealthSystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);

    this._dispatch.on('hit', (entity, args) => this.onHit(entity, args));
    this._dispatch.on('miss', (entity, args) => this.onMiss(entity, args));
  }

  onHit(entity, args) {
    entity.health.health--;
  }

  onMiss(entity, args) {
    entity.health.health--;
    this._dispatch.emit('scoreUpdate', entity, args);
  }

  update() {
    let entities = this._manager.getEntitiesByComponent('health');

    for(let i = 0; i < entities.length; i++) {
      if(entities[i].health.health <= 0) {
        this._manager.removeEntity(entities[i]);
      }
    }
  }
}

class PositionSystem extends System {
  constructor(canvas, dispatch, manager) {
    super(canvas, dispatch, manager);

    this._dispatch.on('paddleHit', (entity, args) => this.paddleHit(entity, args));
  }

  paddleHit(entity, args) {
    // handle angle changes for ball
  }

  update() {
    // this system will check if the ball has gone below the paddle;
    let ballEntities = this._manager.getEntitiesByGroup('balls');
    let paddleEntities = this._manager.getEntitiesByGroup('paddles');

    for(let i = 0; i < ballEntities.length; i++) {
      let ball = ballEntities[i];
      for(let j = 0; j < paddleEntities.length; j++) {
        let paddle = paddleEntities[j];
        if(ball.position.y > paddle.position.y + 5) { // ball has missed paddle
          this._dispatch.emit('miss', ball, null);
          this._dispatch.emit('restartBall', ball, null);
        }
      }
    }
  }
}
