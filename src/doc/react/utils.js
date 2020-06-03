import { addEvent } from './event';

// 如果 obj 是个数组， 只取第一个元素，如果不是数组， 就返回自己
export function OnlyOne(obj) {
  return Array.isArray(obj) ? obj[0] : obj;
}

/**
 * 给真实dom 节点赋属性
 * @param {*} element
 * @param {*} props
 */
export function setProps(element, props) {
  for (let key in props) {
    if (key !== 'children') {
      let value = props[key];
      setProp(element, key, value);
    }
  }
}
/**
 * 派发更新属性
 * 老有新没有 =》 删除
 * 老新都有=》 更新
 * 老没有新有- 添加
 * @param {*} dom
 * @param {*} oldProps
 * @param {*} newProps
 */
export function patchProps(dom, oldProps, newProps) {
  for (const key in oldProps) {
    // 只处理自己的dom属性， 不处理子节点
    if (key !== 'children') {
      // 如果此老属性在新的属性对象中不存在，则删除
      if (!newProps.hasOwnProperty(key)) {
        dom.removeAttribute(key);
      }
    }
  }
  // 覆盖新的
  for (const key in newProps) {
    // 只处理自己的dom属性， 不处理子节点
    if (key !== 'children') {
      // 如果此老属性在新的属性对象中不存在，则删除
      setProp(dom, key, newProps[key]);
      console.log(dom, key, newProps[key]);
    }
  }
}

/**
 * 给具体的dom每一个属性赋值
 * @param {*} dom dom元素
 * @param {*} key dom 属性
 * @param {*} value dom 值
 */
function setProp(dom, key, value) {
  // console.log('key:', key);
  // 如果是已on 开头的，说明就是事件
  if (/^on/.test(key)) {
    // dom[key.toLowerCase()] = value;
    // 使用合成事件
    addEvent(dom, key, value);
  } else if (key === 'style') {
    // 如果是style，说明是内置样式
    for (let propName in value) {
      dom.style[propName] = value[propName];
    }
  } else {
    // 处理如果是className的属性名， 就把className 改为class
    dom.setAttribute(key === 'className' ? 'class' : key, value);
  }
}

/**
 * 将一个多维数组打平，变成一个数组
 * [1,2,[4,5,[7]]] => [1,2,3,4,5,6,7]
 * @param {*} array
 */
export function flatten(array) {
  let flatten = [];
  (function flat(array) {
    array.forEach((item) => {
      if (Array.isArray(item)) {
        flat(item);
      } else {
        flatten.push(item);
      }
    });
  })(array);
  return flatten;
}

// 判断是不是一个函数
export function isFunction(obj) {
  return typeof obj === 'function';
}
