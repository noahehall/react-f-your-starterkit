'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = babelApplicationPreset;

var _babelPluginTransformObjectRestSpread = require('babel-plugin-transform-object-rest-spread');

var _babelPluginTransformObjectRestSpread2 = _interopRequireDefault(_babelPluginTransformObjectRestSpread);

var _babelPluginTransformClassProperties = require('babel-plugin-transform-class-properties');

var _babelPluginTransformClassProperties2 = _interopRequireDefault(_babelPluginTransformClassProperties);

var _babelPluginTransformRuntime = require('babel-plugin-transform-runtime');

var _babelPluginTransformRuntime2 = _interopRequireDefault(_babelPluginTransformRuntime);

var _babelPresetEnv = require('babel-preset-env');

var _babelPresetEnv2 = _interopRequireDefault(_babelPresetEnv);

var _babelPresetReact = require('babel-preset-react');

var _babelPresetReact2 = _interopRequireDefault(_babelPresetReact);

var _babelPresetStage = require('babel-preset-stage-1');

var _babelPresetStage2 = _interopRequireDefault(_babelPresetStage);

var _babel = require('react-hot-loader/babel');

var _babel2 = _interopRequireDefault(_babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function babelApplicationPreset(context, opts = {}) {
  const appPreset = {
    presets: [],
    plugins: []
  };

  if (opts.presetEnv) {
    appPreset.presets.push([_babelPresetEnv2.default, opts.presetEnv]);
  }

  if (opts.presetReact) {
    appPreset.presets.push(_babelPresetReact2.default);
  }

  if (opts.presetStage1) {
    appPreset.presets.push(_babelPresetStage2.default);
  }

  if (opts.pluginRuntime) {
    appPreset.plugins.push([_babelPluginTransformRuntime2.default, (0, _extends3.default)({
      "helpers": true,
      "polyfill": true,
      "regenerator": true
    }, opts.pluginRuntime)]);
  }

  if (opts.pluginTansformObjectRestSpread) {
    appPreset.plugins.push([_babelPluginTransformObjectRestSpread2.default, (0, _extends3.default)({
      "useBuiltIns": true
    }, opts.pluginTansformObjectRestSpread)]);
  }

  if (opts.pluginTransformClassProperties) {
    appPreset.plugins.push([_babelPluginTransformClassProperties2.default, (0, _extends3.default)({
      spec: false
    }, opts.pluginTransformClassProperties)]);

    if (opts.reactHotLoader) {
      appPreset.plugins.push(_babel2.default);
    }
  }

  return appPreset;
}
