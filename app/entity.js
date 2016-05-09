let _ID = 0;

class Entity {
  constructor(group) {
    this.id = ++_ID;
    this.manager = null
    this.group = group;
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
