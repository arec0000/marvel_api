import { useState, useEffect } from 'react/cjs/react.development';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = ({charId}) => {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacter} = useMarvelService();

    const updateChar = async () => {
        if (!charId) return;
        setChar(await getCharacter(charId));
    }

    useEffect(() => {
        updateChar();
    }, [charId]);

    return (
        <div className="char__info">
            {!(char || loading || error) ? <Skeleton/> : null}
            {loading ? <Spinner/> : null}
            {error ? <ErrorMessage/> : null}
            {!loading && !error && char ? <View char={char}/> : null}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const style = char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                            ? {objectFit: 'contain'}
                            : {objectFit: 'cover'};
    return (
        <>
            <div className="char__basics">
                <img style={style} src={thumbnail} alt="abyss"/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
                {!comics[0] ? 'without comics' : null}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;