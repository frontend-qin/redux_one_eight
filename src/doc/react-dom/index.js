import { createDOM } from '../react/vdom';

/**
 * 渲染虚拟dom元素
 * @param element
 * @param container
 */
function render(element, container) {
  // 1. 要把虚拟dom 变成真实dom
  let dom = createDOM(element);
  // 2. 把真实dom 挂载到container 上
  container.appendChild(dom);
}
export default { render };
