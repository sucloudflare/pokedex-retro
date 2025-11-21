// Inicia a aplicação mostrando o primeiro Pokémon (Bulbasaur) e carregando a lista
firstPokemonCard();
pokemonListCreator();

/**
 * Cria a lista dos primeiros 50 Pokémons da PokéAPI
 */
async function pokemonListCreator() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=50`; // URL da API com limite de 50
    const response = await fetch(url); // Faz a requisição
    const json = await response.json(); // Converte a resposta para JSON
    await createPokemonList(json.results); // Cria os elementos visuais da lista
    addPokemonClickEvent(); // Adiciona eventos de clique e hover para cada Pokémon da lista
}

/**
 * Adiciona eventos de clique e efeitos de hover nos Pokémons da lista
 */
function addPokemonClickEvent() {
    const pokemons = document.querySelectorAll("#list .pokemon"); // Seleciona todos os Pokémons da lista

    mouseSounds(pokemons); // Adiciona sons nos eventos de hover e clique

    pokemons.forEach((pokemon) => {
        // Evento de clique: atualiza o card com as informações do Pokémon clicado
        pokemon.addEventListener('click', async () => {
            await changePokemon(pokemon.id, pokemon);
        });

        // Evento de mouse em cima: muda o fundo baseado nos tipos
        pokemon.addEventListener('mouseenter', () => {
            let dataType = pokemon.getAttribute('data-type');
            if (!dataType.includes('undefined')) {
                let types = dataType.split(',');
                let colorBg = `linear-gradient(90deg, var(--${types[0]}), var(--${types[1]}))`;
                pokemon.style.background = colorBg;
            } else {
                let types = dataType.split(',');
                let colorBg = `var(--${types[0]})`;
                pokemon.style.background = colorBg;
            }
        });

        // Evento de mouse saindo: reseta a cor se não estiver selecionado
        pokemon.addEventListener('mouseleave', () => {
            if (!pokemon.classList.contains('selected')) {
                pokemon.style.background = 'white';
            }
        });
    });
}

/**
 * Cria a lista de Pokémons no HTML
 */
async function createPokemonList(pokemons) {
    for (let i = 0; i < pokemons.length; i++) {
        let pokemonName = pokemons[i].name;
        let pokeurl = pokemons[i].url;

        const response = await fetch(pokeurl); // Busca dados do Pokémon específico
        const json = await response.json();
        await createPokemonListElement(json, pokemonName); // Cria o elemento HTML para o Pokémon
    }

    // Seleciona o primeiro Pokémon da lista visualmente
    const pokemonList = document.querySelectorAll('.pokemon');
    pokemonList[0].classList.add('selected');
    pokemonList[0].style.background = 'linear-gradient(90deg, var(--grass), var(--poison))';
}

/**
 * Cria o elemento <li> de cada Pokémon na lista
 */
async function createPokemonListElement(data, pokemonName) {
    let selectorList = document.getElementById("list");
    let pokeImg = data.sprites.other.home.front_default;

    // Coleta os tipos do Pokémon
    let types = [];
    for (let i = 0; i < data.types.length; i++) {
        let typesValue = data.types[i].type.name;
        types.push(typesValue);
    }

    // Adiciona o elemento no HTML com imagem, nome e tipos como data-type
    selectorList.innerHTML +=
        `<li class="pokemon" id="${pokemonName}" data-type="${types[0]},${types[1]}">
      <img src="${pokeImg}" alt="Imagem do ${pokemonName}">
      <span>${pokemonName[0].toUpperCase()}${pokemonName.substring(1).replace("-", " ")}</span>
    </li>`;
}

/**
 * Cria o card do primeiro Pokémon exibido na tela (Bulbasaur)
 */
async function firstPokemonCard() {
    const url = `https://pokeapi.co/api/v2/pokemon/bulbasaur`;
    const response = await fetch(url);
    const data = await response.json();

    // Chama funções para atualizar cada parte do card
    changeImg();
    changeBg();
    changeName();
    changeID();
    changeType();
    changeStatus();
    changeSkills();

    function changeName() {
        const name = document.getElementById("name");
        name.innerText = `${data.name[0].toUpperCase()}${data.name.substring(1)}`;
    }

    function changeID() {
        const pokePlaceID = document.getElementById("pokeID");
        let idText = addZeros(data.id, 3);
        pokePlaceID.innerText = `#${idText}`;
        function addZeros(num, length) {
            return String(num).padStart(length, "0");
        }
    }

    function changeType() {
        const typePlace = document.getElementById("type");
        const rawTypes = data.types;
        let types = [];

        typePlace.innerHTML = ""; // Limpa antes de adicionar

        for (let i = 0; i < rawTypes.length; i++) {
            let typesValue = rawTypes[i].type.name;
            types.push(typesValue);
            typePlace.innerHTML += `<span class="type">${typesValue[0].toUpperCase()}${typesValue.substring(1)}</span>`;
        }
    }

    function changeImg() {
        const imgPlace = document.getElementById("card-img");
        let imgPokemon = data.sprites.other.home.front_default;
        imgPlace.src = imgPokemon;
    }

    function changeBg() {
        const cardBg = document.getElementById("card-pokemon");
        const rawTypesBg = data.types;
        let typesBg = rawTypesBg.map(t => t.type.name);

        if (typesBg.length === 1) {
            cardBg.style.background = `var(--${typesBg})`;
        } else {
            cardBg.style.backgroundImage = `linear-gradient(90deg, var(--${typesBg[0]}), var(--${typesBg[1]}))`;
        }
    }

    function changeStatus() {
        const statsApi = data.stats;
        const statsUl = document.querySelector(".stats");
        statsUl.innerHTML = "";

        for (let i = 0; i < statsApi.length; i++) {
            let statsName = statsApi[i].stat.name;
            let statsValue = statsApi[i].base_stat;
            statsUl.innerHTML += `<li><p>${statsName[0].toUpperCase()}${statsName.substring(1).replace("-", " ")}:</p> <p>${statsValue}</p></li>`;
        }
    }

    function changeSkills() {
        const skillsApi = data.abilities;
        const skillsUl = document.querySelector(".skills");
        skillsUl.innerHTML = "";

        for (let i = 0; i < skillsApi.length; i++) {
            let skill = skillsApi[i].ability.name;
            skillsUl.innerHTML += `<li class="skill"><p>${skill[0].toUpperCase()}${skill.substring(1).replace("-", " ")}</p></li>`;
        }
    }
}

