#version 330 core

out vec4 finalColor;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float seconds;

#define PI 3.14159265359

#define cx_mul(a, b) vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x)
#define cx_div(a, b) vec2(((a.x*b.x + a.y*b.y)/(b.x*b.x + b.y*b.y)),((a.y*b.x - a.x*b.y)/(b.x*b.x + b.y*b.y)))
#define cx_sin(a) vec2(sin(a.x) * cosh(a.y), cos(a.x) * sinh(a.y))
#define cx_cos(a) vec2(cos(a.x) * cosh(a.y), -sin(a.x) * sinh(a.y))


vec2 as_polar(vec2 z) {
  return vec2(
    length(z),
    atan(z.y, z.x)
  );
}


vec2 cx_tan(vec2 a) {
    return cx_div(cx_sin(a), cx_cos(a));
}


vec2 cx_log(vec2 a) {
    vec2 polar = as_polar(a);
    float rpart = polar.x;
    float ipart = polar.y;
    if (ipart > PI) ipart=ipart-(2.0*PI);
    return vec2(log(rpart),ipart);
}
vec2 cx_pow(vec2 v, float p) {
  vec2 z = as_polar(v);
  return pow(z.x, p) * vec2(cos(z.y * p), sin(z.y * p));
}


vec3 palette(vec2 v, float m) {
    float l = length(v);
    if (l > m) l = m;

    float r = pow(l, 2) / pow(m, 2);
    float g = -l*(l - m) * 4 / pow(m, 2);
    float b = -pow(l, 2) / pow(m, 2) + 1;
    return vec3(r, g, b);
}

vec2 transfer(vec2 s, float a, float b) {
    vec2 num = s - vec2(a, 0);
    vec2 denum = cx_pow(s - vec2(a, 0), 2.0) + vec2(pow(b, 2), 0);
    vec2 f = cx_div(num, denum);
    return f;
}

// Main function
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - 1.0;
    vec2 mouse_uv = 2.0 * mouse.xy / resolution.xy - 1.0;
    mouse_uv.y *= -1;

    vec2 s = uv * 4;
    vec2 v = transfer(s, -1, 0.5);
    vec3 color = palette(v, mod(seconds, 5) + 2);

    if (abs(uv.x) < 0.003) color = vec3(0);
    if (abs(uv.y) < 0.003) color = vec3(0);
    finalColor = vec4(color, 1.0);
}