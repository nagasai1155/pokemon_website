const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMessage");

// Fetch and display the first 50 Pokémon
const fetchPokemons = async () => {
  try {
    const response = await fetch(`${apiUrl}?limit=50`);
    if (!response.ok) throw new Error("Failed to load Pokémon data.");
    const data = await response.json();

    displayPokemons(data.results);
  } catch (error) {
    displayError(error.message);
  }
};

// Display Pokémon cards
const displayPokemons = async (pokemons) => {
  pokemonList.innerHTML = ""; // Clear previous data
  for (let pokemon of pokemons) {
    try {
      const details = await fetchPokemonDetails(pokemon.url);
      const card = createPokemonCard(details);
      pokemonList.appendChild(card);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error.message);
    }
  }
};

// Fetch Pokémon details by URL
const fetchPokemonDetails = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error loading Pokémon details.");
  return response.json();
};

// Create a Pokémon card
const createPokemonCard = (pokemon) => {
  const card = document.createElement("div");
  card.className = "pokemon-card";

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name}</h2>
    <p>Height: ${pokemon.height}</p>
    <p>Weight: ${pokemon.weight}</p>
  `;

  return card;
};

// Search Pokémon by name or ID
const searchPokemon = async () => {
  const query = searchInput.value.toLowerCase().trim(); // Get user input
  if (!query) {
    displayError("Please enter a Pokémon name or ID.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${query}`); // Fetch Pokémon by name or ID
    if (!response.ok) throw new Error("Pokémon not found.");
    const pokemon = await response.json();

    // Clear the existing list and display the searched Pokémon
    pokemonList.innerHTML = "";
    const card = createPokemonCard(pokemon);
    pokemonList.appendChild(card);
    errorMessage.textContent = ""; // Clear any error messages
  } catch (error) {
    displayError(error.message); // Display the error
  }
};

// Display error message
const displayError = (message) => {
  errorMessage.textContent = message;
};

// Event listeners
searchButton.addEventListener("click", searchPokemon);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchPokemon();
});

// Initial fetch
fetchPokemons();
