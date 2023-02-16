import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import stakeReducer from "./blockchain/stakeReducer";
import stakedataReducer from "./data/stakedataReducer";

const rootReducer = combineReducers({
  blockchain: stakeReducer,
  data: stakedataReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const stakestore = configureStore();

export default stakestore;
