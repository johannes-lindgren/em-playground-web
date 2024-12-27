import * as Pixi from 'pixi.js'
import { PixiComponent } from '@pixi/react'

export const Mesh = PixiComponent<
  {
    geometry: Pixi.Geometry
    shader: Pixi.Shader
  },
  Pixi.Mesh<Pixi.Shader>
>('Mesh', {
  create: (props) => {
    // instantiate something and return it.
    // for instance:
    return new Pixi.Mesh(props.geometry, props.shader)
  },
  didMount: (instance, parent) => {
    // apply custom logic on mount
  },
  willUnmount: (instance, parent) => {
    // clean up before removal
  },
  applyProps: (instance, oldProps, newProps) => {
    // props changed
    // apply logic to the instance
  },
  config: {
    // destroy instance on unmount?
    // default true
    destroy: true,

    /// destroy its children on unmount?
    // default true
    destroyChildren: true,
  },
})
