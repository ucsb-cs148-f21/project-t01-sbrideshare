import "../styles/search.css";

const SearchBar = () => (
  <form action="/" method="get">
      <label htmlFor="header-search">
          <span className="visually-hidden">Search rides: </span>
      </label>
      <input
          type="text"
          id="header-search"
          placeholder="Search rides"
          name="s" 
      />
      <button type="submit">Search</button>
  </form>
);

export default SearchBar;