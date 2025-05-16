// // store/useEventDetailStore.js
import { create } from 'zustand';

const useEventDetailStore = create((set) => ({
  isPanelOpen: false,
  eventData: null, // Stores the event data for the selected marker
  openPanel: (event) => set({ isPanelOpen: true, eventData: event }), // Open the panel and set event data
  closePanel: () => set({ isPanelOpen: false, eventData: null }), // Close the panel
}));

export default useEventDetailStore;



// // useEventDetailStore.js
// import { create } from 'zustand';

// const useEventDetailStore = create((set) => ({
//   isPanelOpen: false,
//   eventData: null,

//   openPanel: (event) => set({ isPanelOpen: true, eventData: event }),
//   closePanel: () => set({ isPanelOpen: false, eventData: null }),
// }));

// export default useEventDetailStore;
