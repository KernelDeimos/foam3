/**
 * @license
 * Copyright 2021 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

 foam.CLASS({
  package: 'foam.nanos.cron',
  name: 'Schedulable',
  extends: 'foam.nanos.cron.Cron',

  mixins: [
    'foam.nanos.auth.CreatedAwareMixin',
    'foam.nanos.auth.CreatedByAwareMixin'
  ],

  implements: [
    'foam.core.ContextAgent',
    'foam.nanos.auth.ServiceProviderAware'
  ],

  properties: [
    {
      name: 'daoKey',
      value: 'schedulableDAO'
    },
    {
      class: 'String',
      name: 'eventDaoKey',
      value: 'schedulableEventDAO'
    },
    {
      name: 'schedule',
      of: 'foam.nanos.cron.Schedule',
      view: {
        class: 'foam.u2.view.FObjectView',
        of: 'foam.nanos.cron.SimpleIntervalSchedule'
      }
    },
    {
      class: 'String',
      name: 'objectDaoKey'
    },
    {
      class: 'FObjectProperty',
      of: 'FObject',
      name: 'objectToSchedule'
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.ServiceProvider',
      name: 'spid',
      value: foam.nanos.auth.ServiceProviderAware.GLOBAL_SPID,
      documentation: 'Service Provider Id of the rule. Default to ServiceProviderAware.GLOBAL_SPID for rule applicable to all service providers.'
    }
  ],

  methods: [
    {
      name: 'runScript',
      javaCode: `
        // TODO: simple submit itself to the threadpool agency which will call 'execute'
      `
    },
    {
      name: 'execute',
      javaCode: `
        // TODO: submitting the entry to the dao
      `
    }
  ]
 });
