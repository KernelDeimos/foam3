foam.CLASS({
  package: 'foam.nanos.osutil',
  name: 'ShellScriptState',

  properties: [
    { name: 'id', class: 'String' },
    { name: 'lineNo', class: 'Int' }
  ]
});

foam.CLASS({
  package: 'foam.nanos.osutil',
  name: 'Shell',

  javaImports: [
    'foam.core.X',
    'foam.dao.DAO',
    'java.io.BufferedReader',
    'java.io.BufferedWriter',
    'java.io.EOFException',
    'java.io.InputStreamReader',
    'java.io.IOException',
    'java.io.OutputStreamWriter',
    'java.util.Map',
  ],

  properties: [
    { name: 'name', class: 'String' },
    { name: 'uuid', class: 'String' },
    { name: 'path', class: 'String' }
  ],

  methods: [
    {
      name: 'run',
      args: [
        { name: 'x', type: 'X' },
        { name: 'uuid', type: 'String' },
        { name: 'code', type: 'String' },
        {
          name: 'state',
          type: 'DAO'
        }
      ],
      javaThrows: ['IOException'],
      javaCode: `
        String prefix = "foam.nanos.osutil:"+uuid+":";
        ProcessBuilder pb = new ProcessBuilder(
          getPath());
        Map<String,String> env = pb.environment();
        env.put("PS4", prefix+"\${LINENO};");
        Process p = pb.start();
        BufferedReader in = new BufferedReader(
          new InputStreamReader(p.getInputStream()));
        BufferedWriter ou = new BufferedWriter(
          new OutputStreamWriter(p.getOutputStream()));
        ou.write(code + "\\n");
        ou.flush();

        try {
          while ( true ) {
            String line = in.readLine();
            if ( line.startsWith(prefix) ) {
              int lineNo = Integer.parseInt(
                line.substring(prefix.length(), line.indexOf(";"))
              );
              state.put(new ShellScriptState.Builder(x)
                .setId(uuid)
                .setLineNo(lineNo)
                .build());
            }
          }
        } catch ( EOFException e ) {
          // expected
        }
      `
    }
  ]
});

/*
UUID.randomUUID().toString()
*/

foam.CLASS({
  package: 'foam.nanos.osutil',
  name: 'ShellExecutor',

  properties: [
    {
      name: 'shells',
      class: 'FObjectArray',
      of: 'foam.nanos.osutil.Shell',
      javaFactory: `
        return new Shell[] {
          new Shell.Builder(getX())
            .setName("bash")
            .setPath("/bin/bash")
            .build()
        };
      `
    }
  ]
});