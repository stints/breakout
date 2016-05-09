let _id = 0;

class Entity {
  constructor() {
    this._id = ++_id;
    this._manager = null
  }

  set manager(manager) {
    this._manager = manager;
  }

  addComponent(component) {
    this[component.name()] = component;
  }

  removeComponent(component) {
    let componentName = typeof component == 'string' ? component : component.name();

    delete this[componentName.toLowerCase()];
  }
}
