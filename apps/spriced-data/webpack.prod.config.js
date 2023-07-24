// const { withModuleFederation } = require("@nx/angular/module-federation");
// const config = require("./module-federation.config");
// module.exports = withModuleFederation({
//   ...config,
//   /*
//    * Remote overrides for production.
//    * Each entry is a pair of a unique name and the URL where it is deployed.
//    *
//    * e.g.
//    * remotes: [
//    *   ['app1', 'https://app1.example.com'],
//    *   ['app2', 'https://app2.example.com'],
//    * ]
//    */
// });

const { withModuleFederation } = require("@nx/angular/module-federation");
const moduleFederationConfig = require("./module-federation.config");
const webpack = require("webpack");

function getClientEnvironment() {
  // Grab NX_* environment variables and prepare them to be injected
  // into the application via DefinePlugin in webpack configuration.
  const NX_APP = /^NX_/i;

  const raw = Object.keys(process.env)
    .filter((key) => NX_APP.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});

  // Stringify all values so we can feed into webpack DefinePlugin
  return {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
}

module.exports = async (config, context) => {
  const fromModuleFederation = await withModuleFederation({
    ...moduleFederationConfig,
    /*
     * Remote overrides for production.
     * Each entry is a pair of a unique name and the URL where it is deployed.
     *
     * e.g.
     * remotes: [
     *   ['app1', 'https://app1.example.com'],
     *   ['app2', 'https://app2.example.com'],
     * ]
     */
  });

  config = fromModuleFederation(config, context);

  // update config here...
  config.mode = process.env.NODE_ENV || config.mode;

  config.plugins.push(new webpack.DefinePlugin(getClientEnvironment()));
  return config;
};
