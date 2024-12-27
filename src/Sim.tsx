import './App.css'
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react'

import { Container, Sprite, Stage, useTick } from '@pixi/react'
import { FederatedPointerEvent, Geometry, Shader } from 'pixi.js'
import fragmentShader from './shaders/triangleColor.vert?raw'
import vertexShader from './shaders/triangleColor.frag?raw'
import emVert from './shaders/em.vert?raw'
import emFrag from './shaders/em.frag?raw'
import * as Pixi from 'pixi.js'
import { Mesh } from './Mesh.tsx'
import { add, div, product, scale, sub, Vec2 } from './math'

const pixelDimensions: Vec2 = [500, 500]
const size = [10, 10]

// Create a buffer to hold the field data (R = Ex, G = Ey, B = Bz, A = unused or auxiliary data)
const emFieldTexture = Pixi.Texture.fromBuffer(
  new Float32Array(product(pixelDimensions) * 4),
  ...pixelDimensions,
)

const emFieldRenderer = new Pixi.Renderer({
  width: pixelDimensions[0],
  height: pixelDimensions[1],
  preserveDrawingBuffer: true,
})
const emFieldRenderTexture = Pixi.RenderTexture.create({
  width: pixelDimensions[0],
  height: pixelDimensions[1],
})
const fieldSprite = new Pixi.Sprite(Pixi.Texture.WHITE) // Placeholder sprite

const fieldShader = Pixi.Shader.from(emVert, emFrag)

fieldShader.uniforms.uEMTexture = emFieldTexture
fieldShader.uniforms.fieldDimensions = pixelDimensions
fieldShader.uniforms.dt = 0.016 // Example time step

const geometry = new Geometry()
  .addAttribute(
    'aVertexPosition',
    [
      // x, y
      0,
      0,
      // x, y
      pixelDimensions[0],
      0,
      // x, y
      0,
      pixelDimensions[1],
      // x, y
      pixelDimensions[0],
      pixelDimensions[1],
    ], // x, y
    2,
  )
  .addAttribute(
    'aCoord',
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ].flatMap((it) => [it[0] * size[0], it[1] * size[1]]),
    2,
  )
  .addIndex([0, 1, 2, 1, 2, 3])

export const Sim = () => {
  return (
    <Stage
      width={800}
      height={600}
      options={{ background: 0x1099bb }}
    >
      <SimWithContext />
    </Stage>
  )
}

// More narrow uniform type
const useUniforms = <T extends Record<string, unknown>>(uniforms: T) => {
  const uniformsObj = useMemo(() => structuredClone(uniforms), [])

  useEffect(() => {
    Object.assign(uniformsObj, uniforms)
  }, [uniforms.time])

  return uniformsObj
}

type MousePosition = {
  previous: Vec2
  current: Vec2
}

type FieldUniforms = {
  time: number
  dt: number
  mousePosition: Vec2
  mouseVelocity: Vec2
}

const useShader = (
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, any>,
) => {
  const uniformsStable = useUniforms(uniforms)

  return useMemo(
    () => Shader.from(fragmentShader, vertexShader, uniformsStable),
    [fragmentShader, vertexShader, uniformsStable],
  )
}

// TODO rename
type State = {
  dt: number
  time: number
  mousePosition: MousePosition
  mouseVelocity: Vec2
}

const SimWithContext: FunctionComponent = () => {
  const [state, setState] = useState<State>({
    dt: 0,
    time: 0,
    mousePosition: {
      previous: [0, 0],
      current: [0, 0],
    },
    mouseVelocity: [0, 0],
  })
  const [mousePosition, setMousePosition] = useState<Vec2>([0, 0])
  const containerRef = useRef<Pixi.Container>(null)

  const uniforms = useUniforms<FieldUniforms>({
    time: state.time,
    dt: state.dt,
    mousePosition: state.mousePosition.current,
    mouseVelocity: state.mouseVelocity,
  })

  useTick((_, ticker) => {
    const dt = ticker.deltaMS / 1000
    setState((prev) => {
      const weight = 0.1
      const newMousePosition = {
        previous: prev.mousePosition.current,
        current: add(
          scale(mousePosition, weight),
          scale(prev.mousePosition.current, 1 - weight),
        ),
      }
      const mouseVelocity = div(
        sub(newMousePosition.current, newMousePosition.previous),
        dt,
      )

      emFieldRenderer.render(fieldSprite, {
        renderTexture: emFieldRenderTexture,
      })

      return {
        dt,
        time: prev.time + dt,
        mousePosition: newMousePosition,
        mouseVelocity,
      }
    })
  })

  const shader = useShader(vertexShader, fragmentShader, uniforms)

  const handleMouseOver = (e: FederatedPointerEvent) => {
    const local = containerRef.current?.toLocal(e.data.global)

    setMousePosition((oldState) => {
      const current: Vec2 = local
        ? [
            (size[0] * local.x) / pixelDimensions[0],
            (size[1] * local.y) / pixelDimensions[1],
          ]
        : oldState
      return current
    })
  }

  return (
    <Container
      ref={containerRef}
      interactive={true}
      onmousemove={handleMouseOver}
    >
      <Mesh
        geometry={geometry}
        shader={shader}
      />
      {/*<Sprite*/}
      {/*  texture={Pixi.Texture.WHITE}*/}
      {/*  width={pixelDimensions[0]}*/}
      {/*  height={pixelDimensions[1]}*/}
      {/*/>*/}
    </Container>
  )
}

export default Sim
