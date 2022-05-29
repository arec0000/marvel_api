import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useMarvelService from '../../../services/MarvelService';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const {loading, error, getComic} = useMarvelService();

    const updateComic = async (id) => {
        setComic(await getComic(id));
    }

    useEffect(() => {
        updateComic(comicId);
    }, [comicId]);

    return (
        <>
            {loading && !comic ? <Spinner/> : null}
            {error ? <ErrorMessage/> : null}
            {comic ? <View comic={comic}/> : null}
        </>
    )
}

const View = ({comic}) => {
    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content={`${comic.title} comics book`}/>
                <title>{comic.title}</title>
            </Helmet>
            <img src={comic.thumbnail} alt={comic.title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{comic.title}</h2>
                <p className="single-comic__descr">{comic.description}</p>
                <p className="single-comic__descr">{comic.pageCount}</p>
                <p className="single-comic__descr">Language: {comic.language}</p>
                <div className="single-comic__price">{comic.price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;