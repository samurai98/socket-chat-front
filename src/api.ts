import io from 'socket.io-client'


export const api = {
    socket: null as null | SocketIOClient.Socket,
    createConnection() {
        this.socket = io('http://samurai-chat-back.herokuapp.com/')
    },
    subscribe(initMessagesHandler: (messages: any, fn: () => void) => void,
              newMessageSentHandler: (message: any) => void,
              userTypingHandler: (user: any) => void) {
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessageSentHandler)
        this.socket?.on('user-typing', userTypingHandler)
    },
    sendName(name: string) {
        this.socket?.emit('client-name-sent', name)
    },
    sendMessage(message: string) {
        this.socket?.emit('client-message-sent', message, (error: string) => {
            if(error) alert(error)
        })
    },
    typeMessage() {
        this.socket?.emit('client-typed')
    },
    destroyConnection() {
        this.socket?.disconnect()
        this.socket = null
    }
}