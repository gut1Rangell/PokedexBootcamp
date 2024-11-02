const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

document.getElementById('typeFilter').addEventListener('change', (e) => {
    const selectedType = e.target.value;
    document.querySelectorAll('.pokemon').forEach(pokemon => {
        pokemon.style.display = (selectedType === 'all' || pokemon.classList.contains(selectedType)) ? 'flex' : 'none';
    });
});
const modal = document.getElementById('pokemonModal');
document.querySelectorAll('.pokemon').forEach(pokemon => {
    pokemon.addEventListener('click', () => {
        document.getElementById('modalName').textContent = pokemon.querySelector('.name').textContent;
        document.getElementById('modalImage').src = pokemon.querySelector('img').src;
        modal.style.display = 'block';
    });
});
document.getElementById('closeModal').onclick = () => { modal.style.display = 'none'; };
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
document.getElementById('sortOrder').addEventListener('change', (e) => {
    const order = e.target.value;
    const pokemons = Array.from(document.querySelectorAll('.pokemon'));
    pokemons.sort((a, b) => order === 'number'
        ? parseInt(a.querySelector('.number').textContent.slice(1)) - parseInt(b.querySelector('.number').textContent.slice(1))
        : a.querySelector('.name').textContent.localeCompare(b.querySelector('.name').textContent));
    document.getElementById('pokemonList').innerHTML = '';
    pokemons.forEach(pokemon => document.getElementById('pokemonList').appendChild(pokemon));
});
document.getElementById('searchBar').addEventListener('keyup', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('.pokemon').forEach(pokemon => {
        pokemon.style.display = pokemon.querySelector('.name').textContent.toLowerCase().includes(search) ? 'flex' : 'none';
    });
});
