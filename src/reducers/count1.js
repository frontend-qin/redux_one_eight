import { ADD1, CUT1, ASYNCADD } from './type';

// 初始数据
let initData = {
  num: 1,
};

// 创建reducer
export function count1Reducer(state = initData, action) {
  switch (action.type) {
    case ADD1:
      return {
        num: state.num + 1,
      };
    case ASYNCADD:
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
}
