import { computed, signal } from '@angular/core';

export const useSearchFilter = (items: any[]) => {
  const searchText = signal('');

  const filteredItems = computed(() => {
    if (!searchText()) return items;

    const lowerCaseSearchText = searchText().toLowerCase();

    return items.filter(item =>
      Object.values(item).some(value => {
        const strValue = String(value).toLowerCase();
        return strValue.includes(lowerCaseSearchText);
      })
    );
  });

  return { searchText, filteredItems };
};
