import { lte } from './';

describe('utils', () => {
  describe('lte', () => {
    it('returns less than or equal to', () => {
      expect(lte([0], [0])).toBe(true);
      expect(lte([1], [0])).toBe(false);
    });
  });
});
