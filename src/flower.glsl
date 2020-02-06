#include "glsl/runtime.glsl"
#include "glsl/noise.glsl"
#include "glsl/space.glsl"
#include "glsl/patterns.glsl"

#define blue vec3(0.075, 0.114, 0.329)

void program(inout vec3 color) {
    
    vec2 st = uv;
    
    float warp = 0.5 * perlin(st + perlin(st + u_time));
    
    vec3 flowerColor = vec3(st, 0.65);
    vec2 l0 = st * (0.1 * warp + 1.0);

    float t = 2. * sin(u_time) + .5;
    float nt = .2 * sin(u_time) + .5;

    // vec2 l1 = tile(l0, 2.);
    vec2 l1 = tile(st, 3.);
    l1 = rotate(l1, u_time * 2);
    float outerFlower1 = radialShape(l1, 3., 3., .3, .5);
    float innerFlower1 = radialShape(l1, 9. * nt, 3., .1, .5);
    float circle1 = circle(l1, nt * 0.01);

    color *= mix(vec3(1.0), flowerColor, circle1 + outerFlower1 - innerFlower1);
    
}