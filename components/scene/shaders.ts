// Full-screen sky. uA is altitude: 0 = ground-level blue sky with clouds, 1 = black space,
// stars and the curve of the Earth.
export const SKY_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;

export const SKY_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime, uA;
  uniform vec2 uRes, uMouse;

  float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0., a = .5;
    for (int i = 0; i < OCTAVES; i++) { v += a * n(p); p = p * 2.03 + 17.1; a *= .5; }
    return v;
  }
  vec3 ramp3(vec3 a, vec3 b, vec3 c, float t) { return t < .5 ? mix(a, b, smoothstep(0., .5, t)) : mix(b, c, smoothstep(.5, 1., t)); }

  void main() {
    vec2 uv = vUv; float asp = uRes.x / uRes.y; float A = uA;
    vec3 top = ramp3(vec3(.33, .58, .86), vec3(.06, .12, .32), vec3(.004, .006, .018), A);
    vec3 bot = ramp3(vec3(.85, .92, .98), vec3(.34, .52, .82), vec3(.02, .03, .08), A);
    vec3 col = mix(top, bot, pow(1. - uv.y, 1.5));

    vec2 sun = vec2(.8, .9) + uMouse * .01;
    float d = length((uv - sun) * vec2(asp, 1.));
    col += exp(-d * mix(3., 9., A)) * mix(vec3(1., .96, .88), vec3(.9, .95, 1.), A) * mix(.5, .35, A);

    // clouds slide away below as you climb; skipped entirely once above them
    float dens = 0.;
    float cloudy = 1. - smoothstep(.25, .62, A);
    if (cloudy > 0.) {
      vec2 q = vec2(uv.x * asp, uv.y);
      vec2 o = vec2(uTime * .006, A * 2.4) + uMouse * .015;
      float c1 = fbm(q * 2.2 + o + fbm(q * 1.4 + uTime * .01) * .9);
      float c2 = n(q * 9. + o * 3.);
      dens = (smoothstep(.5, .82, c1) * .85 + smoothstep(.62, .95, c2) * .25) * smoothstep(-.1, .55, 1.25 - uv.y) * cloudy;
      vec3 cloud = mix(vec3(.78, .84, .93), vec3(1.), smoothstep(.4, .95, c1 + (uv.y - .5) * .3));
      col = mix(col, cloud, clamp(dens, 0., 1.) * .95);
    }

    // the Earth's limb and its thin atmosphere
    float sp = smoothstep(.55, 1., A);
    float earth = 0.;
    if (sp > 0.) {
      vec2 lc = vec2(.5, -2.6); float R = 2.72;
      float ld = length((uv - lc) * vec2(asp * .55, 1.)) - R;
      float limb = exp(-abs(ld) * 60.) * .9 + exp(-max(ld, 0.) * 9.) * .25;
      earth = 1. - smoothstep(-.004, .004, ld);
      col = mix(col, vec3(.01, .02, .05), earth * sp);
      col += limb * vec3(.25, .5, 1.) * sp * (1. - earth * .7);
    }

    // stars
    float st = smoothstep(.4, .9, A);
    if (st > 0.) {
      vec2 sg = (uv + vec2(0., A * .15)) * vec2(asp, 1.) * 170.; vec2 id = floor(sg);
      float s = step(.9965, h(id)) * (1. - smoothstep(.0, .38, length(fract(sg) - .5)));
      s *= .55 + .45 * sin(uTime * 1.6 + h(id + 3.) * 30.);
      col += s * st * (1. - dens) * (1. - earth);
    }

    col += (h(uv * uRes + uTime) - .5) / 255.;
    gl_FragColor = vec4(col, 1.);
  }
`;

export const POINTS_VERTEX = /* glsl */ `
  attribute float aR;
  uniform float uTime, uTurb, uSize, uAspect, uPR;
  uniform vec2 uMouse;
  varying float vA;
  void main() {
    vec3 p = position; float t = uTime * .7 + aR * 40.;
    p += vec3(sin(t), cos(t * 1.3), sin(t * .8)) * (.012 + uTurb * .5 * aR);
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    vec4 clip = projectionMatrix * mv;
    // particles part around the cursor
    vec2 ndc = clip.xy / clip.w; vec2 d = (ndc - uMouse) * vec2(uAspect, 1.); float L = length(d);
    clip.xy += (d / (L + 1e-4)) * smoothstep(.32, 0., L) * .1 * clip.w / vec2(uAspect, 1.);
    gl_Position = clip;
    gl_PointSize = uSize * uPR * (.55 + aR * .9) * (10. / -mv.z);
    vA = .45 + .55 * aR;
  }
`;

export const POINTS_FRAGMENT = /* glsl */ `
  uniform vec3 uColor; uniform float uAlpha; varying float vA;
  void main() {
    float r = length(gl_PointCoord - .5);
    if (r > .5) discard;
    gl_FragColor = vec4(uColor, smoothstep(.5, .05, r) * vA * uAlpha);
  }
`;
