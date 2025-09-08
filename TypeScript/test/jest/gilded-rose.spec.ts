import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('should decrease sellIn and quality for normal items', () => {
    const gildedRose = new GildedRose([new Item('normal', 10, 20)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(9);
    expect(items[0].quality).toBe(19);
  });

  it('should not decrease quality below 0', () => {
    const gildedRose = new GildedRose([new Item('normal', 5, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('should decrease quality twice as fast after sellIn date', () => {
    const gildedRose = new GildedRose([new Item('normal', 0, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(-1);
    expect(items[0].quality).toBe(8);
  });

  it('should increase quality for Aged Brie', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 2, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(1);
  });

    it('should increase quality by 2 for Aged Brie after sellIn', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', 0, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(12);
    });

    it('should not increase Aged Brie quality above 50 after sellIn', () => {
      const gildedRose = new GildedRose([new Item('Aged Brie', -1, 50)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(50);
    });

    it('should not increase Backstage passes quality above 50', () => {
      const gildedRose = new GildedRose([
        new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49)
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(50);
    });

    it('should keep Sulfuras quality and sellIn unchanged even with negative sellIn', () => {
      const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', -1, 80)]);
      const items = gildedRose.updateQuality();
      expect(items[0].sellIn).toBe(-1);
      expect(items[0].quality).toBe(80);
    });

    it('should not decrease normal item quality below 0 after sellIn', () => {
      const gildedRose = new GildedRose([new Item('normal', -1, 1)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0);
    });

    it('should treat unknown item types as normal items', () => {
      const gildedRose = new GildedRose([new Item('Unknown Item', 5, 10)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(9);
      expect(items[0].sellIn).toBe(4);
    });

    it('should handle multiple mixed items correctly', () => {
      const gildedRose = new GildedRose([
        new Item('normal', 1, 1),
        new Item('Aged Brie', 0, 49),
        new Item('Backstage passes to a TAFKAL80ETC concert', 5, 49),
        new Item('Sulfuras, Hand of Ragnaros', 0, 80),
        new Item('Unknown Item', 0, 0)
      ]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).toBe(0); // normal
      expect(items[1].quality).toBe(51 > 50 ? 50 : 51); // Aged Brie capped at 50
      expect(items[2].quality).toBe(50); // Backstage passes capped at 50
      expect(items[3].quality).toBe(80); // Sulfuras
      expect(items[4].quality).toBe(0); // Unknown Item
    });

  it('should not increase quality above 50', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 2, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('should not change quality or sellIn for Sulfuras', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 0, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0].sellIn).toBe(0);
    expect(items[0].quality).toBe(80);
  });

  it('should increase quality for Backstage passes as sellIn approaches', () => {
    const gildedRose = new GildedRose([
      new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', 10, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', 5, 20),
      new Item('Backstage passes to a TAFKAL80ETC concert', 0, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21); // >10 days
    expect(items[1].quality).toBe(22); // <=10 days
    expect(items[2].quality).toBe(23); // <=5 days
    expect(items[3].quality).toBe(0);  // after concert
  });
});
