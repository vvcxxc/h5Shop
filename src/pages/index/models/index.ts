/*
 * @Author: yanxiaodi 929213769@qq.com
 * @Date: 2019-02-02 23:30:34
 * @LastEditors: yanxiaodi 929213769@qq.com
 * @LastEditTime: 2019-02-06 16:32:02
 * @Description: counter - model
 */
import { fromJS } from 'immutable'

const SEARCHNAME = 'SEARCHNAME'
const SETSEARCHNAME = 'SETSEARCHNAME'
const initState = fromJS({
  serchName: ''
})

export default {
  namespace: 'search',
  state: initState,  
  effects: { // Action 处理器，处理异步动作
    * searchname({ payload }, { put }: DvaApi) {
      yield put({ type: SEARCHNAME, payload }) //put 发出一个action
    }
  },
  reducers: { // 处理同步操作
    SEARCHNAME(state: any, payload: any): any {
      console.log(payload,'paylodad')
      return state
        .merge({
          serchName: payload.payload.serchName
        })
    }
  }
}

/*
call：执行异步函数
put：发出一个 Action，类似于 dispatch

Effect:  Action 处理器，处理异步动作
function *addAfter1Second(action, { put, call }) {
  yield call(delay, 1000);
  yield put({ type: 'add' });
}



Reducer 是 Action 处理器，用来处理同步操作

function add(state) { return state + 1; }
// 往 [] 里添加一个新 todo
function addTodo(state, action) { return [...state, action.payload]; }

// 往 { todos: [], loading: true } 里添加一个新 todo，并标记 loading 为 false
function addTodo(state, action) {
  return {
    ...state,
    todos: state.todos.concat(action.payload),
    loading: false
  };
}

dva 提供 app.model 这个对象

dispatch 是一个函数方法，用来将 Action 发送给 State。

connect 是一个函数，绑定 State 到 View。

Action 是用来描述 UI 层事件的一个对象。


State 是储存数据的地方，收到 Action 以后，会更新数据。

View 就是 React 组件构成的 UI 层，从 State 取数据后，渲染成 HTML 代码
*/