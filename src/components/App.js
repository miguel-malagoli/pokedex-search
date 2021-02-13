import React, { useEffect, useState } from 'react';

function App() {
	// Hooks de estado
	const [typeList, setTypeList] = useState(undefined);
	// Hooks de efeito
	useEffect(() => {
		fetch('https://pokeapi.co/api/v2/type/')
			.then(response => response.json())
			.then(data => setTypeList(data.results));
	}, [])
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
			<form className="search__form">
				<input
					className="search__input"
					placeholder="Nome do pokémon"
					maxLength={12}
				/>
				<div className="search__typeFlex">
					<select className="search__drop">
						{typeList === undefined &&
							<option selected="selected" value={undefined} disabled={true}>Carregando...</option>
						}
						{typeList !== undefined &&
							<>
							<option selected="selected" value={undefined}>Qualquer Tipo</option>
							{typeList.map((t => <option key={t.url} value={t.name}>{t.name}</option>))}
							</>
						}
					</select>
					<select className="search__drop">
						{typeList === undefined &&
							<option selected="selected" value={undefined} disabled={true}>Carregando...</option>
						}
						{typeList !== undefined &&
							<>
							<option selected="selected" value={undefined}>Qualquer Tipo</option>
							{typeList.map((t => <option key={t.url} value={t.name}>{t.name}</option>))}
							</>
						}
					</select>
				</div>
				<button className="search__submit" type="submit">
					Buscar
				</button>
			</form>
		</main>
		</>
	);
}

export default App;