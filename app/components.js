class Component {
  name() {
    return this.constructor.name.toLowerCase().replace('component','');
  }
}

class RenderComponent extends Component {
  constructor(shape, color) {
    super();
    this.shape = shape;
    this.color = color;
  }
}

class DimensionComponent extends Component {
  constructor(width, height, radius) {
    super();
    this.width = width;
    this.height = height;
    this.radius = radius;
  }
}

class CollisionComponent extends Component {
  constructor(collidable = true) {
    super();
    this.collidable = collidable;
  }
}

class VelocityComponent extends Component {
  constructor(dx, dy, maxdx, maxdy) {
    super();
    this.dx = dx;
    this.dy = dy;

    this.maxdx = maxdx;
    this.maxdy = maxdy;
  }
}

class PositionComponent extends Component {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}

class InputComponent extends Component {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
}

class TextComponent extends Component {
  constructor(text) {
    super();
    this.text = text;
  }
}

class HealthComponent extends Component {
  constructor(health) {
    super();
    this.health = health;
  }
}
