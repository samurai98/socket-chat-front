import {api} from '../api/api'
import {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {MessageType, UserType} from '../types/entities'
import {AppStateType} from './store'

type InitialStateType = {
    messages: Array<MessageType>
    typingUsers: Array<UserType>
}

const initialState = {
    messages: [],
    typingUsers: []
}

export const chatReducer = (state: InitialStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'messages-received': {
            return {...state, messages: action.messages}
        }
        case 'new-message-received': {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter((u: UserType) => u.id !== action.message.user.id)
            }
        }
        case 'typingUserAdded': {
            return {
                ...state,
                typingUsers: [...state.typingUsers.filter((u: UserType) => u.id !== action.user.id), action.user]
            }
        }
        default:
            return state

    }
}

type ActionsType =
    messagesReceivedActionType
    | newMessageReceivedActionType
    | typingUserAddedActionType

type messagesReceivedActionType = {
    type: 'messages-received'
    messages: Array<MessageType>
}
type newMessageReceivedActionType = {
    type: 'new-message-received'
    message: MessageType
}
type typingUserAddedActionType = {
    type: 'typingUserAdded'
    user: UserType
}

const messagesReceived = (messages: Array<MessageType>): messagesReceivedActionType => ({
    type: 'messages-received',
    messages
})
const newMessageReceived = (message: MessageType): newMessageReceivedActionType => ({
    type: 'new-message-received',
    message
})
const typingUserAdded = (user: UserType): typingUserAddedActionType => ({type: 'typingUserAdded', user})

type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsType>;
type ThunkDispatchType = ThunkDispatch<AppStateType, unknown, ActionsType>;

export const createConnection = (): ThunkType => (dispatch: ThunkDispatchType) => {
    api.createConnection()
    api.subscribe(
        (messages: Array<MessageType>, fn: () => void) => {
            dispatch(messagesReceived(messages))
            fn()
        },
        (message: MessageType) => {
            dispatch(newMessageReceived(message))
        },
        (user: UserType) => {
            dispatch(typingUserAdded(user))
        }
    )
}

export const setClientName = (name: string): ThunkType => (dispatch: ThunkDispatchType) => {
    api.sendName(name)
}

export const sendMessage = (message: string): ThunkType => (dispatch: ThunkDispatchType) => {
    api.sendMessage(message)
}

export const typeMessage = (): ThunkType => (dispatch: ThunkDispatchType) => {
    api.typeMessage()
}

export const destroyConnection = (): ThunkType => (dispatch: ThunkDispatchType) => {
    api.destroyConnection()
}

