import { CHANGE } from "../../constants/test"
interface State {
  test: boolean;
}
const initState: State = {
  test: false
}

const reducer = (state = initState, action: { type: string }) => {
  const { type } = action
  switch(type) {
    case CHANGE:
      return {
        ...state,
        test: true,
        text: "change text"
      }
    default:
      return state
  }
}

export default reducer