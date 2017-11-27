import pluginTansformObjectRestSpread from 'babel-plugin-transform-object-rest-spread';
import pluginTransformClassProperties from 'babel-plugin-transform-class-properties';
import pluginTransformRuntime from 'babel-plugin-transform-runtime';
import presetEnv from 'babel-preset-env';
import presetReact from 'babel-preset-react';
import presetStage1 from 'babel-preset-stage-1';
import reactHotLoader from 'react-hot-loader/babel';

export default function babelApplicationPreset (context, opts = {}) {
  const appPreset = {
    presets: [],
    plugins: [],
  };

  if (opts.presetEnv) {
    appPreset.presets.push([
      presetEnv,
      opts.presetEnv,
    ]);
  }

  if (opts.presetReact) {
    appPreset.presets.push(presetReact);
  }

  if (opts.presetStage1) {
    appPreset.presets.push(presetStage1);
  }

  if (opts.pluginRuntime) {
    appPreset.plugins.push([
      pluginTransformRuntime,
      {
        "helpers": true,
        "polyfill": true,
        "regenerator": true,
        ...opts.pluginRuntime,
      }
    ])
  }

  if (opts.pluginTansformObjectRestSpread) {
    appPreset.plugins.push([
      pluginTansformObjectRestSpread,
      {
        "useBuiltIns": true,
        ...opts.pluginTansformObjectRestSpread,
      }
    ]);
  }

  if (opts.pluginTransformClassProperties) {
    appPreset.plugins.push([
      pluginTransformClassProperties,
      {
        spec: false,
        ...opts.pluginTransformClassProperties,
      }
    ]);

    if (opts.reactHotLoader) {
      appPreset.plugins.push(reactHotLoader)
    }
  }

  return appPreset;
}
