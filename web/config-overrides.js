module.exports = function override(config, env) {
  console.log(config.module.rules);
  const wasmExtensionRegExp = /libthemis\.wasm$/;

  config.resolve.extensions.push(".wasm");
  config.module.rules.forEach((rule) => {
    (rule.oneOf || []).forEach((oneOf) => {
      if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  config.module.rules = [
    ...config.module.rules,
    // Emscripten JS files define a global. With `exportsloader` we can
    // load these files correctly (provided the global’s name is the same
    // as the file name).
    {
      test: /fibonacci\.js$/,
      loader: "exports-loader",
    },
    // wasm files should not be processed but just be emitted and we want
    // to have their public URL.
    {
      test: wasmExtensionRegExp,
      type: "javascript/auto",
      loader: "file-loader",
      options: {},
    },
  ];
  return config;
};
