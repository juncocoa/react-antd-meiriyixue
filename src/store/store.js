/**
 * Created by rgu on 6/1/16.
 */

import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './../reducers/reducers';


export default (initialState = {}) => {

    let middleware = applyMiddleware(thunk);

    const store = createStore(reducers, initialState, middleware);

    if (module.hot) {
        module.hot.accept('./../reducers/reducers', () => {
            store.replaceReducer(require('./../reducers/reducers').default);
        });
    }

    return store;

};
