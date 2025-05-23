// Inside your store (useEventStore)
import { create } from 'zustand';
// import useEventFilterStore from './useEventFilterStore';



const useEventStore = create((set) => ({
  countryCode: '',
  cityName: '',
  eventResults: [],

  setCountryCode: (code) => set({ countryCode: code }),
  setCityName: (city) => set({ cityName: city }),
  setFilters: (newFilters) => set({ filters: newFilters }),

  // Add a mock function to set fake data
  setFakeEventData: () => {

    // const filters = useEventFilterStore.getState().filters;
    // console.log('Current Filters as we are eventstore.js : ', filters);

    const fakeData = [
      // {
      //   title: 'Event 1',
      //   city: filters.cityName,
      //   country: filters.countryCode,
      //   latitude: 40.7128,
      //   longitude: 74.0060
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      // {
      //   title: 'Event 2',
      //   city: 'London',
      //   country: 'UK',
      //   latitude: 51.5074,
      //   longitude: -0.1278
      // },
      ""
    ];
    set({ eventResults: fakeData });
  },

  // Example fetch method (could simulate API call)
  // fetchEvents: async (countryCode, cityName) => {
  //   const response = await fetch(`/api/events?country=${countryCode}&city=${cityName}`);
  //   const data = await response.json();
  //   set({ eventResults: data });
  // },

  fetchEventsByFilters: async (filters) => {
    const params = new URLSearchParams(filters);
    const url = `http://localhost:5000/api/event/getEvents?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')  // Use token if exists
        },
      });

      const data = await response.json();
      console.log("Filtered Events:", data);
      set({ eventResults: data });
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }



  // fetchEventsByFilters: async (filters) => {
  //   let currentPage = 1;
  //   const limit = 5; // number of events to fetch per request
  //   const allEvents = [];

  //   const fetchNextChunk = async () => {
  //     const params = new URLSearchParams({ ...filters, page: currentPage, limit });
  //     const url = `http://localhost:5000/api/event/getEvents?${params.toString()}`;

  //     try {
  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "auth-token": localStorage.getItem('token'),
  //         },
  //       });

  //       const data = await response.json();

  //       if (!data || data.length === 0) {
  //         return; // Stop when no more data
  //       }

  //       allEvents.push(...data);

  //       // Set partial results to update map
  //       set((state) => ({
  //         eventResults: [...state.eventResults, ...data],
  //       }));

  //       currentPage++;

  //       // Fetch next chunk after short delay
  //       setTimeout(fetchNextChunk, 300); // adjust delay as needed
  //     } catch (err) {
  //       console.error("Error fetching chunk:", err);
  //     }
  //   };

  //   // Reset previous results
  //   set({ eventResults: [] });

  //   // Start fetching
  //   fetchNextChunk();
  // }



}));

export default useEventStore;




// here we are gona fetch the events based on the flters we are getting , ad set the eventresults ,
// after that pas them on to the event crousla , so on each event we show a marker , 

