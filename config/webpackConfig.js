/* eslint-disable */
import base from './base';
import hotreload from './hotreload';
import modules from './modules';
import plugins from './plugins';

export default function create(options){
  return [
    base,
    hotreload,
    modules,
    plugins,
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
