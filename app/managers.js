/*
  EntityManager - creates and stores entities for use
*/
class EntityManager {
  constructor(dispatch) {
    this._dispatch = dispatch;
    this._entities = [];    // all entities
    this._groups = {};      // entities by group
    this._components = {};  // entities by components
  }

  get entities() {
    return this._entities;
  }

  get total() {
    return this._entities.length;
  }

  // createEntity will create an entity and add it into its stores
  createEntity(group) {
    this._groups[group] = this._groups[group] || [];

    let entity = new Entity();
    entity.manager = this;
    this._entities.push(entity);
    this._groups[group].push(entity);

    return entity;
  }

  addComponent(entity, ...components) {
    components.forEach(function (component) {
      if(component instanceof Component) {
        entity.addComponent(component);
        this._components[component.name()] = this._components[component.name()] || [];
        this._components[component.name()].push(entity);
      }
    }, this);
  }

  removeComponent(entity, component) {
    entity.removeComponent(component);
    let entities = this._components[component]
    for(let i = 0; i < entities.length; i++) {
      if(entities[i]._id == entity._id) {
        entities = entities.splice(i, 1);
      }
    }
  }

  // return a single entity by id, return null if not found
  getEntityById(id) {
    for(let i = 0; i < this.total; i++) {
      if(this._entities[i]._id == id) {
        return this._entities[i];
      }
    }
    return null;
  }

  // return the array of all entities that have the specific component
  getEntitiesByComponent(component) {
    if(this._components.hasOwnProperty(component)) {
      return this._components[component];
    }
    return [];
  }

  // return the array of all entities in a group, return empty array if group doesn't exist
  getEntitiesByGroup(group) {
    if(this._groups.hasOwnProperty(group)) {
      return this._groups[group];
    }
    return [];
  }

  // check if given entity is in a group
  inGroup(entity, group) {
    if(this._groups.hasOwnProperty(group)) {
      let entities = this._groups[group];

      for(let i = 0; i < entities.length; i++) {
        if(entities[i]._id = entity._id) {
          return true;
        }
      }
    }
    return false;
  }
}


class EventManager {
  constructor() {
    this._events = {};
  }

  on(type, callback) {
    this._events[type] = this._events[type] || {};
    this._events[type] = callback;
  }

  emit(type, entity = null, args = null) {
    if(this._events.hasOwnProperty(type)) {
      this._events[type](entity, args);
    }
  }
}
