import { useState, useEffect, useRef } from 'react/cjs/react.development';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = ({onCharSelected}) => {
    const [chars, setChars] = useState([]);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const charsRefs = useRef([]);
    const {process, loading, setProcess, getAllCharacters} = useMarvelService();

    const updateChars = async () => {
        const newChars = await getAllCharacters(offset);
        setChars(chars => [...chars, ...newChars]);
        setProcess('confirmed');
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
        const items = chars.map((char, i) => {
            const style = char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                            ? {objectFit: 'contain', width: '200px', height: '170px'}
                            : {objectFit: 'cover'};
            return (
                <CSSTransition
                    key={char.id}
                    timeout={300}
                    classNames="char__item"
                    unmountOnExit>
                    <li tabIndex={0} 
                        ref={el => charsRefs.current[i] = el} 
                        className="char__item" 
                        onFocus={() => {onSelectChar(char.id, i)}}
                    >
                        <img style={style} src={char.thumbnail} alt={char.name}/>
                        <div className="char__name">{char.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
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
            {chars ? renderChars(chars) : null}
            {process === 'loading' ? <Spinner/> : null}
            {process === 'error' ? <ErrorMessage/> : null}
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