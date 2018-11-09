'use strict';

const express = require('express');
const superagent = require('superagent');

const app = express();

require('dotenv').config();

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
const PORT = 3000
const CLIENT_URL = 'http://localhost:3000';
app.get('/oauth/google', (request, response) => {
  if (!request.query.code) {
    response.redirect(CLIENT_URL);
  } else {
    return superagent.post(GOOGLE_OAUTH_URL)
      .type('form')
      .send({
        code: request.query.code,
        grant_type: 'authorization_code',
        client_id: GOOGLE_OAUTH_ID,
        client_secret: GOOGLE_OAUTH_SECRET,
        redirect_uri: `${API_URL}/oauth/google`
      })
      .then(tokenResponse => {
        console.log('ACCESS TOKEN');

        if (!tokenResponse.body.access_token) {
          response.redirect(CLIENT_URL);
        }
        const accessToken = tokenResponse.body.access_token;
        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${accessToken}`);
      })
      .then(openIDResponse => {
        console.log(openIDResponse.body);
        response.cookie('TOKENSTUFF');
        response.redirect(CLIENT_URL);
      })
      .catch(error => {
        console.log(error);
        response.redirect(CLIENT_URL + '?error=oauth');
      });
  }
});

app.listen(PORT, () => {
  console.log('__SERVER_UP__', PORT);
});
