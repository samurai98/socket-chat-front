export type MessageType = {
    id: string
    message: string
    user: {
        id: string
        name: string
    }
}

export type UserType = {
    id: string
    name: string
}