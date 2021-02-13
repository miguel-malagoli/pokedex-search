import React, { useEffect, useState } from 'react';

function App() {

	// Hooks de estado
	// --- Setup inicial (quando montado)
	const [errorSetup, setErrorSetup] = useState(false);
	const [pokeList, setPokeList] = useState(undefined);
	const [typeList, setTypeList] = useState(undefined);
	// --- Input do usuário
	const [query, setQuery] = useState('');
	const [typePrimary, setTypePrimary] = useState(undefined);
	const [typeSecondary, setTypeSecondary] = useState(undefined);
	const [fixedOrder, setFixedOrder] = useState(false);

	// Hooks de efeito
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
						setPokeList(data.results);
					});
			});
		fetch('https://pokeapi.co/api/v2/pokemon/darmanitan-zen')
			.then(response => response.json())
			.then(data => console.log(data));
	}, []);

	// Funções
	const handleSubmit = (event) => {
		console.log('query: ' + query);
		console.log('type 1: ' + typePrimary);
		console.log('type 2: ' + typeSecondary);
		console.log('fixed?: ' + fixedOrder);
		event.preventDefault();
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
				/>
				<div className="search__typeFlex">
					<select
						className="search__drop"
						value={typePrimary}
						defaultValue={''}
						disabled={typeList === undefined}
						onChange={event => setTypePrimary(event.target.value)}
					>
						{typeList === undefined ?
							<option value={''}>Carregando...</option>
							:
							<>
							<option value={''}>Qualquer Tipo</option>
							{typeList.map((t => <option key={t.url} value={t.name}>{t.name}</option>))}
							</>
						}
					</select>
					<select
						className="search__drop"
						value={typeSecondary}
						defaultValue={''}
						disabled={typeList === undefined}
						onChange={event => setTypeSecondary(event.target.value)}
					>
						{typeList === undefined ?
							<option value={''}>Carregando...</option>
							:
							<>
							<option value={''}>Qualquer Tipo</option>
							{typeList.map((t => <option key={t.url} value={t.name}>{t.name}</option>))}
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
				/>
				<label className="search__label" htmlFor="searchCheck">
					Apenas tipos exatamente nessa ordem
				</label>
				<button disabled={pokeList === undefined} className="search__submit" type="submit">
					Buscar
				</button>
			</form>
			}
		</main>
		</>
	);
}

export default App;