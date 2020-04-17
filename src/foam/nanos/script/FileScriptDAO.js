foam.CLASS({
  package: 'foam.nanos.script',
  name: 'FileScriptDAO',
  extends: 'foam.dao.ProxyDAO',

  methods: [
    {
      name: 'put_',
      javaCode: `
        return getDelegate().put_(x, obj);
      `
    }
  ]
});