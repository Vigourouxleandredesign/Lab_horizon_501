import { MAX_SPLASHES } from './config'

/** Fullscreen quad — flip Y des UV (origine WebGL en bas-gauche). */
export const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 vUv;

void main() {
  vUv = a_position * 0.5 + 0.5;
  vUv.y = 1.0 - vUv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

/**
 * Splash cursor à particules : chaque splash est une onde qui naît en un point fixe
 * (posé le long du trajet) et se propage vers l'extérieur en s'étirant dans le sens
 * du mouvement. La déformation de toutes les ondes vivantes est accumulée.
 *
 * Chaque splash est encodé sur 2 uniforms vec4 :
 *   u_splashA[i] = (x, y, dirX, dirY)
 *   u_splashB[i] = (ageNorm, speed, size, active)
 */
export const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform sampler2D u_texture;
uniform vec2 u_texSize;
uniform vec2 u_screenSize;
uniform float u_strength;
uniform float u_hover;
uniform float u_highlight;
uniform float u_splashTail;
uniform float u_splashDirectionBias;
uniform float u_speedPower;
uniform float u_deformStrengthMin;
uniform float u_deformStrengthMax;
uniform float u_stretchMin;
uniform float u_stretchMax;
uniform vec4 u_splashA[${MAX_SPLASHES}];
uniform vec4 u_splashB[${MAX_SPLASHES}];
uniform vec2 u_objectPosition;

/** object-fit: cover + object-position — mappe l’écran [0,1] vers une zone valide de la texture. */
vec2 coverUv(vec2 uv) {
  float screenAspect = u_screenSize.x / max(u_screenSize.y, 1.0);
  float texAspect = u_texSize.x / max(u_texSize.y, 1.0);

  if (screenAspect > texAspect) {
    float visibleY = texAspect / screenAspect;
    float offsetY = (1.0 - visibleY) * u_objectPosition.y;
    return vec2(uv.x, offsetY + uv.y * visibleY);
  }

  float visibleX = screenAspect / texAspect;
  float offsetX = (1.0 - visibleX) * u_objectPosition.x;
  return vec2(offsetX + uv.x * visibleX, uv.y);
}

/** Échantillonne la texture sans smear CLAMP_TO_EDGE (crop dur + clamp aux bords pour le splash). */
vec4 sampleCover(vec2 screenUv) {
  vec2 texUv = clamp(coverUv(screenUv), vec2(0.0), vec2(1.0));
  return texture2D(u_texture, texUv);
}

/** Champ + biais directionnel (étirement du splash dans le sens du geste). */
vec3 splashFieldData(vec2 uv, float aspect) {
  float h = 0.0;
  vec2 bias = vec2(0.0);

  for (int i = 0; i < ${MAX_SPLASHES}; i++) {
    vec4 a = u_splashA[i];
    vec4 b = u_splashB[i];
    if (b.w < 0.5) continue;

    float ageNorm = b.x;
    float speed = b.y;
    float size = b.z;
    float sk = pow(clamp(speed, 0.0, 1.0), u_speedPower);
    float deformK = mix(u_deformStrengthMin, u_deformStrengthMax, sk);
    float stretchK = mix(u_stretchMin, u_stretchMax, sk);

    vec2 center = a.xy;
    vec2 dir = a.zw;

    vec2 d = (uv - center) * vec2(aspect, 1.0);
    vec2 dirA = normalize(dir * vec2(aspect, 1.0) + vec2(0.0001));

    float along = dot(d, dirA);
    vec2 perp = d - along * dirA;

    // Étirement et compression transverse pilotés par la vitesse du geste.
    float stretch = stretchK;
    float alongScaled = along <= 0.0
      ? along / stretch
      : along / (stretch * u_splashTail);
    float widthTight = mix(2.6, 1.6, sk);
    vec2 dWarped = dirA * alongScaled + perp * widthTight;
    float dist = length(dWarped);

    float grow = 1.0 - pow(1.0 - ageNorm, 3.4);
    float radius = size * (0.08 + grow * mix(0.85, 1.25, sk));

    float core = exp(-dist * dist / (size * size * 0.5)) * (1.0 - ageNorm);

    float band = (dist - radius) / (size * mix(0.3, 0.22, sk));
    float ring = exp(-band * band * 5.0);
    float envelope = (1.0 - ageNorm) * mix(0.35, 0.75, sk);

    float local = (core * 0.5 + ring * envelope) * deformK;

    h += local;

    bias -= dirA * local * mix(0.5, 1.35, sk);
    bias += dirA * along * local * mix(0.08, 0.22, sk);
  }

  return vec3(h, bias) * u_hover;
}

float splashField(vec2 uv, float aspect) {
  return splashFieldData(uv, aspect).x;
}

void main() {
  float aspect = u_screenSize.x / max(u_screenSize.y, 1.0);
  // Repère écran (0–1) = même que le curseur ; cover uniquement pour la texture.
  vec2 screenUv = vUv;
  float eps = 0.0016;

  vec3 data = splashFieldData(screenUv, aspect);
  float hx = splashField(screenUv + vec2(eps, 0.0), aspect) - splashField(screenUv - vec2(eps, 0.0), aspect);
  float hy = splashField(screenUv + vec2(0.0, eps), aspect) - splashField(screenUv - vec2(0.0, eps), aspect);

  vec2 gradRefract = vec2(hx, hy) * u_strength;
  vec2 dirRefract = -data.yz * u_strength * u_splashDirectionBias;
  vec2 refract = gradRefract + dirRefract;

  vec2 sampleScreen = screenUv + refract;
  vec4 color = sampleCover(sampleScreen);

  float edge = abs(hx) + abs(hy);
  float gloss = smoothstep(0.012, 0.1, edge) * u_hover * u_highlight;
  color.rgb += gloss * vec3(1.0, 1.04, 1.08);

  gl_FragColor = color;
}
`
