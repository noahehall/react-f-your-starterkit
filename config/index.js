/* eslint-disable */
import base from './base';
import hotreload from './hotreload';
import modules from './modules';
import plugins from './plugins';
import sourcemaps from './sourcemaps';

export default function create(options){
  return [
    base,
    hotreload,
    modules,
    plugins,
    sourcemaps,
  ].reduce(
    (config, configCreator) =>
      Object.assign(
        {},
        config,
        configCreator(options)
      ),
      {},
    )
}
