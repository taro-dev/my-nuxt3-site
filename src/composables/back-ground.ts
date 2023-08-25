import {
  Camera,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'
import { Ref } from 'vue'

export const useBox = (
  container: Ref<HTMLElement | null>,
  clientWidth: Ref<number>,
  clientHeight: Ref<number>
) => {
  const renderer = new WebGLRenderer()
  const uniforms = {
    u_time: { type: 'f', value: 1.0 },
    u_resolution: { type: 'v2', value: new Vector2() },
    u_mouse: { type: 'v2', value: new Vector2() },
  }
  // シーン作成
  const scene = new Scene()
  // カメラ作成
  const camera = new Camera()

  const init = () => {
    // レンダラー作成
    renderer.setSize(clientWidth.value, clientHeight.value)
    renderer.setPixelRatio(clientWidth.value / clientHeight.value)
    container.value.appendChild(renderer.domElement)

    camera.position.z = 1

    const geometry = new PlaneGeometry(2, 2)

    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: 'void main() { gl_Position = vec4( position, 1.0 ); }',
      fragmentShader:
        'uniform vec2 u_resolution; uniform float u_time; void main() { vec2 st = gl_FragCoord.xy/u_resolution.xy; float r = abs(sin(u_time * 0.1)); gl_FragColor=vec4(st.x,st.y,r,1.0);}',
    })

    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    renderer.render(scene, camera)

    onWindowResize()
    window.addEventListener('resize', onWindowResize, false)
    // // 球体作成
    // const geometry = new SphereGeometry(10, 32, 32)
    // const material = new LineBasicMaterial({ color: 0x6699ff, linewidth: 1 })
    // const sphere = new Line(geometry, material)
    // scene.add(sphere)
    // // 毎フレーム時に実行されるループイベント
    // const tick = () => {
    //   // 箱を回転
    //   sphere.rotation.x += 0.01
    //   sphere.rotation.y += 0.01
    //   // レンダリング
    //   renderer.render(scene, camera)
    //   requestAnimationFrame(tick)
    // }
    // tick()
    // コンテキスト削除
    onUnmounted(() => {
      renderer.dispose()
      renderer.forceContextLoss()
    })
  }
  const onWindowResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    uniforms.u_resolution.value.x = renderer.domElement.width
    uniforms.u_resolution.value.y = renderer.domElement.height
  }

  const animate = () => {
    requestAnimationFrame(animate)
    render()
  }

  const render = () => {
    uniforms.u_time.value += 0.05
    renderer.render(scene, camera)
  }
  return { init, animate }
}
