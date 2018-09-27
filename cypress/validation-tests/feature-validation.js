'use strict';

import test from 'ava';
import http from 'ava-http';

test('Hit the main page with no authenticated', async (t) => {
  const host = process.env.DASHBOARD_HOST || 'http://localhost:3000/';
  const res = await http.getResponse(host);
  t.is(res.statusCode, 200);

  try{
    await http.putResponse(host);
  } catch (err) {
    t.true(err.error.includes('Cannot PUT /'));
  }

  try{
    await http.postResponse(host);
  } catch (err) {
    t.true(err.error.includes('Cannot POST /'));
  }

  try{
    await http.delResponse(host);
  } catch (err) {
    t.true(err.error.includes('Cannot DELETE /'));
  }
});


