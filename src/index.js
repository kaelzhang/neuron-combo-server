'use strict';

module.exports = neuron_combo

const combo = require('combo-server')
const node_url = require('url')
const presuf = require('pre-suf')
const unique = require('make-unique')


function neuron_combo (options) {
  options.path_parser = parse_paths
  return combo(options)
}


const REGEX_PREFIX_PATH = /^\/(?:([^/]+)\/)-(.*)$/

// `${comboBase}/${contentBasePrefix}/-`
function parse_paths (url, options) {
  let parsed = node_url.parse(url, true)
  let pathname = parsed.pathname

  let comboBase = options.base

  let index
  if (comboBase) {
    comboBase = presuf.ensureLeading(options.comboBase, '/')
    comboBase = presuf.removeEnding(comboBase, '/')

    index = pathname.indexOf(comboBase)
    if (index === 0) {
      pathname = pathname.slice(comboBase.length)
    }
  }

  let match = pathname.match(REGEX_PREFIX_PATH)

  if (!match) {
    return []
  }

  let prefix = match[1]

  // abc -> abc~
  let paths = match[2]
    .split(',')
    .map((path) => `/${prefix}/${path}`)

  return unique(paths)
}
