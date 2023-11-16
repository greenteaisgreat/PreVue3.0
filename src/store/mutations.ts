import * as types from './storeTypes';
import { State, Mutations, HtmlList, HtmlChild } from '../types';

const mutations: Mutations<State> = {
  initializeStore(state: State) {
    if (localStorage.getItem('store')) {
      this.replaceState(
        Object.assign(
          state,
          JSON.parse(localStorage.getItem('store') || `${state}`)
        )
      );
    }
  },
  replaceState(state: State, payload) {
    this.replaceState(payload);
  },
  [types.INC_RERENDER_KEY]: (state: State) => {
    state.rerenderKey++;
  },
  [types.SET_LOGIN]: (state: State, payload) => {
    state.loggedIn = payload;
  },
  [types.NAME_PROJECT]: (state: State, payload) => {
    state.projectName = payload;
  },
  [types.ADD_COMPONENT_TO_COMPONENT_MAP]: (state: State, payload) => {
    const { componentName, htmlList, children, isActive } = payload;
    state.componentMap = {
      ...state.componentMap,
      [componentName]: {
        componentName,
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        children,
        htmlList,
        isActive
      }
    };

    //console.log('htmlList[0] is', htmlList[0].text)
  },
  [types.ADD_TO_SELECTED_ELEMENT_LIST]: (state: State, payload) => {//this
    state.selectedElementList.push({ 
      text: payload, 
      children: [],
      x: 20,
      y: 20,
      w: 100,
      h: 100,
      isActive: Boolean
     });
  },
  [types.SET_SELECTED_ELEMENT_LIST]: (state: State, payload) => {
    state.selectedElementList = payload;
  },
  [types.ADD_TO_COMPONENT_HTML_LIST]: (state: State, elementName) => { //and this
    const componentName: string = state.activeComponent;

    // state.componentMap[componentName].htmlList.push({
    //   text: elementName,
    //   children: [],
    //   x: 20,
    //   y: 20,
    //   w: 100,
    //   h: 100
    // })

    //find the active component and save the index
    const findIndex = function(obj){
      for(const num in obj){
        if(obj[num].componentName === componentName){
          return num
        }
      }
    }
    let index = findIndex(state.routes[state.activeRoute])
    console.log("index", index)

    //also adds to routes

    console.log("COMPONENT HTML LIST FUNCTION", state.routes[state.activeRoute])
    state.routes[state.activeRoute][index].htmlList.push({ 
      text: elementName,
      children: [],
      x: 20,
      y: 20,
      w: 100,
      h: 100,
      isActive: Boolean
    })
  },

  [types.DELETE_FROM_COMPONENT_HTML_LIST]: (state: State, id) => {
    const componentName = state.activeComponent;
    const htmlList = state.componentMap[componentName].htmlList;

    function parseAndDelete(htmlList: HtmlList) {
      htmlList.forEach((element, index) => {
        if (element.children.length > 0) {
          parseAndDelete(element.children);
        }
        if (id === element._id) {
          htmlList.splice(index, 1);
        }
      });

      const copied = htmlList.slice(0);
      state.componentMap[componentName].htmlList = copied;
    }
    parseAndDelete(htmlList);
  },

  [types.SET_CLICKED_ELEMENT_LIST]: (state: State, payload) => {
    const componentName = state.activeComponent;
    state.componentMap[componentName].htmlList = payload;
  },
  [types.DELETE_ACTIVE_COMPONENT]: (state: State) => {
    const { componentMap, activeComponent } = state;

    const newObj = Object.assign({}, componentMap);

    delete newObj[activeComponent];

    for (const compKey in newObj) {
      const children = newObj[compKey].children;
      children.forEach((child, index) => {
        if (activeComponent === child) children.splice(index, 1);
      });
    }
    state.componentMap = newObj;
  },
 

  //new
  [types.DELETE_ACTIVE_ELEMENT]: (state: State) => {
  const { routes, activeElement, activeRoute, componentIndex, elementIndex } = state;
  
  const component = routes[activeRoute][componentIndex];
  const parents = []

  //This pushes all parent elements into an array in descending order, to be referenced later
  function findActiveElement(arr) {
    for (const el of arr) {
      if (el.isActive === true) {
        return
      }
      if (el.children.length > 0) {
        parents.push(el);
        findActiveElement(el.children);
      }
    }
  }

  findActiveElement(component.htmlList)

  let newList
  let elIndex = elementIndex

  //this finds the element we want to delete and returns the updated array that it exists in
  function deleteElement(list, parentArray){
    if(parentArray.length){
      list.forEach((el, i) => {
        if(el === parentArray[0]){
          elIndex = i
          while(parentArray.length){
            deleteElement(el.children, parentArray.shift())
          }
        }
      })
    } else {
      newList = list.slice();
      newList.splice(elIndex, 1);
    }
  };

  const parentsCopy = [...parents]
  deleteElement(component.htmlList, parents)


  if(parentsCopy.length){
      //This makes newList the children array of the parent of the child element being deleted.
    function applyNewList(original, modified, parent, index = 0){
      console.log("PARENT", parent.length)
      if (index < parent.length - 1){
        original.forEach(el => {
          if (el === parent[index]){
            return applyNewList(el.children, modified, parent, index + 1)
          }
        })
      } else { 
        console.log("ORIGINAL", original)
        original.forEach(el => {
          if (el === parent[index]){
            el.children = modified
          }
        })
      }
      return original
    }

    component.htmlList = applyNewList(component.htmlList, newList, parentsCopy)
    
    } 
    //or it just makes newList the htmlList if no nesting is necessary
    else { component.htmlList = newList } 

    //It is currently deleting the array one at at time starting with which is first
  },

  [types.SET_ACTIVE_ELEMENT]: (state: State, payload) => {
    state.activeElement = payload;
  },
  [types.SET_COMPONENT_INDEX]: (state: State, payload) => {
    state.componentIndex = payload;
  },
  [types.SET_ELEMENT_INDEX]: (state: State, payload) => {
    state.elementIndex = payload;
  },


  [types.SET_COMPONENT_MAP]: (state: State, payload) => {
    console.log(payload);
    state.componentMap = payload;
  },
  [types.DELETE_SELECTED_ELEMENT]: (state: State, payload) => {
    console.log(state.selectedElementList)
    //console.log('this is payload:', payload)
    state.selectedElementList.splice(payload, 1);
  },
  [types.SET_STATE]: (state: State, payload) => {
    Object.assign(state, payload);
  },

  [types.ADD_ROUTE]: (state: State, payload) => {
    state.routes = {
      ...state.routes,
      [payload]: []
    };
  },
  [types.ADD_ROUTE_TO_COMPONENT_MAP]: (state: State, payload) => {
    const { route, children } = payload;
    state.componentMap = {
      ...state.componentMap,
      [route]: {
        componentName: route,
        children
      }
    };
  },
  [types.SET_ACTIVE_ROUTE]: (state: State, payload) => {
    state.activeRoute = payload;
  },
  [types.ADD_COMPONENT_TO_ACTIVE_ROUTE_IN_ROUTE_MAP]: (
    state: State,
    payload
  ) => {
    state.routes[state.activeRoute].push(payload);
  },
  [types.SET_ACTIVE_COMPONENT]: (state: State, payload) => {
    state.activeComponent = payload;
  },
  [types.SET_ROUTES]: (state: State, payload) => {
    state.routes = Object.assign({}, payload);
  },
  [types.SET_ACTIVE_ROUTE_ARRAY]: (state: State, payload) => {
    state.routes[state.activeRoute] = payload;
  },
  [types.ADD_COMPONENT_TO_ACTIVE_ROUTE_CHILDREN]: (
    state: State,
    payload: string
  ) => {
    state.componentMap[state.activeRoute].children.push(payload);
  },
  [types.DELETE_PROJECT_TAB]: (state: State, payload) => {
    // delete project tab functionality yet to be implemented
  },
  [types.UPDATE_COMPONENT_CHILDREN_MULTISELECT_VALUE]: (
    state: State,
    payload
  ) => {
    console.log('payload', payload);
    state.componentChildrenMultiselectValue = payload;
  },
  [types.UPDATE_COMPONENT_CHILDREN_VALUE]: (state: State, payload) => {
    const { component, value } = payload;
    state.componentMap[component].children = value;
  },
  [types.UPDATE_ACTIVE_COMPONENT_CHILDREN_VALUE]: (state: State, payload) => {
    state.componentMap[state.activeComponent].children = payload;
  },
  [types.UPDATE_COMPONENT_NAME_INPUT_VALUE]: (state: State, payload) => {
    state.componentNameInputValue = payload;
  },
  [types.ADD_COMPONENT_TO_COMPONENT_CHILDREN]: (state: State, payload) => {
    const { component, value } = payload;
    state.componentMap[component].children.push(value);
  },
  [types.UPDATE_OPEN_MODAL]: (state: State, payload) => {
    state.modalOpen = payload;
  }
};

export default mutations;
