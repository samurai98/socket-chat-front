import {applyMiddleware, combineReducers, createStore} from 'redux'
import {chatReducer} from './chat-reducer'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({chat: chatReducer})

export type AppStateType = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store