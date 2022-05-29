import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, process, setProcess, clearError} = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=8c3a4de72b3fc0df9b69371fbb96ea79';

    const getAllCharacters = async (offset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        if (process === 'error') clearError();
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        if (process === 'error') clearError();
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const findCharByName = async (name) => {
        if (process === 'error') clearError();
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.length > 0 ? _transformCharacter(res.data.results[0]) : {}
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description.length > 157 
                            ? `${char.description.slice(0, 157)}...` : char.description
                            || 'without description',
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10)
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'without description',
            pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'no information about the number of pages',
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
        }
    }

    return {
        loading, 
        process,
        setProcess,
        getAllCharacters, 
        getCharacter, 
        getAllComics, 
        getComic, 
        findCharByName
    };
}

export default useMarvelService;