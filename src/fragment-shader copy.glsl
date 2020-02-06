precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_seed;

void program(inout vec3 color, in vec2 uv);

void main(void) {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    // vec3 color = vec3(uv, abs(sin(u_time)));
    vec3 color = vec3(1.);
    program(color, uv);
    gl_FragColor = vec4(color, 1.);
}



void program(inout vec3 color, in vec2 uv) {
    
    float scale = .5 * sin(u_time * 2.) + .5;
    // color *= scale;
    color *= u_seed.xyz;

    // color *= u_seed.w;

}