import React, { useState, useEffect } from 'react';
import { Country, City } from 'country-state-city';
import useEventFilterStore from '../store/useEventFilterStore';
import '../styles/FilterPanel.css';
import useEventStore from '../store/useEventStore'; // We need to call fetchEvents from this store


const FilterPanel = () => {
  const {
    filters,            // Global filters from Zustand store
    setFilter,
    setSelectedCountry,
    setSelectedCity,
  } = useEventFilterStore();


  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryName, setSelectedCountryName] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update only local state (tempFilters)
    setTempFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle country selection
    if (name === 'country') {
      const selected = countries.find((c) => c.isoCode === value);

      // Store the country name separately
      setSelectedCountryName(selected?.name || '');

      setCities([]); // Reset cities list
      setTempFilters((prev) => ({
        ...prev,
        city: '', // Also reset selected city in local state
      }));

      if (value) {
        const citiesList = City.getCitiesOfCountry(value);
        setCities(citiesList);
      }
    }
  };

  const cleanFilters = (filters) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== "")
    );
  };



  const handleFilter = () => {
    // Push local values to global state (Zustand)


    Object.entries(tempFilters).forEach(([key, value]) => {
      setFilter(key, value);
    });

    tempFilters.country = selectedCountryName;

    // Set country/city values in specific functions if needed
    setSelectedCountry(tempFilters.country);
    setSelectedCity(tempFilters.city);

    // console.log('Applied Filters:', tempFilters);
    // Optionally: trigger map update or fetch here
    // Trigger fetch events after setting filters
    useEventStore.getState().setFilters(tempFilters);
    // Manually trigger event data update
    useEventStore.getState().setFakeEventData();

    const cleanedFilters = cleanFilters(tempFilters);

    // console.log("clearned filters are " , cleanedFilters)
    useEventStore.getState().fetchEventsByFilters(cleanedFilters);

  };

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (tempFilters.country) {
      const citiesList = City.getCitiesOfCountry(tempFilters.country);
      setCities(citiesList);
    } else {
      setCities([]);
    }
  }, [tempFilters.country]);

  return (
    <div className="filter-panel">

      {/* Example: Final Date Filter */}
      <div className="filter-div">
        <label>Final Date</label>
        <select name="finalDate" value={tempFilters.finalDate} onChange={handleChange}>
          <option value="">All Dates</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="Next Three Months">Next Three Months</option>
        </select>
      </div>

      {/* Country Filter */}
      <div className="filter-div">
        <label>Country</label>
        <select name="country" value={tempFilters.country} onChange={handleChange}>
          <option value="">All</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="filter-div">
        <label>City</label>
        <select
          name="city"
          value={tempFilters.city}
          onChange={handleChange}
          disabled={!tempFilters.country}
        >
          <option value="">All</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Event Type */}
      <div className="filter-div">
        <label>Event Type</label>
        <select name="eventType" value={tempFilters.eventType} onChange={handleChange}>
          <option value="">All Types</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Seminar">Seminar</option>
          <option value="Workshop">Workshop</option>
          <option value="Conference">Conference</option>
          <option value="Webinar">Webinar</option>
          <option value="Bootcamp">Bootcamp</option>
          <option value="Tech Talk">Tech Talk</option>
        </select>
      </div>

      {/* Category */}
      <div className="filter-div">
        <label>Category</label>
        <select name="category" value={tempFilters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Business">Business</option>
          <option value="Design">Design</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Blockchain">Blockchain</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
        </select>
      </div>

      {/* Mode */}
      <div className="filter-div">
        <label>Mode</label>
        <select name="mode" value={tempFilters.mode} onChange={handleChange}>
          <option value="">All Modes</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* Skill Level */}
      <div className="filter-div">
        <label>Skill Level</label>
        <select name="skillLevel" value={tempFilters.skillLevel} onChange={handleChange}>
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Audience */}
      <div className="filter-div">
        <label>Audience</label>
        <select name="audience" value={tempFilters.audience} onChange={handleChange}>
          <option value="">All Audiences</option>
          <option value="Students">Students</option>
          <option value="Professionals">Professionals</option>
          <option value="Startups">Startups</option>
          <option value="Researchers">Researchers</option>
          <option value="Entrepreneurs">Entrepreneurs</option>
          <option value="Investors">Investors</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="filter-div">
        <label>Sort By</label>
        <select name="sortBy" value={tempFilters.sortBy} onChange={handleChange}>
          <option value="">No Sorting</option>
          <option value="Alphabetical">Alphabetical</option>
          <option value="Newly Added">Newly Added</option>
          <option value="Trending">Trending</option>
          {/* <option value="Most Popular">Most Popular</option> */}
          <option value="Ending Soon">Ending Soon</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="filter-div">
        <button onClick={handleFilter}>Filter</button>
      </div>
    </div>
  );
};

export default FilterPanel;
