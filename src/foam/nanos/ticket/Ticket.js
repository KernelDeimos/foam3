/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.ticket',
  name: 'Ticket',

  documentation: 'Ticket Model',

  implements: [
    'foam.core.Validatable',
    'foam.nanos.auth.Authorizable',
    'foam.nanos.auth.CreatedAware',
    'foam.nanos.auth.CreatedByAware',
    'foam.nanos.auth.AssignableAware',
    'foam.nanos.auth.LastModifiedAware',
    'foam.nanos.auth.LastModifiedByAware',
    'foam.nanos.auth.ServiceProviderAware'
  ],

  topics: [
    'finished',
    'throwError'
  ],

  requires: [
    'foam.dao.AbstractDAO',
    'foam.log.LogLevel',
    'foam.nanos.ticket.TicketComment',
    'foam.nanos.ticket.TicketStatus',
    'foam.u2.dialog.Popup'
  ],

  javaImports: [
    'foam.nanos.auth.AuthorizationException',
    'foam.nanos.auth.AuthService',
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User',
    'java.util.Date'
  ],

  imports: [
    'ctrl',
    'currentMenu',
    'notify',
    'objectSummaryView?',
    'stack',
    'subject',
    'summaryView?',
    'ticketCommentDAO',
    'ticketDAO',
    'ticketStatusDAO',
    'userDAO'
  ],

  tableColumns: [
    'id',
    'type',
    // REVIEW: view fails to display when owner in tableColumn, the 2nd entry in allColumns is undefined.
    // 'owner',
    'assignedTo.legalName',
    'createdBy.legalName',
    'lastModified',
    'status',
    'title'
  ],

  messages: [
    {
      name: 'SUCCESS_ASSIGNED',
      message: 'You have successfully assigned this ticket'
    },
    {
      name: 'SUCCESS_UNASSIGNED',
      message: 'You have successfully unassigned this ticket'
    },
    {
      name: 'SUCCESS_REASSIGNED',
      message: 'You have successfully reassigned this ticket'
    }
  ],

  sections: [
    {
      name: 'infoSection',
      title: 'Ticket',
    },
    {
      name: 'metaSection',
      isAvailable: function(id) {
        return id != 0;
      },
      title: 'Audit',
    },
    {
      // NOTE: if a section is name: commentSection
      // then navigating to a comment detail view
      // does not work.
      name: '_defaultSection',
      title: 'Comments'
    },
  ],

  properties: [
    {
      class: 'String',
      name: 'id',
      visibility: 'RO',
      section: 'infoSection',
      order: 1,
      tableWidth: 100
    },
    {
      name: 'type',
      class: 'String',
      visibility: 'RO',
      storageTransient: true,
      section: 'infoSection',
      getter: function() {
         return this.cls_.name;
      },
      javaGetter: `
    return getClass().getSimpleName();
      `,
      tableWidth: 160,
      order: 2
    },
    {
      class: 'foam.core.Enum',
      of: 'foam.nanos.ticket.TicketType',
      name: 'category',
      label: 'Ticket type',
    },
    {
      class: 'Reference',
      of: 'foam.nanos.ticket.TicketStatus',
      name: 'status',
      value: 'OPEN',
      javaFactory: 'return "OPEN";',
      includeInDigest: true,
      section: 'infoSection',
      order: 3,
      tableWidth: 130,
      tableCellFormatter: function(value, obj) {
        obj.ticketStatusDAO.find(value).then(function(status) {
          if (status) {
            this.add(status.label);
          }
        }.bind(this));
      },
      view: function(_, x) {
        return {
          class: 'foam.u2.view.ModeAltView',
          readView: {
            class: 'foam.u2.view.ReferenceView',
            of: 'foam.nanos.ticket.TicketStatus'
          },
          writeView: {
            class: 'foam.u2.view.ChoiceView',
            choices: x.data.statusChoices
          }
        };
      },
    },
    {
      name: 'statusChoices',
      hidden: true,
      factory: function() {
        var s = [];
        if ( 'CLOSED' == this.status ) {
          s.push(['CLOSED', 'CLOSED']);
        } else {
          s.push(this.status);
          s.push(['CLOSED', 'CLOSED']);
        }
        return s;
      },
      documentation: 'Returns available statuses for each ticket depending on current status'
    },
    // REVIEW: can't get this to work.
    // {
    //   name: 'watchers',
    //   class: 'List',
    //   javaType: 'java.util.ArrayList<java.lang.Long>',
    //   view: {
    //     class: 'foam.u2.view.ReferenceArrayView',
    //     daoKey: 'userDAO'
    //   },
    //   section: 'metaSection',
    // },
    {
      class: 'String',
      name: 'title',
      // REVIEW: required causing issues for extended classes - 'Save' is never enabled.
      // required: true,
      tableWidth: 250,
      section: 'infoSection',
      validationPredicates: [
        {
          args: ['title', 'type'],
          predicateFactory: function(e) {
            return e.NEQ(foam.nanos.ticket.Ticket.TITLE, "");
          },
          errorString: 'Please provide a summary of the Ticket.'
        }
      ],
      order: 4
    },
    {
      class: 'String',
      name: 'comment',
      value: '',
    // required: true,
      storageTransient: true,
      section: 'infoSection',
      readVisibility: 'HIDDEN',
      validationPredicates: [
        {
          args: ['id', 'title', 'comment'],
          predicateFactory: function(e) {
            return e.OR(
              e.AND(
                e.EQ(foam.nanos.ticket.Ticket.ID, 0),
                e.NEQ(foam.nanos.ticket.Ticket.TITLE, "")
              ),
              e.NEQ(foam.nanos.ticket.Ticket.COMMENT, "")
            );
          },
          errorString: 'Please provide a comment.'
        }
      ],
      order: 5
    },
    {
      class: 'DateTime',
      name: 'created',
      visibility: 'RO',
      includeInDigest: true,
      section: 'metaSection',
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'createdBy',
      visibility: 'RO',
      includeInDigest: true,
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            this.add(user.legalName);
          }
        }.bind(this));
      },
      section: 'infoSection', // until 'owner' showing
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'createdByAgent',
      visibility: 'RO',
      includeInDigest: true,
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            this.add(user.legalName);
          }
        }.bind(this));
      },
      section: 'metaSection',
    },
    {
      class: 'DateTime',
      name: 'lastModified',
      visibility: 'RO',
      section: 'metaSection',
      tableWidth: 150
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedBy',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            this.add(user.legalName);
          }
        }.bind(this));
      },
      section: 'metaSection',
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'lastModifiedByAgent',
      visibility: 'RO',
      tableCellFormatter: function(value, obj) {
        obj.userDAO.find(value).then(function(user) {
          if ( user ) {
            this.add(user.legalName);
          }
        }.bind(this));
      },
      section: 'metaSection',
    },
    {
      name: 'summary',
      class: 'String',
      transient: true,
      hidden: true,
      tableCellFormatter: function(value, obj) {
        this.add(obj.title);
      }
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.ServiceProvider',
      name: 'spid',
      includeInDigest: true,
      section: 'systemInformation',
      writePermissionRequired: true,
      documentation: `
        Need to override getter to return "" because its trying to
        return null which breaks tests
      `,
      javaGetter: `
        if ( ! spidIsSet_ ) {
          return "";
        }
        return spid_;
      `
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'assignedTo',
      section: 'infoSection'
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'createdFor',
      documentation: 'User/business this ticket was created for.',
      section: 'infoSection',
      createVisibility: 'HIDDEN',
      readVisibility: 'RO',
      updateVisibility: 'RO'
    },
    {
      class: 'FObjectArray',
      of: 'foam.nanos.ticket.TicketHistory',
      name: 'ticketHistory',
      documentation: 'Status history of the ticket.',
      createVisibility: 'HIDDEN',
      readVisibility: 'RO',
      updateVisibility: 'RO',
      javaFactory: `
        TicketHistory[] h = new TicketHistory[1];
        h[0] = new TicketHistory();
        h[0].setAssignedTo(getAssignedTo());
        h[0].setTimeStamp(new Date());
        return h;`
    },
    {
      class: 'String',
      name: 'comment1',
      transient: true,
      createVisibility: 'RW',
      readVisibility: 'RW',
      updateVisibility: 'RW',
      section: 'infoSection',
      view: {
        class: 'foam.u2.TextField'
      }
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'reassignUser',
      transient: true,
      section: 'infoSection',
      createVisibility: 'HIDDEN',
      readVisibility: 'RW',
      updateVisibility: 'RW',
      view: function(_, X) {
        return {
          class: 'foam.u2.view.RichChoiceView',
          selectionView: { class: 'net.nanopay.auth.ui.UserSelectionView' },
          rowView: { class: 'net.nanopay.auth.ui.UserCitationView' },
          sections: [
            {
              heading: 'Group',
              dao: X.userDAO.orderBy(foam.nanos.auth.User.GROUP)
            }
          ]
        };
      }
    }
  ],

  methods: [
    {
      name: 'authorizeOnCreate',
      args: [
        { name: 'x', type: 'Context' }
      ],
      javaThrows: ['AuthorizationException'],
      javaCode: `
        // Everyone can create a ticket
      `
    },
    {
      name: 'authorizeOnRead',
      args: [
        { name: 'x', type: 'Context' }
      ],
      javaThrows: ['AuthorizationException'],
      javaCode: `
        AuthService auth = (AuthService) x.get("auth");
        Subject subject = (Subject) x.get("subject");
        User user = subject.getRealUser();

        if ( user.getId() != this.getCreatedBy() && ! auth.check(x, "ticket.read." + this.getId()) ) {
          throw new AuthorizationException("You don't have permission to read this ticket.");
        }
      `
    },
    {
      name: 'authorizeOnUpdate',
      args: [
        { name: 'x', type: 'Context' },
        { name: 'oldObj', type: 'foam.core.FObject' }
      ],
      javaThrows: ['AuthorizationException'],
      javaCode: `
        AuthService auth = (AuthService) x.get("auth");
        Subject subject = (Subject) x.get("subject");
        User user = subject.getRealUser();

        if ( user.getId() != this.getCreatedBy() && ! auth.check(x, "ticket.update." + this.getId()) ) {
          throw new AuthorizationException("You don't have permission to update this ticket.");
        }
      `
    },
    {
      name: 'authorizeOnDelete',
      args: [
        { name: 'x', type: 'Context' }
      ],
      javaThrows: ['AuthorizationException'],
      javaCode: `
        // The checkGlobalRemove has checked the permission for deleting the ticket already.
      `
    }
  ],

  actions: [
    {
      name: 'close',
      tableWidth: 70,
      confirmationRequired: function() {
        return true;
      },
      isAvailable: function(status, id) {
        return status != 'CLOSED' &&
               id > 0;
      },
      code: function() {
        this.status = 'CLOSED';
        this.assignedTo = 0;
        this.ticketDAO.put(this).then(function(ticket) {
          this.copyFrom(ticket);
        }.bind(this));
      }
    },
    {
      name: 'assign',
      section: 'infoSection',
      isAvailable: function(status){
        return status === 'CLOSED';
      },
      availablePermissions: [
        "ticket.assign.*"
      ],
      code: function(X) {        
        var objToAdd = X.objectSummaryView ? X.objectSummaryView : X.summaryView;
        objToAdd.tag({
          class: "foam.u2.PropertyModal",
          property: this.ASSIGNED_TO.clone().copyFrom({ label: '' }),
          isModalRequired: true,
          data$: X.data$,
          propertyData$: X.data.assignedTo$,
          title: this.ASSIGN_TITLE,
          onExecute: this.assignTicket.bind(this, X)
        });
      }
    },
    {
      name: 'assignToMe',
      section: 'infoSection',
      isAvailable: function(subject, assignedTo, status){
        return (subject.user.id !== assignedTo) && (status === 'OPEN');
      },
      code: function(X) {
        var assignedTicket = this.clone();
        assignedTicket.assignedTo = X.subject.user.id;

        this.ticketDAO.put(assignedTicket).then(req => {
          this.ticketDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          this.notify(this.SUCCESS_ASSIGNED, '', this.LogLevel.INFO, true);
          if (
            X.stack.top && 
            ( X.currentMenu.id !== X.stack.top[2] )
          ) {
            X.stack.back();
          }
        }, e => {
          this.throwError.pub(e);
          this.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    },
    {
      name: 'unassignMe',
      section: 'infoSection',
      isAvailable: function(subject, assignedTo, status){
        return (subject.user.id === assignedTo) && (status === 'OPEN');
      },
      code: function(X) {        
        var unassignedTicket = this.clone();
        unassignedTicket.assignedTo = 0;

        this.ticketDAO.put(unassignedTicket).then(req => {
          this.ticketDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          this.notify(this.SUCCESS_UNASSIGNED, '', this.LogLevel.INFO, true);
          if (
            X.stack.top && 
            ( X.currentMenu.id !== X.stack.top[2] )
          ) {
            X.stack.back();
          }
        }, e => {
          this.throwError.pub(e);
          this.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    },
    {
      name: 'reassign',
      section: 'infoSection',
      isAvailable: function(subject, assignedTo, status) {
        return ( subject.user.id === assignedTo) && (status === 'OPEN');
      },
      code: function(X) {
        var ticket = this.clone();
        ticket.assignedTo = this.reassignUser;

        this.ticketDAO.put(ticket).then(req => {
          this.ticketDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          this.notify(this.SUCCESS_REASSIGNED, '', this.LogLevel.INFO, true);
          if (
            X.stack.top &&
            ( X.currentMenu.id !== X.stack.top[2] )
          ) {
            X.stack.back();
          }
        }, e => {
          this.throwError.pub(e);
          this.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    },
    {
      name: 'internalComment',
      section: 'infoSection',
      code: function(X) {
        let comment = this.TicketComment.create();
        comment.comment = this.comment1;
        comment.ticket = this.id;

        this.ticketCommentDAO.put(comment).then(req => {
          this.ticketCommentDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          this.notify(this.SUCCESS_REASSIGNED, '', this.LogLevel.INFO, true);
          this.comment1 = '';
        }, e => {
          this.throwError.pub(e);
          this.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    },
    {
      name: 'externalComment',
      section: 'infoSection',
      code: function(X) {
        let comment = this.TicketComment.create();
        comment.comment = this.comment1;
        comment.ticket = this.id;
        comment.external = true;

        this.ticketCommentDAO.put(comment).then(req => {
          this.ticketCommentDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          this.notify(this.SUCCESS_REASSIGNED, '', this.LogLevel.INFO, true);
          this.comment1 = '';
        }, e => {
          this.throwError.pub(e);
          this.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    }
  ],

  listeners: [
    {
      name: 'assignTicket',
      code: function(X) {
        var assignedTicket = this.clone();

        this.ticketDAO.put(assignedTicket).then(_ => {
          this.ticketDAO.cmd(this.AbstractDAO.RESET_CMD);
          this.finished.pub();
          this.notify(this.SUCCESS_ASSIGNED, '', this.LogLevel.INFO, true);

          if (
            X.stack.top && 
            ( X.currentMenu.id !== X.stack.top[2] )
          ) {
            X.stack.back();
          }
        }, (e) => {
          this.throwError.pub(e);
          this.notify(e.message, '', this.LogLevel.ERROR, true);
        });
      }
    }
  ]
});
