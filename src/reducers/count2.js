import { ADD2, CUT2 } from './type';

// 初始数据
let initData = {
  num: 2,
};

// 创建reducer
export function count2Reducer(state = initData, action) {
  switch (action.type) {
    case ADD2:
      return {
        num: state.num + 1,
      };
    case CUT2:
      return {
        num: state.num - action.num,
      };
    default:
      return state;
  }
}
