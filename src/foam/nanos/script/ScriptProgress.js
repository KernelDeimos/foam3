foam.CLASS({
  package: 'foam.nanos.script',
  name: 'ScriptProgress',

  properties: [
    { name: 'id', class: 'String' }
  ]
});

foam.RELATIONSHIP({
  sourceModel: 'foam.nanos.script.Script',
  targetModel: 'foam.nanos.script.ScriptProgress',
  forwardName: 'instances',
  inverseName: 'script',
  cardinality: '1:*'
});
