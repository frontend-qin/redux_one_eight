import { isFunction } from './utils';
import { compareTwoElements } from './vdom';
// 更新队列
export let updateQueue = {
  updaters: [], // 放着将要执行的更新器对象
  isPending: false, // 是否是批量更新模式，如果为true，则是批量更新的模式（不是真正的更新），如果为false，才会去真正的更新
  add(updater) {
    // 添加更新器，放进去就完事，不进行真正的更新
    this.updaters.push(updater);
  },
  // 只有当调用这个方法时，才会真正的去更新
  batchUpdater() {
    // 强制全部更新，执行真正的更新
    let { updaters } = this;
    this.isPending = true; // 先进入批量更新
    let updater;
    while ((updater = updaters.pop())) {
      updater.updateComponent(); // 更新所有的 dirty 组件
    }
    this.isPending = false; // 改为非批量更新
  },
};
class Updater {
  constructor(componentInstance) {
    // 一个 updater 和一个类组件实例是一对1的关系
    this.componentInstance = componentInstance;
    this.pendingStates = []; //更新可能是批量的， 如果处于批量更新的话， 需要把分状态都先暂存到这个数组，最后在更新的时候重新合并
    this.nextProps = null; // 新的属性对象
  }
  addState(partialState) {
    this.pendingStates.push(partialState); // 先把新状态放入数组中
    this.emitUpdate(); // 开始视图更新
  }
  // 可能会传入一个新的属性对象
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // 如果传入了新的属性对象， 或者当前非批量更新模式的话， 就直接更新。否则先不更新
    // 如果有新属性对象， 或者要立即更新
    if (nextProps || !updateQueue.isPending) {
      this.updateComponent();
    } else {
      // 如果当前是批量更新的模式， 则把自己这个updater 实例放到 updateQueue 数组里
      updateQueue.add(this);
    }
  }
  // 更新组件
  updateComponent() {
    let { componentInstance, pendingStates, nextProps } = this;
    // 长度大于0，说明有等待执行合并的更新状态
    if (nextProps || pendingStates.length > 0) {
      // 是否要更新
      shouldUpdate(componentInstance, nextProps, this.getState());
    }
  }
  getState() {
    let { componentInstance, pendingStates } = this;
    let { state } = componentInstance; // 获取老组件的当前状态
    if (pendingStates.length > 0) {
      pendingStates.forEach((nextState) => {
        // nextState 可能是个对象， 也可能是个函数
        if (isFunction(nextState)) {
          state = nextState.call(componentInstance, state);
        } else {
          state = { ...state, ...nextState };
        }
      });
    }
    // 用完之后，就清除 pendingState
    pendingStates.length = 0;
    return state;
  }
}
// 判断是否要更新
function shouldUpdate(componentInstance, nextProps, nextState) {
  componentInstance.props = nextProps;
  componentInstance.state = nextState;
  if (
    componentInstance.shouldComponentUpdate &&
    !componentInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    return false; // 不更新
  }
  componentInstance.forceUpdate(); // 让组件强制刷新
}
class Component {
  constructor(props) {
    this.props = props;
    // this 就是这个类组件的实例
    this.$updater = new Updater(this);
    this.state = {}; // 当前状态
    this.nextProps = null; // 下一个属性对象
  }
  // 批量更新(状态可能会被合并)
  setState(partialState) {
    this.$updater.addState(partialState);
  }
  // 进行组件的实际更新
  forceUpdate() {
    let { props, state, renderElement: oldRenderElement } = this;
    // 组件将要更新
    if (this.componentWillUpdate) {
      this.componentWillUpdate();
    }
    // 拿到最新的render虚拟dom
    let newRenderElement = this.render(); //重新渲染获取新的 react 元素
    // 比较新老虚拟dom 之后，返回一个新的虚拟dom
    let currentComponent = compareTwoElements(
      oldRenderElement,
      newRenderElement
    );
    this.renderElement = currentComponent;

    // 组件更新完成
    if (this.componentDidUpdate) {
      this.componentDidUpdate();
    }
  }
}
// 类组件和函数组件编译之后都是 函数， 通过此属性来区分函数组件和类组件
Component.prototype.isReactComponent = {};
export { Component };
