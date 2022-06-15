import { Client } from '@uauth/node';
import Resolution from '@unstoppabledomains/resolution';

// This package requires a fetch polyfill for now.
import 'whatwg-fetch';

global.XMLHttpRequest = require('xhr2');
global.XMLHttpRequestUpload = (
  global.XMLHttpRequest as any
).XMLHttpRequestUpload;

// Done polyfilling fetch.

export const uauthClient = new Client({
  clientID: 'ddf44f67-b9c9-4ff1-b4da-0dac0305cedc',
  clientSecret: 'notasecret',
  redirectUri: 'http://localhost:3000/auth/login/unstoppable/callback',
  scope: 'openid email wallet',
  resolution: new Resolution(),
});
