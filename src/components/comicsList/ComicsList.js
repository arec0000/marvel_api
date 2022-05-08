import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    const updateComics = async () => {
        const newComics = await getAllComics(offset);
        setComics(comics => [...comics, ...newComics]);
        setComicsEnded(newComics.length < 8);
    }

    const renderComics = (comics) => {
        return comics.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
    }

    const onUpdateOffset = () => {
        setOffset(offset => offset + 8);
    }

    useEffect(() => {
        updateComics();
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
        <div className="comics__list">
            {error ? <ErrorMessage/> : null}
            <ul className="comics__grid">
                {!error ? renderComics(comics) : null}
            </ul>
            {loading ? <Spinner/> : null}
            <button 
                className="button button__main button__long"
                onClick={onUpdateOffset}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                disabled={loading}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;