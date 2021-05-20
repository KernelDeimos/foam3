/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */


foam.CLASS({
  package: 'foam.nanos.theme',
  name: 'ThemeGlyphs',

  documentation: `
    Stores svgs for standard glyphs.
    SVG properties can have variables and fallback values. Look at fill properties for formatting.
  `,

  requires: [
    'foam.core.Glyph'
  ],

  properties: [
    {
      name: 'checkmark',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="/*%FILL%*/ #ffffff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"/></svg>
        ` };
      }
    },
    {
      name: 'exclamation',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="/*%FILL%*/ #ffffff" viewBox="0 0 24 24">
            <path fill-rule="nonzero" d="M 12 0 z m 0 13.2 c -0.66 0 -1.2 -0.54 -1.2 -1.2 V 7.2 c 0 -0.66 0.54 -1.2 1.2 -1.2 c 0.66 0 1.2 0.54 1.2 1.2 V 12 c 0 0.66 -0.54 1.2 -1.2 1.2 z m 1.2 4.8 h -2.4 v -2.4 h 2.4 V 18 z"/>
        </svg>
        ` };
      }
    },
    {
      name: 'pending',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Ablii" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Enum" transform="translate(-1490.000000, -409.000000)">
                    <g id="Group-33" transform="translate(1490.000000, 409.000000)">
                        <path d="M8.66666667,3 C9.08974359,3 9.4418146,3.30674556 9.49347595,3.7000091 L9.5,3.8 L9.5,5.072 C9.5,5.24866667 9.43923611,5.41977778 9.3273534,5.55987037 L9.25416667,5.64 L7.83333333,7 L9.25833333,8.372 C9.38680556,8.49533333 9.46898148,8.65755556 9.49280478,8.83088889 L9.5,8.936 L9.5,10.2 C9.5,10.6061538 9.18047337,10.944142 8.77082385,10.9937369 L8.66666667,11 L5.33333333,11 C4.91025641,11 4.5581854,10.6932544 4.50652405,10.2999909 L4.5,10.2 L4.5,8.936 C4.5,8.75933333 4.56076389,8.58822222 4.67023534,8.44812963 L4.74166667,8.368 L6.16666667,7 L4.74583333,5.636 C4.61388889,5.50933333 4.53113426,5.34655556 4.50721451,5.17312963 L4.5,5.068 L4.5,3.8 C4.5,3.39384615 4.81952663,3.05585799 5.22917615,3.00626309 L5.33333333,3 L8.66666667,3 Z M7,7.2 L5.33333333,8.8 L5.33333333,9.8 C5.33333333,9.9925 5.47688802,10.154375 5.66630046,10.1918359 L5.75,10.2 L8.25,10.2 C8.45052083,10.2 8.61914062,10.0621875 8.65816243,9.88035156 L8.66666667,9.8 L8.66666667,8.8 L7,7.2 Z M7,6.8 L5.33333333,5.2 L5.33333333,4.2 C5.33333333,3.98 5.52083333,3.8 5.75,3.8 L8.25,3.8 C8.47916667,3.8 8.66666667,3.98 8.66666667,4.2 L8.66666667,5.2 L7,6.8 Z" id="Shape" fill="/*%FILL%*/ #FFFFFF"></path>
                    </g>
                </g>
            </g>
        </svg>
        ` };
      }
    },
    {
      name: 'helpIcon',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="/*%FILL%*/ #ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16H11V14H9V16ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 4C7.79 4 6 5.79 6 8H8C8 6.9 8.9 6 10 6C11.1 6 12 6.9 12 8C12 10 9 9.75 9 13H11C11 10.75 14 10.5 14 8C14 5.79 12.21 4 10 4Z" />
        </svg>
        ` };
      }
    },
    {
      name: 'networkError',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function () {
        return { template: `
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="/*%FILL%*/ #ffffff">
            <g><path d="M0,0h24v24H0V0z" fill="none"/></g>
            <g>
              <g>
                <path d="M12,4C7.31,4,3.07,5.9,0,8.98L12,21l5-5.01V8h5.92C19.97,5.51,16.16,4,12,4z"/>
                <rect height="2" width="2" x="19" y="18"/><rect height="6" width="2" x="19" y="10"/>
              </g>
            </g>
          </svg>
        ` };
      }
    },
    {
      name: 'plus',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="/*%FILL%*/ #FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        ` };
      }
    },
    {
      name: 'trash',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg width="24" height="24" fill="/*%FILL%*/ #B2B6BD" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8.46 11.88L9.87 10.47L12 12.59L14.12 10.47L15.53 11.88L13.41 14L15.53 16.12L14.12 17.53L12 15.41L9.88 17.53L8.47 16.12L10.59 14L8.46 11.88ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" />
        </svg>
        ` };
      }
    },
    {
      name: 'progress',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg width="28" height="32" viewBox="0 0 28 32" fill="/*%FILL%*/ #406DEA" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.0002 5.33331V0.333313L7.3335 6.99998L14.0002 13.6666V8.66665C19.5168 8.66665 24.0002 13.15 24.0002 18.6666C24.0002 23.6166 20.3835 27.7166 15.6668 28.5166V31.8833C22.2502 31.0666 27.3335 25.4666 27.3335 18.6666C27.3335 11.3 21.3668 5.33331 14.0002 5.33331Z" />
          <path d="M4.00008 18.6667C4.00008 15.9167 5.11675 13.4167 6.93342 11.6L4.56675 9.23334C2.16675 11.65 0.666748 14.9833 0.666748 18.6667C0.666748 25.4667 5.75008 31.0667 12.3334 31.8833V28.5167C7.61675 27.7167 4.00008 23.6167 4.00008 18.6667Z"/>
        </svg>
        ` };
      }
    },
    {
      name: 'back',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"  viewBox="0 0 24 24" width="100%" fill="/*%FILL%*/ #ffffff"><rect fill="none" height="24" width="24"/><g><polygon points="17.77,3.77 16,2 6,12 16,22 17.77,20.23 9.54,12"/></g></svg>
        ` };
      }
    },
    {
      name: 'copy',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: function() {
        return { template: `
        <svg width="100%" viewBox="0 0 24 24" fill="/*%FILL%*/ #ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
        </svg>`
        };
      }
    },
    {
      name: 'edit',
      class: 'GlyphProperty',
      of: 'foam.core.Glyph',
      factory: () => {
        return { template: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="/*%FILL%*/ #ffffff" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.2496V20.9996H6.75L17.81 9.93957L14.06 6.18957L3 17.2496ZM20.71 7.03957C21.1 6.64957 21.1 6.01957 20.71 5.62957L18.37 3.28957C17.98 2.89957 17.35 2.89957 16.96 3.28957L15.13 5.11957L18.88 8.86957L20.71 7.03957V7.03957Z"/>
        </svg>
        ` };
      }
    }
  ]
});
