import { combineReducers } from "redux"

import payment from "./modules/payment"
import test from "./modules/test"

export default combineReducers({
  payment,
  test
})
