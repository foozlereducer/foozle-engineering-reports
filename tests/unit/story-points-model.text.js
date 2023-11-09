import test from 'ava';

test('bar is being tested', async t => {
  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
});
