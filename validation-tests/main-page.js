'use strict';

import test from 'ava';
import http from 'ava-http';

test('POST, PUT, or DELETE operations with no session information are rejected', async (t) => {
  const res = await http.getResponse('http://localhost:3000/');
  t.is(res.statusCode, 200);

  try{
    await http.putResponse('http://localhost:3000/');
  } catch (err) {
    t.true(err.error.includes('Cannot PUT /'));
  }

  try{
    await http.postResponse('http://localhost:3000/');
  } catch (err) {
    t.true(err.error.includes('Cannot POST /'));
  }

  try{
    await http.delResponse('http://localhost:3000/');
  } catch (err) {
    t.true(err.error.includes('Cannot DELETE /'));
  }
  
});


