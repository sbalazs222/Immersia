export const getItemKey = (item) => item?.slug ?? item?.title

export const isItemSelected = (selectedItems, item) => {
  const itemKey = getItemKey(item)
  if (!itemKey) return false
  return selectedItems.some(selected => getItemKey(selected) === itemKey)
}

export const toggleSelection = (prev, item) => {
  const itemKey = getItemKey(item)
  if (!itemKey) return prev

  const exists = prev.some(selected => getItemKey(selected) === itemKey)
  if (exists) return prev.filter(selected => getItemKey(selected) !== itemKey)
  return [...prev, item]
}

export const isFavourite = (item, favourites) => {
  const itemKey = getItemKey(item)
  if (!itemKey) return false
  return favourites.some(fav => fav.slug === itemKey || fav.title === itemKey)
}
