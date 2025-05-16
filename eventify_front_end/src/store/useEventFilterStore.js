import { create } from 'zustand';

const useEventFilterStore = create((set) => ({
  filters: {
    finalDate: '',
    city: '',
    country: '',
    eventType: '',
    category: '',
    mode: '',
    skillLevel: '',
    audience: '',
    sortBy: '',
  },
  selectedCountry: '',
  selectedCity: '',

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedCity: (city) => set({ selectedCity: city }),

  clearFilters: () =>
    set({
      filters: {
        finalDate: 'All',
        city: 'All',
        country: 'All',
        eventType: 'All',
        category: 'All',
        mode: 'All',
        skillLevel: 'All',
        audience: 'All',
        sortBy: 'All',
      },
      selectedCountry: '',
      selectedCity: '',
    }),
}));

export default useEventFilterStore;
