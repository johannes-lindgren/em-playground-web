import "./App.css"
import { css } from "@emotion/react"
import Sim from "./Sim.tsx"

function App() {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background-color: #282c34;
      `}
    >
      <Sim />
    </div>
  )
}

export default App
