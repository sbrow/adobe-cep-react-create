import * as React from 'react'

import controller from './controller'

export default function App() {
    //@ts-ignore
    const click = () => { window.session.test() }
    return (
        <div>
            <p>Hello, world!</p>
            <button onClick={click}>Click me</button>
        </div>
    );
}