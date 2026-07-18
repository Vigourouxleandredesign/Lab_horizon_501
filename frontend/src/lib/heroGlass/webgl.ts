import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders'

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[HeroGlass] shader compile:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function createGlassProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vs || !fs) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[HeroGlass] program link:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function createFullscreenQuad(gl: WebGLRenderingContext, program: WebGLProgram): number {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )

  const loc = gl.getAttribLocation(program, 'a_position')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  return loc
}

export function loadTexture(
  gl: WebGLRenderingContext,
  image: TexImageSource,
): { texture: WebGLTexture; width: number; height: number } | null {
  const texture = gl.createTexture()
  if (!texture) return null

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

  const width = 'naturalWidth' in image ? image.naturalWidth : (image as ImageBitmap).width
  const height = 'naturalHeight' in image ? image.naturalHeight : (image as ImageBitmap).height

  return { texture, width, height }
}

export type GlassUniforms = {
  texSize: WebGLUniformLocation | null
  screenSize: WebGLUniformLocation | null
  strength: WebGLUniformLocation | null
  hover: WebGLUniformLocation | null
  highlight: WebGLUniformLocation | null
  splashTail: WebGLUniformLocation | null
  splashDirectionBias: WebGLUniformLocation | null
  speedPower: WebGLUniformLocation | null
  deformStrengthMin: WebGLUniformLocation | null
  deformStrengthMax: WebGLUniformLocation | null
  stretchMin: WebGLUniformLocation | null
  stretchMax: WebGLUniformLocation | null
  splashA: WebGLUniformLocation | null
  splashB: WebGLUniformLocation | null
  texture: WebGLUniformLocation | null
  objectPosition: WebGLUniformLocation | null
}

export function getGlassUniforms(gl: WebGLRenderingContext, program: WebGLProgram): GlassUniforms {
  return {
    texSize: gl.getUniformLocation(program, 'u_texSize'),
    screenSize: gl.getUniformLocation(program, 'u_screenSize'),
    strength: gl.getUniformLocation(program, 'u_strength'),
    hover: gl.getUniformLocation(program, 'u_hover'),
    highlight: gl.getUniformLocation(program, 'u_highlight'),
    splashTail: gl.getUniformLocation(program, 'u_splashTail'),
    splashDirectionBias: gl.getUniformLocation(program, 'u_splashDirectionBias'),
    speedPower: gl.getUniformLocation(program, 'u_speedPower'),
    deformStrengthMin: gl.getUniformLocation(program, 'u_deformStrengthMin'),
    deformStrengthMax: gl.getUniformLocation(program, 'u_deformStrengthMax'),
    stretchMin: gl.getUniformLocation(program, 'u_stretchMin'),
    stretchMax: gl.getUniformLocation(program, 'u_stretchMax'),
    splashA: gl.getUniformLocation(program, 'u_splashA'),
    splashB: gl.getUniformLocation(program, 'u_splashB'),
    texture: gl.getUniformLocation(program, 'u_texture'),
    objectPosition: gl.getUniformLocation(program, 'u_objectPosition'),
  }
}
