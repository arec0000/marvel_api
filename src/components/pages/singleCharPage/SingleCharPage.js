import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useMarvelService from '../../../services/MarvelService';
import setContent from '../../../utils/setContent';

import './singleCharPage.scss';

const SingleCharPage = () => {
    const {charId} = useParams();
    const [char, setChar] = useState(null);
    const {process, setProcess, getCharacter} = useMarvelService();

    const updateChar = async (id) => {
        setChar(await getCharacter(id));
        setProcess('confirmed');
    }

    useEffect(() => {
        updateChar(charId);
    }, [charId]);

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={char ? `${char.name} page` : 'Char page'}/>
                <title>{char ? char.name : 'Char page'}</title>
            </Helmet>
            {setContent(process, View, char)}
        </>
    )
}

const View = ({data}) => {
    return (
        <div className="single-comic">
            <img src={data.thumbnail} alt={data.name} className="single-comic__char-img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{data.name}</h2>
                <p className="single-comic__descr">{data.description}</p>
            </div>
        </div>
    )
}

export default SingleCharPage;
