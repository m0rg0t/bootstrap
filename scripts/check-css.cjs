'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const postcss = require('postcss');
// Recess sorted declarations. Keep rule order and duplicate-property order,
// while accepting equivalent color spelling and Less's 8-decimal serialization.
function canonical(css) {
  function value(v) {
    return v.replace(/#[0-9a-f]{3}(?![0-9a-f])/gi, c => '#' + [...c.slice(1)].map(x => x + x).join(''))
      .replace(/(?:\b\d+)?\.\d+/g, n => String(Number(Number(n).toFixed(8))))
      .replace(/\s*([,=])\s*/g, '$1')
      .replace(/(^|[\s,(])0%/g, '$10')
      .replace(/\s+/g, ' ').trim();
  }
  function visit(node) {
    if (node.type === 'comment') return null;
    if (node.type === 'decl') return ['decl', node.prop, value(node.value), !!node.important];
    const children = (node.nodes || []).filter(x => x.type !== 'comment');
    const declarations = children.filter(x => x.type === 'decl').sort((a, b) => a.prop.localeCompare(b.prop));
    const others = children.filter(x => x.type !== 'decl');
    return [node.type, value(node.selector || node.name || ''), value(node.params || ''), [...declarations, ...others].map(visit)];
  }
  return JSON.stringify(visit(postcss.parse(css)));
}
module.exports = canonical;
if (require.main === module) {
  const baseline = require('./css-baseline.json');
  for (const [name, hash] of Object.entries(baseline.sha256)) {
    const css = fs.readFileSync(`dist/css/${name}.css`, 'utf8');
    const actual = crypto.createHash('sha256').update(canonical(css)).digest('hex');
    assert.equal(actual, hash, `${name}: CSS semantics differ from the legacy baseline`);
  }
  console.log('Legacy CSS structure, declaration values, rule order and duplicate declaration order preserved');
}
