foam.CLASS({
  package: 'foam.nanos.script',
  name: 'FileScriptSink',
  extends: 'foam.dao.ProxySink',

  javaImports: [
    'foam.core.FObject'
  ],

  documentation: `
    Sink decorator used by FileScriptDAO to populate the 'code' property with
    a file's contents.
  `,

  methods: [
    {
      name: 'put',
      javaCode: `
        if ( obj instanceof FileScript ) {
          FObject o = ((FObject) obj).fclone();
          // Invoke getter to ensure client can get the value
          FileScript script = (FileScript) o;
          script.setCode(script.getCode());
          obj = o;
        }
        getDelegate().put(obj, sub);
      `
    }
  ]
});

foam.CLASS({
  package: 'foam.nanos.script',
  name: 'FileScriptDAO',
  extends: 'foam.dao.ProxyDAO',

  javaImports: [
    'foam.core.FObject',
    'foam.dao.Sink',
    'java.io.File',
    'java.io.IOException',
    'org.apache.commons.io.FileUtils',
  ],

  methods: [
    {
      name: 'put_',
      javaCode: `
        if ( obj instanceof FileScript ) {
          FileScript script = (FileScript) obj;
          System.out.println(script.code_);
          try {
            FileUtils.writeStringToFile(
              new File(script.getFilepath()),
              script.code_,
              (String) null);
          } catch ( IOException e ) {
            throw new RuntimeException(
              "Put failed because FileScript could not be saved");
          }
          script.clearCode();
        }
        return getDelegate().put_(x, obj);
      `
    },
    {
      name: 'find_',
      javaCode: `
        FObject obj = getDelegate().find_(x, id);
        if ( obj instanceof FileScript ) {
          obj = obj.fclone();
          // Invoke getter to ensure client can get the value
          FileScript script = (FileScript) obj;
          script.setCode(script.getCode());
        }
        return obj;
      `
    },
    {
      name: 'select_',
      javaCode: `
        Sink decoratedSink = new FileScriptSink.Builder(getX())
          .setDelegate(sink)
          .build();
        return getDelegate().select_(
          x, decoratedSink, skip, limit, order, predicate);
      `
    }
  ]
});