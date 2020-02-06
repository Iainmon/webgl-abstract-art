$runtime
$noise
$space
$patterns

void program(inout vec3 color, in vec2 uv) {
    
    // float initScale = 10.;
    // float scale = u_seed.w * initScale;
    float atime = abs(sin(u_time));
    float scale = 4.;
    float daimonds = daimonds(tile(uv,10.));

    // color *= scale;
    // color *= u_seed.xyz;
    vec2 st = rotate(uv * scale, u_seed.z * 100.);
    // st *= daimonds * u_seed.w;
    st *= fluidWarp(u_seed.xy - st);
    // st *= rand(st);
    float l0 = perlin(st + u_seed.x * .1);
    float l1 = noise(st + u_seed.x * l0 * .1);
    // float l2 = noise(st + l1 * .1);
    float l2 = noise(st + u_seed.x * l1 * 2.);

    float mesa = l0 * l1 * l2;

    // color *= u_seed.xyz;
    // color.g *= l0 * .1;
    // color *= vec3(uv + .5, .9);
    color.r *= u_seed.x * l2;
    color.g *= u_seed.y * l1;
    color.b *= u_seed.z * l0;

    // mesa *= daimonds * .5;

    color *= .1 * mesa + 2.;

    // color *= daimonds * 10000.;
    // color *= u_seed.w;

}