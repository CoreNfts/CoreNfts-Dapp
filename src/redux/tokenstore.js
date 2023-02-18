import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import tokenReducer from "./blockchain/tokenReducer";
import tokendataReducer from "./data/tokendataReducer";

const rootReducer = combineReducers({
  blockchain: tokenReducer,
  data: tokendataReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const tokenstore = configureStore();

export default tokenstore;
