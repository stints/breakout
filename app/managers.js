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

    let entity = new Entity(group);
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
    if(this._components.hasOwnProperty(component)) {
      let entities = this._components[component];
      for(let i = 0; i < entities.length; i++) {
        if(entities[i].id == entity.id) {
          entities.splice(i, 1);
        }
      }
    }
  }

  removeAllComponents(entity) {
    let keys = Object.keys(entity);
    for(let i = 0; i < keys.length; i++) {
      if(keys[i] != 'id' && keys[i] != '_manager' && keys[i] != 'group') {
        this.removeComponent(entity, keys[i]);
      }
    }
  }

  // return a single entity by id, return null if not found
  getEntityById(id) {
    for(let i = 0; i < this.total; i++) {
      if(this._entities[i].id == id) {
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
        if(entities[i].id = entity.id) {
          return true;
        }
      }
    }
    return false;
  }

  removeEntity(entity) {
    for(let i = 0; i < this.total; i++) {
      if(this._entities[i].id === entity.id) {
        this.removeAllComponents(entity);
        this.removeEntityFromGroup(entity);
        this._entities.splice(i, 1);
        break;
      }
    }
  }

  removeEntityFromGroup(entity) {
    let group = entity.group;
    if(this._groups.hasOwnProperty(group)) {
      let entities = this._groups[group];
      for(let i = 0; i < entities.length; i++) {
        if(entities[i].id === entity.id) {
          this._groups[group].splice(i, 1);
        }
      }
    }
  }

  removeEntitiesByGroup(group) {
    if(this._groups.hasOwnProperty(group)) {
      let entities = this._groups[group];
      for(let i = 0; i < entities.length; i++) {
        this.removeEntity(entities[i]);
      }
    }
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

  off(type) {
    if(this._events.hasOwnProperty(type)) {
      delete this._events[type];
    }
  }

  emit(type, entity = null, args = null) {
    if(this._events.hasOwnProperty(type)) {
      this._events[type](entity, args);
    }
  }
}
