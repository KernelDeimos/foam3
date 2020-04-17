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
    { name: 'path', class: 'String' }
  ],

  methods: [
    {
      name: 'run',
      args: [
        { name: 'x', type: 'X' },
        {
          name: 'ins',
          type: 'foam.nanos.script.ShellScriptProgress',
          javaType: 'foam.nanos.script.ShellScriptProgress'
        },
        { name: 'code', type: 'String' },
      ],
      javaThrows: ['IOException'],
      javaCode: `
        String prefix = "foam.nanos.osutil:"+ins.getId()+":";
        ProcessBuilder pb = new ProcessBuilder(
          getPath(), "-x");
        pb.redirectErrorStream(true);
        Map<String,String> env = pb.environment();
        env.put("PS4", prefix+"\${LINENO};");
        Process p = pb.start();
        BufferedReader in = new BufferedReader(
          new InputStreamReader(p.getInputStream()));
        BufferedWriter ou = new BufferedWriter(
          new OutputStreamWriter(p.getOutputStream()));
        ou.write(code + "\\n");
        ou.flush();

        ((DAO) x.get("scriptProgressDAO")).put(ins);

        try {
          while ( true ) {
            String line = in.readLine();
            if ( line.startsWith(prefix) ) {
              int lineNo = Integer.parseInt(
                line.substring(prefix.length(), line.indexOf(";"))
              );
              ins.setLineNo(lineNo);
              ((DAO) x.get("scriptProgressDAO")).put(ins);
            } else {
              System.out.println(line);
            }
          }
        } catch ( EOFException e ) {
          // expected
        }

        ((DAO) x.get("scriptProgressDAO")).remove(ins);
      `
    }
  ]
});

/*
UUID.randomUUID().toString()
*/

// foam.CLASS({
//   package: 'foam.nanos.osutil',
//   name: 'ShellScript',
//   extends: 'foam.nanos.script.Script',

//   properties: [
//     {
//       name: 'shell',
//       class: 'FObjectProperty',
//       of: 'foam.nanos.osutil.Shell'
//     },
//   ],

//   javaImports: [
//     'foam.dao.DAO',
//     'java.io.IOException',
//     'java.util.UUID'
//   ],

//   methods: [
//     {
//       name: 'runScript',
//       args: [
//         {
//           name: 'x', type: 'Context',
//         },
//         {
//           name: 'args',
//           type: 'Map',
//           javaType: 'java.util.Map<String,String>'
//         }
//       ],
//       javaCode: `
//         String instanceId = UUID.randomUUID().toString();
//         ShellScriptProgress ins = new ShellScriptProgress.Builder(x)
//           .setId(instanceId)
//           .setScript(getId())
//           .setLineNo(0)
//           .build();
        
//         ((DAO) x.get("scriptProgressDAO")).put(ins);

//         try {
//           getShell().run(x, ins, getCode());
//         } catch ( IOException e ) {
//           throw new RuntimeException(
//             "Failed to run script "+getId()+": "+e.getMessage());
//         }
//       `
//     }
//   ]
// });

foam.CLASS({
  package: 'foam.nanos.osutil',
  name: 'FileBashScript',
  extends: 'foam.nanos.script.FileScript',

  javaImports: [
    'foam.nanos.script.ScriptProgress',
    'java.io.File',
    'java.io.IOException',
    'org.apache.commons.io.FileUtils',
  ],

  properties: [
    {
      name: 'shell',
      class: 'FObjectProperty',
      of: 'foam.nanos.osutil.Shell',
      javaFactory: `
        return new Shell.Builder(getX())
          .setName("bash")
          .setPath("/bin/bash")
          .build();
      `
    },
  ]
});