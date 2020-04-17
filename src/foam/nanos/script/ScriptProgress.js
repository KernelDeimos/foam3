foam.CLASS({
  package: 'foam.nanos.script',
  name: 'ScriptProgress',

  properties: [
    { name: 'id', class: 'String' },
    { name: 'script', class: 'String' }
  ]
});

foam.CLASS({
  package: 'foam.nanos.script',
  name: 'ShellScriptProgress',
  extends: 'foam.nanos.script.ScriptProgress',

  properties: [
    { name: 'lineNo', class: 'Int' }
  ]
});

// foam.RELATIONSHIP({
//   sourceModel: 'foam.nanos.script.Script',
//   targetModel: 'foam.nanos.script.ScriptProgress',
//   forwardName: 'instances',
//   inverseName: 'script',
//   cardinality: '1:*'
// });
