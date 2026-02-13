import test from 'ava';
import jwt from 'jsonwebtoken';
import { getSessionStart } from '../../app/src/js/utils/auth';
import _config from '../../app/src/js/config';

function createDummyToken(iat) {
  return jwt.sign({ iat }, '', { algorithm: 'none' });
}

test.beforeEach(() => {
  // Clear any mock config
  _config.mockSessionStartSeconds = null;
});

test('getSessionStart extracts iat from token in seconds', (t) => {
  const iatSeconds = Math.floor(Date.now() / 1000);
  const token = createDummyToken(iatSeconds);

  const sessionStart = getSessionStart(token);
  t.is(sessionStart, iatSeconds);
});

test('getSessionStart returns null when token is null', (t) => {
  const sessionStart = getSessionStart(null);
  t.is(sessionStart, null);
});

test('getSessionStart returns null when token has no iat', (t) => {
  const token = jwt.sign({}, '', { algorithm: 'none', noTimestamp: true });
  const sessionStart = getSessionStart(token);
  t.is(sessionStart, null);
});

test('getSessionStart returns null for invalid token', (t) => {
  const sessionStart = getSessionStart('invalid-token');
  t.is(sessionStart, null);
});

test('getSessionStart returns consistent value across multiple calls with same token', (t) => {
  const iatSeconds = Math.floor(Date.now() / 1000);
  const token = createDummyToken(iatSeconds);

  const firstRead = getSessionStart(token);
  const secondRead = getSessionStart(token);

  t.is(firstRead, secondRead);
});

test('getSessionStart uses mock value when configured', (t) => {
  const mockTimestamp = 1234567890;
  _config.mockSessionStartSeconds = mockTimestamp.toString();

  const token = createDummyToken(Math.floor(Date.now() / 1000));
  const sessionStart = getSessionStart(token);

  t.is(sessionStart, mockTimestamp);
});
