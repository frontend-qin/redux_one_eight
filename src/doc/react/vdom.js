import {
  TEXT,
  ELEMENT,
  CLASS_COMPONENT,
  FUNCTION_COMPONENT,
} from './constants';
import { OnlyOne, setProps, flatten, patchProps } from './utils';

/**
 * 比较新老两个虚拟dom
 * @param {*} oldRenderElement
 * @param {*} newRenderElement
 */
export function compareTwoElements(oldRenderElement, newRenderElement) {
  oldRenderElement = OnlyOne(oldRenderElement);
  newRenderElement = OnlyOne(newRenderElement);

  let currentDOM = oldRenderElement.dom; // 先提取老的dom 节点
  let currentElement = oldRenderElement;

  // 如果新的虚拟dom节点为null， 则要干掉老节点
  if (newRenderElement == null) {
    currentDOM.parentNode.removeChild(currentDOM);
  } else if (oldRenderElement.type !== newRenderElement.type) {
    // 如果节点类型不一样， 则需要创建新的dom 节点
    let newDOM = createDOM(newRenderElement);
    currentDOM.parentNode.replaceChild(newDOM, currentDOM);
    currentElement = newRenderElement;
  } else {
    // 新老节点都有，并且类型一样，就要进行dom-diff深度比较, 比较他们的属性和他们的子节点，并实现尽可能的复用
    // let newDOM = createDOM(newRenderElement);
    // currentDOM.parentNode.replaceChild(newDOM, currentDOM);
    // currentElement = newRenderElement;
    updateElement(oldRenderElement, newRenderElement);
  }
  return currentElement;
}
/**
 * 更新页面真实dom
 * @param {*} oldElement 老节点
 * @param {*} newElement 新节点
 */
function updateElement(oldElement, newElement) {
  // 获取老的页面上真实存在的 那个DOM 节点
  let currentDOM = oldElement.dom;
  newElement.dom = oldElement.dom; // dom实现复用
  // 如果新老节点都是 文本类型
  if (oldElement.$$typeof === TEXT && newElement.$$typeof === TEXT) {
    // 如果文本不一样
    if (oldElement.content !== newElement.content) {
      currentDOM.textContent = newElement.content;
    }
  } else if (oldElement.$$typeof === ELEMENT) {
    // 如果元素是原生dom （div， span, p）,更新它上边的属性
    updateDOMProperties(currentDOM, oldElement.props, newElement.props);
    // updateChildren() // 递归更新子元素
  } else if (oldElement.$$typeof === FUNCTION_COMPONENT) {
    // 处理函数组件的属性改变
    updateFunctionComponent(oldElement, newElement);
  } else if (oldElement.$$typeof === CLASS_COMPONENT) {
    // 处理类组件的属性改变
    updateClassComponent(oldElement, newElement);
  }
}
/**
 *  更新类组件的属性
 */
function updateClassComponent(oldElement, newElement) {
  let componentInstance = oldElement.componentInstance; // 获取老的组件实例
  // let oldRenderElement = componentInstance.renderElement; // 上次渲染的react元素
  let updater = componentInstance.$updater;
  let nextProps = newElement.props; // 新的属性对象
  updater.emitUpdate(nextProps);
}
/**
 *  更新函数组件的属性
  1. 拿到老元素，
  2. 重新执行函数组件，拿到新的元素， 进行对比
 */
function updateFunctionComponent(oldElement, newElement) {
  let oldRenderElement = oldElement.renderElement;
  let newRenderElement = newElement.type(newElement.props);
  // 获取到对比之后的新的element
  let currentElement = compareTwoElements(oldRenderElement, newRenderElement);
  // 更新之后重新渲染
  currentElement.renderElement = currentElement;
  return currentElement;
}

/**
 * 更新dom元素的属性
 */
function updateDOMProperties(dom, oldProps, newProps) {
  // console.log('updateDOMProperties');
  return patchProps(dom, oldProps, newProps);
}
/**
 * 创建 React 元素
 * @param {*} type
 * @param {*} config
 * @param  {...any} children
 */
