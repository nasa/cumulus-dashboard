
import test from 'ava';
import http from 'ava-http';

test('POST, PUT, or DELETE operations with no session information are rejected', async (t) => {
  const host = process.env.CYPRESS_BASE_URL || 'http://localhost:3000/';
  const res = await http.getResponse(host);
  t.is(res.statusCode, 200);

  try {
    await http.putResponse(host);
    t.fail('Expected error to be thrown');
  } catch (err) {
    // Error code is 405 from when running in Docker/nginx and
    // 404 from gulp serve
    t.true([405, 404].includes(err.statusCode));
  }

  try {
    await http.postResponse(host);
    t.fail('Expected error to be thrown');
  } catch (err) {
    t.true([405, 404].includes(err.statusCode));
  }

  try {
    await http.delResponse(host);
    t.fail('Expected error to be thrown');
  } catch (err) {
    t.true([405, 404].includes(err.statusCode));
  }
});
