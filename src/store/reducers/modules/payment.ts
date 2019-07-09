import * as types from "../../constants/payment"

interface State {
  signature: any;
  error: any;
  describe: string;
}
interface Action {
  type: string;
  payload: any;
}
const initState: State = {
  signature: {
    x: 1
  },
  error: null,
  describe: ""
}
const reducer = (state: State = initState, action: Action) => {
  const { type, payload } = action
  switch(type) {
    case types.GET_SIGNATRUE:
      return {
        ...state,
        describe: "获取签名中..."
      }
    case types.GET_SIGNATRUE_SUCCESS:
      return {
        ...state,
        describe: "获取签名成功!",
        signature: payload
      }
    case types.GET_SIGNATRUE_ERROR:
      return {
        ...state,
        describe: "获取签名失败~",
        error: payload
      }
    default:
      return state
  }
}
export default reducer