/**
 * Atualiza o card ao clicar em outro Pokémon da lista
 */
async function changePokemon(idPokemon, pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon/${idPokemon}`;
    const response = await fetch(url);
    const data = await response.json();

    // Atualiza todas as informações do card
    changeImg();
    changeBg();
    changeSelectedBg(pokemon);
    changeName();
    changeID();
    changeType();
    changeStatus();
    changeSkills();
    cardAni();

    function cardAni() {
        const card = document.getElementById('card-pokemon');
        card.classList.add('ani');
        card.addEventListener('animationend', () => {
            card.classList.remove('ani');
        });
    }

    function changeName() {
        const name = document.getElementById("name");
        name.innerText = `${data.name[0].toUpperCase()}${data.name.substring(1)}`;
    }

    function changeID() {
        const pokePlaceID = document.getElementById("pokeID");
        let idText = addZeros(data.id, 3);
        pokePlaceID.innerText = `#${idText}`;
        function addZeros(num, length) {
            return String(num).padStart(length, "0");
        }
    }

    function changeType() {
        const typePlace = document.getElementById("type");
        const rawTypes = data.types;
        let types = [];

        typePlace.innerHTML = "";

        for (let i = 0; i < rawTypes.length; i++) {
            let typesValue = rawTypes[i].type.name;
            types.push(typesValue);
            typePlace.innerHTML += `<span class="type">${typesValue[0].toUpperCase()}${typesValue.substring(1)}</span>`;
        }
    }

    function changeImg() {
        const imgPlace = document.getElementById("card-img");
        imgPlace.classList.add('imgTransition');
        let imgPokemon = data.sprites.other.home.front_default;
        imgPlace.src = imgPokemon;
        imgPlace.addEventListener('animationend', () => {
            imgPlace.classList.remove('imgTransition');
        });
    }

    function changeBg() {
        const cardBg = document.getElementById("card-pokemon");
        const rawTypesBg = data.types;
        let typesBg = rawTypesBg.map(t => t.type.name);

        if (typesBg.length === 1) {
            cardBg.style.background = `var(--${typesBg})`;
        } else {
            cardBg.style.backgroundImage = `linear-gradient(90deg, var(--${typesBg[0]}), var(--${typesBg[1]}))`;
        }
    }

    function changeSelectedBg(pokemon) {
        let selectedBefore = document.querySelector('.selected');
        selectedBefore.classList.remove('selected');
        selectedBefore.style.background = 'white';

        pokemon.classList.add('selected');

        const rawTypesBg = data.types;
        let typesBg = rawTypesBg.map(t => t.type.name);

        if (typesBg.length === 1) {
            pokemon.style.background = `var(--${typesBg})`;
        } else {
            pokemon.style.backgroundImage = `linear-gradient(90deg, var(--${typesBg[0]}), var(--${typesBg[1]}))`;
        }
    }

    function changeStatus() {
        const statsApi = data.stats;
        const statsUl = document.querySelector(".stats");
        statsUl.innerHTML = "";

        for (let i = 0; i < statsApi.length; i++) {
            let statsName = statsApi[i].stat.name;
            let statsValue = statsApi[i].base_stat;
            statsUl.innerHTML += `<li><p>${statsName[0].toUpperCase()}${statsName.substring(1).replace("-", " ")}:</p> <p>${statsValue}</p></li>`;
        }
    }

    function changeSkills() {
        const skillsApi = data.abilities;
        const skillsUl = document.querySelector(".skills");
        skillsUl.innerHTML = "";

        for (let i = 0; i < skillsApi.length; i++) {
            let skill = skillsApi[i].ability.name;
            skillsUl.innerHTML += `<li class="skill"><p>${skill[0].toUpperCase()}${skill.substring(1).replace("-", " ")}</p></li>`;
        }
    }
}

/**
 * Adiciona efeitos sonoros nos eventos de mouse nos Pokémons da lista
 */
function mouseSounds(pokemons) {
    const audioMouseOver = document.getElementById("soundMouseOver");
    const audioClick = document.getElementById("soundClick");

    pokemons.forEach((pokemon) => {
        pokemon.addEventListener("mouseenter", () => {
            audioMouseOver.currentTime = 0;
            audioMouseOver.volume = 0.05;
            audioMouseOver.play();
        });

        pokemon.addEventListener("click", () => {
            audioClick.currentTime = 0;
            audioClick.volume = 0.05;
            audioClick.play();
        });
    });
}
