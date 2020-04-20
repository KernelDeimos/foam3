foam.CLASS({
  package: 'foam.nanos.script',
  name: 'FileScript',
  extends: 'foam.nanos.script.ShellScript',

  javaImports: [
    'java.io.File',
    'java.io.IOException',
    'org.apache.commons.io.FileUtils',
  ],

  properties: [
    {
      name: 'code',
      class: 'Code',
      javaGetter: `
        System.out.println("Getter called");
        try {
          String src =
            FileUtils.readFileToString(new File(getFilepath()));
          return src;
        } catch ( IOException e ) {
          throw new RuntimeException(
            "Could not open file for script: " + getFilepath()
          );
        }
      `
    },
    {
      name: 'filepath',
      class: 'String'
    }
  ],
});