export function createElement(type, config = {}, ...children) {
  delete config.__self;
  delete config.__source;
  let { key, ref, ...props } = config;
  let $$typeof = null;
  if (typeof type === 'string') {
    // span , div, button
    $$typeof = ELEMENT; // 是一个原生dom 元素
  } else if (typeof type === 'function' && type.prototype.isReactComponent) {
    // 说明这个是类组件
    $$typeof = CLASS_COMPONENT;
  } else if (typeof type === 'function') {
    // 说明这是个函数组件
    $$typeof = FUNCTION_COMPONENT;
  }
  props.children = children.map((item) => {
    // 说明是个React 元素
    if (typeof item === 'object') {
      return item; //  React.createElement('span', { style: { color: 'red' } }, 'Hello')
    } else {
      return {
        $$typeof: TEXT,
        type: TEXT,
        content: item,
      };
    }
  });
  return ReactElement($$typeof, type, key, ref, props);
}
// 创建React 元素 工厂函数
export function ReactElement($$typeof, type, key, ref, props) {
  const element = {
    $$typeof,
    type,
    props,
    key,
    ref,
  };
  return element;
}

/**
 * 把虚拟dom 变成真实dom
 * @param element
 */
export function createDOM(element) {
  element = OnlyOne(element);
  // 拿到虚拟dom 类型
  let { $$typeof } = element;
  let dom = null;
  if (!$$typeof) {
    // 可能是字符串，或者数字
    dom = document.createTextNode(element); // 创建一个文本节点
  } else if ($$typeof === TEXT) {
    // 说明是个对象，就是前边包装后的文本对象
    dom = document.createTextNode(element.content);
  } else if ($$typeof === ELEMENT) {
    // 说明是个 React 元素
    // 如果此虚拟dom 节点是一个原生dom 节点
    dom = createNativeDOM(element);
  } else if ($$typeof === FUNCTION_COMPONENT) {
    dom = createFunctionComponentDOM(element);
    // 如果此虚拟dom是一个函数组件
  } else if ($$typeof === CLASS_COMPONENT) {
    dom = createClassComponentDOM(element);
    // 如果此虚拟dom是一个类组件
  }
  element.dom = dom; // 让dom 属性指向它创建出来的真实dom 元素
  return dom;
}

/**
 * 渲染函数组件的真实dom
 */
function createFunctionComponentDOM(element) {
  let { props, type } = element;

  // 获取渲染的 react 元素（虚拟dom）
  let renderElement = type(props);
  // 需要缓存虚拟dom， 方便下次对比
  element.renderElement = renderElement;
  // 递归创建dom
  let newDom = createDOM(renderElement);
  // 根据虚拟dom（React元素）创建出真实Dom， 创建出来以后会把真实dom，添加到虚拟dom的 dom 属性上
  renderElement.dom = newDom;
  // 返回要渲染的真实dom
  return newDom;
}

/**
 * 渲染类组件的真实dom
 */
function createClassComponentDOM(element) {
  let { type, props } = element;
  // 创建类组件的实例
  let componentInstance = new type(props);
  // 当创建类组件实例后，会在类组件的虚拟dom对象上添加一个componentInstance属性，指向类组件的实例
  element.componentInstance = componentInstance;
  let renderElement = componentInstance.render();
  // 在类组件实例上添加renderElement属性， 指向上一次要渲染的虚拟dom 节点
  // 在组件更新时，会重新render ， 然后跟上一次的renderElement 进行dom -diff
  componentInstance.renderElement = renderElement;
  let newDom = createDOM(renderElement);
  renderElement.dom = newDom;
  return newDom;
}

/**
 * 创建 原生dom 节点
 * @param element
 */

function createNativeDOM(element) {
  let { type, props } = element;
  let dom = document.createElement(type); // 创建一个真实的dom 元素
  // 1. 创建此虚拟dom 节点的子节点
  createDOMChildren(dom, props.children);
  // 2. 给此DOM 元素添加属性
  setProps(dom, props);
  return dom;
}

// 处理此虚拟dom 节点的子节点
function createDOMChildren(parentNode, children) {
  // 可能children 是个多维数组，将数组打平
  children &&
    flatten(children).forEach((child, index) => {
      // child 是虚拟dom， 给每个虚拟dom加一个属性_mountIndex，指向此虚拟dom节点在父节点中的索引
      // 后边做dom-diff 使用
      child._mountIndex = index;
      let childDom = createDOM(child); // 递归重新处理每个子元素,创建子虚拟dom的真实dom节点
      parentNode.appendChild(childDom);
    });
}
