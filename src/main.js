import './style.css'

import * as THREE from 'https://unpkg.com/three@0.156.0/build/three.module.js'

const canvas = document.getElementById('bg')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
renderer.setClearColor(0x000000)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 2000)
camera.position.set(0, 0, 420)
camera.lookAt(0, 0, 0)

// lights (subtle, though wireframe material doesn't use lights)
const ambient = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambient)

// create a large plane with many segments for smooth waves
const size = 900
const segs = 240
// vertical plane facing the camera (no rotate) so it sits directly behind the DOM content
const geometry = new THREE.PlaneGeometry(size, size, segs, segs)

// store original positions for stable animation
const posAttr = geometry.attributes.position
const original = new Float32Array(posAttr.array.length)
original.set(posAttr.array)

const material = new THREE.MeshBasicMaterial({ color: 0x3bd1ff, wireframe: true, opacity: 0.95, transparent: true })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 0, 0)
scene.add(mesh)

function resizeRendererToDisplaySize() {
  const width = window.innerWidth
  const height = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const needResize = canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)
  if (needResize) {
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  return needResize
}

let then = 0
function render(now) {
  now *= 0.001
  const dt = now - then
  then = now

  resizeRendererToDisplaySize()

  // animate vertices more dramatically — displace along Z so the plane ripples toward/away from the camera
  const positions = posAttr.array
  const len = positions.length
  for (let i = 0; i < len; i += 3) {
    const ox = original[i]
    const oy = original[i + 1]
    const oz = original[i + 2]

    const t = now
    const a1 = Math.sin((ox * 0.02) + t * 0.6) * 48
    const a2 = Math.cos((oy * 0.025) + t * 0.45) * 28
    const a3 = Math.sin((ox + oy) * 0.015 + t * 0.8) * 18

    positions[i + 2] = oz + a1 + a2 + a3
  }
  posAttr.needsUpdate = true

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

window.addEventListener('resize', () => resizeRendererToDisplaySize())
requestAnimationFrame(render)

