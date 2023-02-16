import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import blockchainReducer from "./blockchain/blockchainReducer";
import stakeReducer from "./blockchain/stakeReducer";
import dataReducer from "./data/dataReducer";
import stakedataReducer from "./data/stakedataReducer";

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  blockchain2: stakeReducer,
  data: dataReducer,
  data2: stakedataReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const store = configureStore();

export default store;
