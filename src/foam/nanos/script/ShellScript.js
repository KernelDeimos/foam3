foam.CLASS({
  package: 'foam.nanos.script',
  name: 'ShellScript',
  extends: 'foam.nanos.script.Script',

  properties: [
    {
      name: 'shell',
      class: 'FObjectProperty',
      of: 'foam.nanos.osutil.Shell'
    },
  ],

  javaImports: [
    'foam.dao.DAO',
    'java.io.IOException',
    'java.util.UUID',
  ],

  methods: [
    {
      name: 'runScript',
      args: [
        {
          name: 'x', type: 'Context',
        },
        {
          name: 'args',
          type: 'Map',
          javaType: 'java.util.Map<String,String>'
        }
      ],
      javaCode: `
        String instanceId = UUID.randomUUID().toString();
        ShellScriptProgress ins = new ShellScriptProgress.Builder(x)
          .setId(instanceId)
          .setScript(getId())
          .setLineNo(0)
          .build();
        
        ((DAO) x.get("scriptProgressDAO")).put(ins);

        try {
          getShell().run(x, ins, getCode());
        } catch ( IOException e ) {
          throw new RuntimeException(
            "Failed to run script "+getId()+": "+e.getMessage());
        }
      `
    }
  ]
});
