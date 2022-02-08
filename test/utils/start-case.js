import test from 'ava';
import startCase from '../../app/src/js/utils/start-case';

test('startCase does not split S3 into pieces', t => {
  const testStr = 'S3 is from AWS';
  const expected = 'S3 Is From AWS';
  const actual = startCase(testStr);
  t.is(actual, expected);
});

test('startCase retains allcap words', t => {
  const testStr = 'there might be ALLCAPS.';
  const expected = 'There Might Be ALLCAPS.';
  const actual = startCase(testStr);
  t.is(actual, expected);
});

test('startCase retains punctuation in words', t => {
  const testStr = 'there-might_be ?punctuation?';
  const expected = 'There-might_be ?punctuation?';
  const actual = startCase(testStr);
  t.is(actual, expected);
});
