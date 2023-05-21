import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user';
import appReducer from './reducers/app';
import articleReducer from './reducers/article';
import authReducer from './reducers/auth';

import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'],
}

const reducers = combineReducers({
  app: appReducer,
  user: userReducer,
  article: articleReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export default store;