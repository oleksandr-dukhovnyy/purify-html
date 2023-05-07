import Sanitizer from '@/core.ts';

describe('Sanitizer self.structuredClone', () => {
  test('!window.hasOwnProperty("structuredClone")', () => {
    delete globalThis.structuredClone;
    const sanitizer = new Sanitizer();
    const str = '<div class="abc" id="app" some="else" value="15">div</div>';

    expect(sanitizer.sanitize(str)).toEqual('div');
  });
});
