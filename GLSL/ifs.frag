#version 330 core

out vec4 FragColor;
uniform float time;
uniform vec2 resolution;

#define repeat(p, span) mod(p, span) - (0.5 * span)

const float pi = acos(-1.);
const float pi2= pi * 2.;

// 回転
mat2 rot(float a)
{
    float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

// カメラ
mat3 camera(vec3 ro, vec3 ta)
{
    vec3 up = vec3(0, 1, 0);
    vec3 cw = normalize(ta - ro);
    vec3 cu = normalize(cross(cw, up));
    vec3 cv = normalize(cross(cu, cw));
    return mat3(cu, cv, cw);
}

// 四角形
float sdBox(vec3 p, vec3 b)
{
    return length(max(abs(p) - b, 0.0));
}

float map(vec3 p)
{
    vec3 z = p;
    
    float scale = 2.0;
    float sum = scale;
    float d = 1e5;
    
    float iTime = abs(sin(time * 0.5) * 4.0);
    float s = min(floor(iTime), 3.0) + 1.0;
    
    for (float i = 0.; i < s; i++)
    {
        float td = sdBox(z, vec3(0.5)) / sum;
        
        z = abs(z) - vec3(0, 2.0, 0);
        d = min(td, d);
        
        z.xy *= rot(pi * 0.25);
        z *= scale;
        sum *= scale;
    }
    
    return d;
}

// 法線
vec3 normal(vec3 p)
{
    vec2 e = vec2(0.0001, 0.0);
    float d = map(p);
    vec3 n = d - vec3(
        map(p - e.xyy),
        map(p - e.yxy),
        map(p - e.yyx));
    return normalize(n);
}

void main()
{
    // 座標の正規化
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy)/resolution.y;

    // 色の定義
	vec3 col = vec3(0); 

    // カメラ
    float dist = 5.0;                                       // 距離
    vec3 ro = vec3(cos(time) * dist, 1, sin(time) * dist);  // 位置
    vec3 ta = vec3(0, 0, 0);                                // ターゲット
    
    // レイの生成
    vec3 ray = camera(ro, ta) * normalize(vec3(uv, 1.8));   
    
    // レイの現在位置
    vec3 p = ro;

    float d = 0.0, t = 0.0;
    
    // レイマーチング
    for (int i = 0; i < 64; i++)
    {
        d = map(p);
        if (d < 0.01) break;
        p += ray * d;
    }
    
    if (d < 0.01)
    {
        vec3 n = normal(p);
        col = n;
    }
    else
    {
        col = vec3(0.5, 0.8, 1.5) * abs(uv.y * 0.5 - 1.0) ;
    }
    
    // 出力
    FragColor = vec4(col,1.0);
}