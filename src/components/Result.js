import React, { useEffect, useState } from 'react';

const Result = (props) => {
    // nome (species)
    // sprite (poke)
    // stats (poke)
    // types (poke)
    // color (species)
    // id (species, can get from poke)

    const [error, setError] = useState(false);

    const [dexId, setDexId] = useState(undefined);
    const [species, setSpecies] = useState(undefined);
    const [avatar, setAvatar] = useState('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png');

    useEffect(() => {

    }, []);

    return (
        <div>
            
        </div>
    );
}

export default Result;