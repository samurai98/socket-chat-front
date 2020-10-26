import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {createConnection, destroyConnection, sendMessage, setClientName, typeMessage} from './chat-reducer';
import {useSelector, useDispatch} from 'react-redux'
import {AppStateType} from './index'


function App() {

    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const typingUsers = useSelector((state: AppStateType) => state.chat.typingUsers)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(createConnection())
        return () => {
            dispatch(destroyConnection())
        }
    }, [])

    const [message, setMessage] = useState('test')
    const [name, setName] = useState('')
    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [messages])
    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    return (

        <div className='App'>
            <div>
                <div style={{
                    border: '1px solid black',
                    padding: '10px',
                    height: '300px',
                    width: '300px',
                    overflowY: 'scroll'
                }}
                     onScroll={(e) => {
                         const maxScrollPosition = e.currentTarget.scrollHeight - e.currentTarget.clientHeight
                         if (e.currentTarget.scrollTop > lastScrollTop
                             && Math.abs(maxScrollPosition - e.currentTarget.scrollTop) < 10) {
                             setIsAutoScrollActive(true)
                         } else {
                             setIsAutoScrollActive(false)
                         }
                         setLastScrollTop(e.currentTarget.scrollTop)
                     }}>
                    {messages.map((m: any) => {
                        return <div key={m.id}>
                            <b>{m.user.name}: </b> {m.message}
                            <hr/>
                        </div>
                    })}
                    {typingUsers.map((u: any) => {
                        return <div key={u.id}>
                            <i>{u.name}: </i> ...
                        </div>
                    })}
                    <div ref={messagesAnchorRef}></div>
                </div>
                <div>
                    <input value={name} onChange={e => setName(e.currentTarget.value)}/>
                    <button onClick={() => {
                        dispatch(setClientName(name))
                    }}>send name
                    </button>
                </div>
                <textarea value={message}
                          onKeyPress={() => {
                              dispatch(typeMessage())
                          }}
                          onChange={(e) => setMessage(e.currentTarget.value)}>
                </textarea>
                <button onClick={() => {
                    dispatch(sendMessage(message))
                    setMessage('')
                }}>send
                </button>
            </div>
        </div>
    );
}

export default App;
