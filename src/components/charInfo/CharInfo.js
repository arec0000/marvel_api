import { Component } from 'react/cjs/react.development';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    updateChar = async () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.setState({loading: true});
        try {
            this.setState({char: await this.marvelService.getCharacter(charId), loading: false});
        } catch (error) {
            this.setState({loading: false, error: true});
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.charId !== this.props.charId) {
            this.updateChar();
        }
    }

    componentDidMount() {
        this.updateChar();
    }

    render() {
        const {char, loading, error} = this.state;
        return (
            <div className="char__info">
                {!(char || loading || error) ? <Skeleton/> : null}
                {loading ? <Spinner/> : null}
                {error ? <ErrorMessage/> : null}
                {!loading && !error && char ? <View char={char}/> : null}
            </div>
        )
    }
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

export default CharInfo;