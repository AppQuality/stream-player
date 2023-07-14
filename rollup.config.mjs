// rollup.config.js
import typescript from "rollup-plugin-typescript2";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: "src/index.tsx",
  output: {
    dir: "build",
    format: "cjs",
    exports: "named",
    interop: "auto",
  },
  plugins: [typescript()],
  external: ["react", "styled-components"],
};
