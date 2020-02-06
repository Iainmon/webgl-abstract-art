precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_seed;



vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    }else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}

void program(inout vec3 color, in vec2 uv);
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(1.);
    program(color, uv);
    gl_FragColor = vec4(color, 1.);
}

vec2 rotateAround(in vec2 origin, vec2 position, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    
    position.x -= origin.x;
    position.y -= origin.y;
    
    float xnew = position.x * c - position.y * s;
    float ynew = position.x * s + position.y * c;
    
    return vec2(xnew + origin.x, ynew + origin.y);
}