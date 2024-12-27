// Fragment Shader
precision mediump float;

uniform sampler2D uETexture;  // Electric field texture
uniform sampler2D uBTexture;  // Magnetic field texture
uniform float dt;             // Time step
uniform vec2 fieldDimensions; // Dimensions of the field texture

varying vec2 v_texCoord;

void main() {
    vec2 texelSize = 1.0 / fieldDimensions;

    // Read the current electric and magnetic field values from the textures
    vec4 E = texture2D(uETexture, v_texCoord);
    vec4 B = texture2D(uBTexture, v_texCoord);

    // Update the electric field with a simple perturbation (example)
    E.xy += vec2(sin(v_texCoord.x * 10.0), cos(v_texCoord.y * 10.0)) * 0.01 * dt;

    // Update the magnetic field with a basic transformation (example)
    B.z += sin(v_texCoord.x * 5.0) * 0.005 * dt;

    // Write the updated fields back into the texture
    gl_FragColor = vec4(E.xy, B.z, 1.0);
}
