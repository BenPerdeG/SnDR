import { useState } from 'react'
import './App.css'

import { describe, expect, it } from "vitest";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <header>Welcome to SnDR</header>
        <body>
          <p>
            Texto
          </p>
        </body>
      </div>
    </>
  )
}

export default App
describe("Example Suite",()=> {
  it("shouldpass",()=>{
    const sum = 2+2;
    expect(sum).toEqual(4)
  })
})