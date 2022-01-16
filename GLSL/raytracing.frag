#version 330 core
out vec4 FragColor;
uniform vec2 resolution;
uniform float time;

const int samples_per_pixel = 30;

float rand(float n){return fract(sin(n) * 43758.5453123);}

vec3 unit_vector(vec3 v){
    return v /= length(v);
}

float hit_sphere(vec3 center, float radius, vec3 ray, vec3 ray_origin) {
    vec3 ray_direction = ray - ray_origin;
    vec3 oc = ray_origin - center;
    float a = dot(ray_direction, ray_direction);
    float half_b = dot(oc, ray_direction);
    float c = dot(oc, oc) - radius*radius;
    float discriminant = half_b * half_b - a * c;
    if(discriminant < 0){
        return -1.0;
    }else{
        return (-half_b - sqrt(discriminant)) / a;
    }
}

vec3 ray_color(vec3 ray, vec3 ray_origin){
    vec3 ray_direction = ray - ray_origin;
    float t = hit_sphere(vec3(0.0, 0.0, 0.0), 0.5, ray, ray_origin);
    if(t > 0.0){
        vec3 N = unit_vector(ray_origin + t * ray_direction - vec3(0.0, 0.0, -1.0));
        return (1.0 - normalize((N+1.0)*2).z) * vec3(0.9, 0.9, 0.9) + normalize((N+1.0)*2).z * vec3(0.3, 0.4, 0.8);
    }
    vec3 unit_direction = unit_vector(ray_direction);
    t = 0.5 * (unit_direction.y + 1.0);
    return (1.0 - t) * vec3(1.0, 1.0, 1.0) + t * vec3(0.5, 0.7, 1.0);
}

void main()
{
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 ray_origin = vec3(0.0, 0.0, 3.0);

    vec3 c = vec3(0.0, 0.0, 0.0);
    
//    for(int s = 0; s < samples_per_pixel; ++s) {
//        p.x += (rand(s) - 0.5) / (resolution.x - 1.0);
//        p.y += (rand(s + samples_per_pixel) - 0.5) / (resolution.y - 1.0);
        vec3 ray = vec3(p.xy, 0.0) - ray_origin;
        c += ray_color(ray, ray_origin);        
//    }

//    c /= samples_per_pixel;

    FragColor = vec4(c, 1.0);
}