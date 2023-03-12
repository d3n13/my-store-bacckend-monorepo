export const flatten = <Item extends object, ItemValue = unknown>(
  items: Item[],
  idKey: keyof Item,
  extractValue = (item: Item): ItemValue => item as unknown as ItemValue
) => {
  return items.reduce((idToItemMap: Record<string, ItemValue>, item) => {
    const idValue = item[idKey] + "";

    idToItemMap[idValue] = extractValue(item);

    return idToItemMap;
  }, {});
};
