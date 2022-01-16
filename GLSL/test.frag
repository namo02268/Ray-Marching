#version 330 core

out vec4 FragColor;
uniform float time;
uniform vec2 resolution;

vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));

mat3 zrotate(float r) {
    return mat3(cos(r), -sin(r), 0, sin(r), cos(r), 0, 0, 0, 1);
}

mat3 yrotate(float r) {
    return mat3(cos(r), 0, sin(r), 0, 1, 0, -sin(r), 0, cos(r));
}

float dist_func(vec3 pos, float size)
{
    return length(pos) - size;
}

mat3 camera(vec3 ro, vec3 ta)
{
    vec3 up = vec3(0, 1, 0);
    vec3 cw = normalize(ta - ro);
    vec3 cu = normalize(cross(cw, up));
    vec3 cv = normalize(cross(cu, cw));
    return mat3(cu, cv, cw);
}


vec3 getNormal(vec3 pos, float size)
{
    float ep = 0.0001;
    return normalize(vec3(
            dist_func(pos, size) - dist_func(vec3(pos.x - ep, pos.y, pos.z), size),
            dist_func(pos, size) - dist_func(vec3(pos.x, pos.y - ep, pos.z), size),
            dist_func(pos, size) - dist_func(vec3(pos.x, pos.y, pos.z - ep), size)
        ));
}

void main( void )
{   
    vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);


    float dist = 5.0;   // ÉJÉÅÉâÇÃà íu
    vec3 ro = vec3(cos(time) * dist, 0, sin(time) * dist);
    vec3 ta = vec3(1, 0, 0);
    
    vec3 ray = camera(ro, ta) * normalize(vec3(pos, 1.8));

    float t = 0.5 * (ray.y + 1.0);
    vec3 col = (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3(0.5, 0.7, 1.0);
    vec3 cur = ro;

    float size =1.0;
    for (int i = 0; i < 64; i++)
    {
        float d = dist_func(cur, size);
        if (d < 0.0001)
        {
            vec3 normal = getNormal(cur, size);
            float diff = dot(normal, lightDir);
            col = (1.0-diff)*vec3(1.0, 0.5, 0.7) + diff*vec3(0.5, 0.7, 1.0);
            break;
        }
        cur += ray * d;
    }

    FragColor = vec4(col, 1.0);
}