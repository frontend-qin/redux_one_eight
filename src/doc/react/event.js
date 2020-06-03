import { updateQueue } from './component';
// React  合成事件(异步调用事件，会有问题，需要用 e.persist())
/**
 * 源码使用的事件池的概念
 * const EVENT_POOL_SIZE = 10;
 * getPooledEvent 得到
 * releasePooledEvent 释放掉
 *
 * @param {*} dom
 * @param {*} eventType
 * @param {*} listener
 */
/**
 * 在React 中, 并不是把事件绑定在要绑定的DOM元素上 而是绑定到document 上，类似于事件委托
 * 为什么做合成事件？
 * 1. 可以屏蔽浏览器的差异，不同的浏览器绑定和触发事件的方法不一样
 * 2. 合成事件，可以实现事件对象的复用， 减少垃圾回收， 提高性能
 * 3. 因为默认要实现批量更新， 两个 setState 合并成一次更新，它也是在合成事件中实现的
 * @param {*} dom  要绑定事件的DOM节点
 * @param {*} eventType 事件的类型 比如onClick
 * @param {*} listener 事件处理函数
 */

export function addEvent(dom, eventType, listener) {
  eventType = eventType.toLowerCase();
  // 在绑定的dom节点上挂在一个对象， 准备存放监听函数
  let eventStore = dom.eventStore || (dom.eventStore = {});
  // eventStore.onclick = ()=>{ alert("click")}
  eventStore[eventType] = listener;
  // document.addEventListener('click')
  // 两个阶段： 先事件捕获， 在事件冒泡（false默认是冒泡）
  // 把事件都绑定到document上
  document.addEventListener(eventType.slice(2), dispatchEvent, false);
}

/**
 * 真正事件的触发的回调统一是这个 dispatchEvent
 * 所有的事件处理函数都会进入这个dispatchEvent
 * @param {*} event 就是原来的事件对象， 但是传递给我们的监听函数的并不是它
 */
// 也可以是事件池[], 默认长度为10
// 创建一个合成事件对象的缓存
let syntheticEvent = null;
function dispatchEvent(event) {
  // 从 原有的 event 事件对象中解构出 type(事件的类型) 和 target(作用的元素)
  let { type, target } = event;
  let eventType = 'on' + type; // onclick
  // 给syntheticEvent对象赋值
  syntheticEvent = getSyntheticEvent(event);
  // 在事件监听函数执行前，先进入批量更新模式
  updateQueue.isPending = true;
  // 容易引起内存泄漏
  while (target) {
    // 解构出监听函数对象
    let { eventStore } = target;
    // 从这个对象中 拿到监听函数
    let listener = eventStore && eventStore[eventType];
    // 如果点击的这个元素上有这个监听函数，就执行
    if (listener) {
      // 执行监听函数
      listener.call(target, syntheticEvent);
    }
    // 否则的话，就去父节点上找,所以又进入 while 循环
    target = target.parentNode;
  }
  // 等所有的监听函数执行完了，就清空所有的属性， 供下次复用此syntheticEvent对象(销毁)
  for (let key in syntheticEvent) {
    if (key !== 'persist') syntheticEvent[key] = null;
  }
  // 当事件处理函数执行完成之后，把批量更新改为false
  updateQueue.isPending = false;
  // 执行批量更新，就是把缓存的那个updater 全部执行了
  updateQueue.batchUpdater();
}

// 持久化合成事件源
function persist() {
  syntheticEvent = { persist };
}

// 获取合成事件对象
function getSyntheticEvent(nativeEvent) {
  // 懒加载一个 syntheticEvent 对象（为什么合成事件， 因为它会实现一个缓存）
  // 如果没有的话，也就是就第一次创建， 后边会复用
  if (!syntheticEvent) {
    // 就创建一个新的syntheticEvent对象
    // syntheticEvent = new SyntheticEvent();
    syntheticEvent = { persist };
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.currentTarget = nativeEvent.target;
  // 循环原生事件对象(把原生事件对象上的属性和方法都拷贝到合成事件对象上)
  for (let key in syntheticEvent) {
    // 如果这个原生 事件对象的某个属性的类型是函数
    if (typeof nativeEvent[key] == 'function') {
      // 绑定this 指针
      syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
    } else {
      syntheticEvent[key] = nativeEvent[key];
    }
  }
  return syntheticEvent;
}
