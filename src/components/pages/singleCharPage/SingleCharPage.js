import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';

import './singleCharPage.scss';

const SingleCharPage = () => {
    const {charId} = useParams();
    const [char, setChar] = useState(null);
    const {loading, error, getCharacter} = useMarvelService();

    const updateChar = async (id) => {
        setChar(await getCharacter(id));
    }

    useEffect(() => {
        updateChar(charId);
    }, [charId]);

    return (
        <>
            <div className="single-comic">
                {
                    char ? <>
                        <img src={char.thumbnail} alt={char.name} className="single-comic__char-img"/>
                        <div className="single-comic__info">
                            <h2 className="single-comic__name">{char.name}</h2>
                            <p className="single-comic__descr">{char.description}</p>
                        </div>
                    </> : null
                }
            </div>
            {loading ? <Spinner/> : null}
            {error ? <ErrorMessage/> : null}
        </>
    )
}

export default SingleCharPage;
