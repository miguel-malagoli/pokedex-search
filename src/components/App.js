import React, { useCallback, useEffect, useState } from 'react';
import Result from './Result';

function App() {

	// Hooks de estado
	// --- Setup inicial (quando montado)
	const [hasSearched, setHasSearched] = useState(false);
	const [errorSetup, setErrorSetup] = useState(false);
	const [pokeList, setPokeList] = useState(undefined);
	const [typeList, setTypeList] = useState(undefined);
	const [typeRef, setTypeRef] = useState({});
	// --- Input do usuário
	const [query, setQuery] = useState('');
	const [typePrimary, setTypePrimary] = useState('');
	const [typeSecondary, setTypeSecondary] = useState('');
	const [fixedOrder, setFixedOrder] = useState(false);
	// --- Busca
	const [searching, setSearching] = useState(false);
	const [errorSearch, setErrorSearch] = useState(false);
	const [typePrimaryList, setTypePrimaryList] = useState(undefined);
	const [typeSecondaryList, setTypeSecondaryList] = useState(undefined);
	const [typePrimaryReady, setTypePrimaryReady] = useState(false);
	const [typeSecondaryReady, setTypeSecondaryReady] = useState(false);
	// --- Fetch individual de pokémons
	const [results, setResults] = useState([]);
	const [orderedResults, setOrderedResults] = useState([]);
	const [ordering, setOrdering] = useState(false);

	// Hooks de efeito
	// --- Ao montar
	useEffect(() => {
		// --- Obter lista de tipos
		fetch('https://pokeapi.co/api/v2/type/')
			.then(response => {
				if (response.ok === false) setErrorSetup(true);
				response.json()
					.then(data => {
						if (data.results === undefined || data.results.length <= 0) setErrorSetup(true);
						setTypeList(data.results);
					});
			});
		// --- Obter lista de nomes
		fetch('https://pokeapi.co/api/v2/pokemon/?limit=9999')
			.then(response => {
				if (response.ok === false) setErrorSetup(true);
				response.json()
					.then(data => {
						if (data.results === undefined || data.results.length <= 0) setErrorSetup(true);
						console.log(data.results);
						setPokeList(data.results);
					});
			});
		fetch('https://pokeapi.co/api/v2/pokemon-species/pidgeot')
			.then(response => response.json())
			.then(data => console.log(data));
	}, []);
	// --- Durante a busca
	useEffect(() => {
		// --- Somente quando a busca estiver pronta
		if ((searching && typePrimaryReady && typeSecondaryReady) === false) return;
		if (ordering === true) return;
		// --- Array de resultados, populado de acordo com os tipos buscados
		let list = [];
		if (typePrimaryList === undefined) {
			if (typeSecondaryList === undefined) {
				// --- Tipos não foram especificados, será usada a lista completa de nomes
				list = pokeList;
			}
			else {
				// --- Apenas tipo secundário
				list = fixedOrder ?
					typeSecondaryList
						.map(item => (item.slot === 2) ? item.pokemon : null)
						.filter(item => item !== null) :
					typeSecondaryList
						.map(item => item.pokemon);
			}
		}
		else {
			// --- Tipo primário especificado
			list = fixedOrder ?
				typePrimaryList
					.map(item => (item.slot === 1) ? item.pokemon : null)
					.filter(item => item !== null) :
				typePrimaryList
					.map(item => item.pokemon);
			if (typeSecondaryList !== undefined) {
				// --- Ambos os tipos
				let newList = [];
				for (let i = 0; i < list.length; i++) {
					for (let j = 0; j < typeSecondaryList.length; j++) {
						if (list[i].name === typeSecondaryList[j].pokemon.name) {
							newList.push(typeSecondaryList[j].pokemon);
							break;
						}
					}
				}
				list = newList;
			}
		}
		// --- Adaptar os termos de pesquisa (PokeAPI usa apenas letras minúsculas e números, sem acentos, espaços ou caracteres
		// --- especiais exceto '-' no lugar de espaços)
		let queryList = query
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-zA-Z0-9]/g,' ')
			.split(' ')
			.filter(item => item.length > 0);
		// --- Filtrar a lista de resultados dos tipos usando os termos
		list = list.filter(item => {
			for (let i = 0; i < queryList.length; i++) {
				if (item.name.indexOf(queryList[i]) === -1) return false;
			}
			return true;
		});
		setResults([]);
		setOrderedResults([]);
		// --- Se não houver resultados
		if (list.length <= 0) {
			// --- Resetar variáveis internas de busca
			setHasSearched(true);
			setSearching(false);
			setTypePrimaryList(undefined);
			setTypePrimaryReady(false);
			setTypeSecondaryList(undefined);
			setTypeSecondaryReady(false);
			setOrdering(false);
		}
		// --- Se houver, fazer o fetch de cada resultado individual
		else {
			for (let i = 0; i < list.length; i++) {
				fetch(list[i].url)
					.then(response => {
						if (response.ok === false) setErrorSearch(true);
						response.json()
							.then(data => {
								let newResults = results;
								newResults.push({
									...data, 
									dexNumber: data.species.url
										.replace('https://pokeapi.co/api/v2/pokemon-species/', '')
										.replace('/', '')
								});
								// --- Quando chegar o último resultado, criar a lista ordenada por ID
								if (newResults.length >= list.length) {
									handleResults(newResults);
								} 
								else setResults(newResults);
							});
					});
			}
			setOrdering(true);
		}
	}, [searching, typePrimaryReady, typeSecondaryReady, ordering, pokeList, fixedOrder, query, results]);

	// Funções
	// --- Iniciar busca
	const handleSubmit = (event) => {
		// --- Rejeitar se já houver uma pesquisa acontecendo
		event.preventDefault();
		if (searching) return;
		setSearching(true);
		setErrorSearch(false);
		// --- Listar todos os pokémon contendo o tipo primário
		if (typePrimary === '') {
			// --- Manter indefinido no caso de qualquer tipo
			setTypePrimaryList(undefined);
			setTypePrimaryReady(true);
		}
		else if (typeRef[typePrimary]) {
			// --- Usar typeRef caso a informação já esteja armazenada
			setTypePrimaryList(typeRef[typePrimary]);
			setTypePrimaryReady(true);
		}
		else {
			// --- Do contrário, buscar a informação e guardá-la como propriedade de typeRef
			fetch('https://pokeapi.co/api/v2/type/' + typePrimary)
				.then(response => {
					if (response.ok === false) setErrorSearch(true);
					response.json()
						.then(data => {
							if (data.pokemon === undefined || data.pokemon.length <= 0) setErrorSearch(true);
							setTypeRef({...typeRef, [typePrimary]: data.pokemon})
							setTypePrimaryList(data.pokemon);
							setTypePrimaryReady(true);
						});
				});
		}
		// --- Repetir o processo com o tipo secundário
		if (typeSecondary === '' && typeSecondary === typePrimary) {
			// --- Manter indefinido no caso de qualquer tipo
			setTypeSecondaryList(undefined);
			setTypeSecondaryReady(true);
		}
		else if (typeRef[typeSecondary]) {
			// --- Usar typeRef caso a informação já esteja armazenada
			setTypeSecondaryList(typeRef[typeSecondary]);
			setTypeSecondaryReady(true);
		}
		else {
			// --- Do contrário, buscar a informação e guardá-la como propriedade de typeRef
			fetch('https://pokeapi.co/api/v2/type/' + typeSecondary)
				.then(response => {
					if (response.ok === false) setErrorSearch(true);
					response.json()
						.then(data => {
							if (data.pokemon === undefined || data.pokemon.length <= 0) setErrorSearch(true);
							setTypeRef({...typeRef, [typeSecondary]: data.pokemon})
							setTypeSecondaryList(data.pokemon);
							setTypeSecondaryReady(true);
						});
				});
		}
	}
	// --- Finalizar busca ordenando os resultados
	const handleResults = (unorderedResults) => {
		// --- Ordenar por ID (o ID usado pela PokeAPI é diferente do ID da pokédex, mas o ID real pode ser
		// --- extraído da URL da página da espécie)
		let list = unorderedResults;
		list.sort((a, b) => parseInt(a.dexNumber) - parseInt(b.dexNumber));
		setOrderedResults(list);
		setResults([]);
		// --- Resetar variáveis internas de busca
		setHasSearched(true);
		setSearching(false);
		setTypePrimaryList(undefined);
		setTypePrimaryReady(false);
		setTypeSecondaryList(undefined);
		setTypeSecondaryReady(false);
		setOrdering(false);
	}

	// Renderizar
	return (
		<>
		<main className="search">
			<h1 className="search__title">
				Busca Pokémon
			</h1>
			<span className="search__hint">
				Digite o nome (ou parte do nome) de um pokémon e/ou selecione seus tipos
			</span>
			{errorSetup ?
			<p className="search__error">
				Não foi possível coletar as informações necessárias, tente novamente mais tarde :(
			</p>
			:
			<form className="search__form" onSubmit={event => handleSubmit(event)}>
				<input
					className="search__input"
					type="text"
					placeholder="Nome do pokémon"
					maxLength={32}
					value={query}
					onChange={event => setQuery(event.target.value)}
					disabled={searching}
				/>
				<div className="search__typeFlex">
					<select
						className="search__drop"
						value={typePrimary}
						disabled={typeList === undefined || searching}
						onChange={event => setTypePrimary(event.target.value)}
					>
						{typeList === undefined ?
							<option value={''}>Carregando...</option>
							:
							<>
							<option value={''}>Qualquer Tipo</option>
							{typeList.map((t => { return(
								<option
									key={t.url}
									value={t.name}
									disabled={t.name === typeSecondary}
									>
									{t.name}
								</option>
							);}))}
							</>
						}
					</select>
					<select
						className="search__drop"
						value={typeSecondary}
						disabled={typeList === undefined || searching}
						onChange={event => setTypeSecondary(event.target.value)}
					>
						{typeList === undefined ?
							<option value={''}>Carregando...</option>
							:
							<>
							<option value={''}>Qualquer Tipo</option>
							{typeList.map((t => { return(
								<option
									key={t.url}
									value={t.name}
									disabled={t.name === typePrimary}
									>
									{t.name}
								</option>
							);}))}
							</>
						}
					</select>
				</div>
				<input
					className="search__check"
					id="searchCheck"
					type="checkbox"
					checked={fixedOrder}
					onChange={event => setFixedOrder(event.target.checked)}
					disabled={searching}
				/>
				<label className="search__label" htmlFor="searchCheck">
					Apenas tipos exatamente nessa ordem
				</label>
				<button disabled={pokeList === undefined || searching} className="search__submit" type="submit">
					Buscar
				</button>
			</form>
			}
		</main>
		<div className="list">
			{errorSearch ?
			<p className="list__error">
				Não foi possível realizar a pesquisa. Tente novamente mais tarde :(
			</p>
			:
			searching ?
			<p className="list__text">
				Pesquisando, aguarde um momento...
			</p>
			:
			hasSearched && (orderedResults.length <= 0 ?
			<p className="list__text">
				Nenhum resultado encontrado. Quem sabe usando uma configuração diferente?
			</p>
			:
			<ul className="list__results">
				{orderedResults.map(result => { return (
					<li className="result" key={result.name}>
						<Result pokemon={result} />
					</li>
				);})}
			</ul>
			)}
		</div>
		</>
	);
}

export default App;