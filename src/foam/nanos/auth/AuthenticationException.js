/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  name: 'AuthenticationException',
  package: 'foam.nanos.auth',
  extends: 'foam.core.ClientRuntimeException',
  javaGenerateDefaultConstructor: false,
  javaGenerateConvenienceConstructor: false,

  // properties: [
  //   {
  //     name: 'exceptionMessage',
  //     value: 'Not logged in {{message_}}',
  //   }
  // ],

  axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function(cls) {
        cls.extras.push(`
  public AuthenticationException() {
    super();
  }

  public AuthenticationException(String message) {
    super(message);
  }

  public AuthenticationException(Throwable cause) {
    super(cause);
  }

  public AuthenticationException(String message, Throwable cause) {
    super(message, cause);
  }
        `);
      }
    }
  ]
});
