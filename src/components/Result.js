import React, { useEffect, useState } from 'react';

const Result = (props) => {

    // Hooks de estado
    const [error, setError] = useState(false);
    const [species, setSpecies] = useState(undefined);
    const [color, setColor] = useState(undefined);

    // Hooks de efeito
    useEffect(() => {
        // --- Buscar informação da espécie que falta na informação de pokémon
        fetch(props.pokemon.species.url)
			.then(response => {
				if (response.ok === false) setError(true);
				response.json()
					.then(data => {
						for (let i = 0; i < data.names.length; i++) {
                            if (data.names[i].language.name === 'en') {
                                setSpecies(data.names[i].name);
                                break;
                            }
                        }
                        setColor(data.color.name);
					});
			});
    }, []);

    // Constantes usadas na renderização
    const scoreHP = props.pokemon.stats[0].base_stat / 255;
    const scoreATK = props.pokemon.stats[1].base_stat / 255;
    const scoreDEF = props.pokemon.stats[2].base_stat / 255;
    const scoreSATK = props.pokemon.stats[3].base_stat / 255;
    const scoreSDEF = props.pokemon.stats[4].base_stat / 255;
    const scoreSPD = props.pokemon.stats[5].base_stat / 255;

    // Renderizar
    return (
        <a
            className="result__link"
            href={'https://bulbapedia.bulbagarden.net/wiki/' + (species ?? 'MissingNo') + '_(Pokémon)'}
            target="_blank"
            style={{border: '4px solid ' + color ?? 'black'}}
            onClick={event => {if (species === undefined) event.preventDefault()}}
            >
            {error ?
            <span className="result__error">Oops! Não foi possível obter os dados desse pokémon :(</span>
            :
            <>
            <div className="result__title" style={{borderBottom: '2px solid ' + color ?? 'black'}}>
                <span
                    className="result__dex"
                    style={{borderRight: '2px solid ' + color ?? 'black'}}
                    >
                    {'#' + (props.pokemon.dexNumber ?? '???')}
                </span>
                <span className="result__name">{species ?? 'Carregando...'}</span>
            </div>
            <img
                className="result__avatar"
                src={props.pokemon.sprites.front_default ??
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'}
                alt={props.pokemon.name ?? 'Carregando...'}
                width="100"
                height="100"
            />
            <div
                className="result__typeFlex"
                style={{
                    borderTop: '2px solid ' + color ?? 'black',
                    borderBottom: '2px solid ' + color ?? 'black'
                }}
                >
                <span className="result__type">
                    {props.pokemon.types.length > 0 ? (props.pokemon.types[0].type.name ?? '---') : '---'}
                </span>
                <span className="result__type">
                    {props.pokemon.types.length > 1 ? (props.pokemon.types[1].type.name ?? '---') : '---'}
                </span>
            </div>
            <div className="result__statFlex">
                <div
                    className="result__hex"
                    style={{
                        width: '100px',
                        height: '100px',
                        position: 'relative',
                        backgroundColor: color ?? 'black',
                        opacity: '0.75',
                        clipPath: 'polygon(50% 0, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)'
                    }}
                    >
                    <div
                        className="result__stats"
                        style={{
                            width: '96px',
                            height: '96px',
                            position: 'relative',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: color === 'white' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
                            clipPath: 'polygon(' + 
                                '50% ' + (50 - (scoreHP * 50)) + '%, ' +
                                (50 + (scoreATK * 45)) + '% ' + (50 - (scoreATK * 25)) + '%, ' +
                                (50 + (scoreDEF * 45)) + '% ' + (50 + (scoreDEF * 25)) + '%, ' +
                                '50% ' + (50 + (scoreSPD * 50)) + '%, ' +
                                (50 - (scoreSDEF * 45)) + '% ' + (50 + (scoreSDEF * 25)) + '%, ' +
                                (50 - (scoreSATK * 45)) + '% ' + (50 - (scoreSDEF * 25)) + '%)'
                        }}
                    >
                    </div>
                </div>
                <ul className="result__statList">
                    <li className="result__label">
                        HP <span className="result__score">{props.pokemon.stats[0].base_stat}</span>
                    </li>
                    <li className="result__label">
                        ATK <span className="result__score">{props.pokemon.stats[1].base_stat}</span>
                    </li>
                    <li className="result__label">
                        DEF <span className="result__score">{props.pokemon.stats[2].base_stat}</span>
                    </li>
                    <li className="result__label">
                        S.ATK <span className="result__score">{props.pokemon.stats[3].base_stat}</span>
                    </li>
                    <li className="result__label">
                        S.DEF <span className="result__score">{props.pokemon.stats[4].base_stat}</span>
                    </li>
                    <li className="result__label">
                        SPD <span className="result__score">{props.pokemon.stats[5].base_stat}</span>
                    </li>
                </ul>
            </div>
            </>
            }
        </a>
    );
}

// Exportar
export default Result;