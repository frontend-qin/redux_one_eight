// 需要合并两个小的reucer
import { count1Reducer } from './count1';
import { count2Reducer } from './count2';
import { combineReducers } from './../redux';

export default combineReducers({
  count1: count1Reducer,
  count2: count2Reducer,
});

/**

  自己写的 合并

  export default function (state = {}, action) {
    let finalState = {};
    finalState.count1 = count1Reducer(state.count1, action);
    finalState.count2 = count2Reducer(state.count2, action);
    return finalState;
  }

 */

/**

// count1 对应的就是 导出的 reducer 函数
combineReducers({
  count1: function()(state = initData, action) {
    switch (action.type) {
      case ADD1:
        return {
          num: state.num + 1,
        };
      case CUT1:
        return {
          num: state.num - action.num,
        };
      default:
        return state;
    }
  },
});

 */
