import { useState, useEffect, useRef } from 'react/cjs/react.development';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = ({onCharSelected}) => {
    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const charsRefs = useRef([]);
    const {loading, error, getAllCharacters} = useMarvelService();

    const updateChars = async () => {
        const newChars = await getAllCharacters(offset);
        setChars(chars => [...chars, ...newChars]);
        setCharEnded(newChars.length < 9);
    }

    const onSelectChar = (id, charIndex) => {
        onCharSelected(id);
        charsRefs.current.forEach((char, i) => {
            if (i === charIndex) {
                char.classList.add('char__item_selected');
            } else {
                char.classList.remove('char__item_selected');
            }
        });
    }

    const renderChars = (chars) => {
        return chars.map((char, i) => {
            const style = char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                            ? {objectFit: 'contain', width: '200px', height: '170px'}
                            : {objectFit: 'cover'};
            return (
                <li tabIndex={0} 
                    key={char.id} 
                    ref={el => charsRefs.current[i] = el} 
                    className="char__item" 
                    onFocus={() => {onSelectChar(char.id, i)}}
                >
                    <img style={style} src={char.thumbnail} alt={char.name}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        });
    }

    const onUpdateOffset = () => {
        setOffset(offset => offset + 9)
    }

    useEffect(() => {
        updateChars();   
    }, [offset]);

    useEffect(() => {
        const onScroll = () => {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 50 && !loading) {
                onUpdateOffset();
            }
        }
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll);
        return () => { window.removeEventListener('scroll', onScroll) }
    }, [loading]);

    return (
        <div className="char__list">
            {error ? <ErrorMessage/> : null}
            <ul className="char__grid">
                {!error ? renderChars(chars) : null}
            </ul>
            {loading ? <Spinner/> : null}
            <button 
                className="button button__main button__long" 
                onClick={onUpdateOffset}
                disabled={loading}
                style={{'display': charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;