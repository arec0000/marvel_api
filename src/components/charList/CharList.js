import { Component } from 'react/cjs/react.development';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    state = {
        chars: null,
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    updateChars = async () => {
        try {
            this.setState({chars: await this.marvelService.getAllCharacters(), loading: false});
        } catch(err) {
            this.setState({loading: false, error: true});
        }
    }

    renderChars = (chars) => {
        return chars.map(char => {
            const style = char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                            ? {objectFit: 'contain', width: '200px', height: '170px'}
                            : {objectFit: 'cover'};
            return (
                <li key={char.id} className="char__item" onClick={() => {this.props.onCharSelected(char.id)}}>
                    <img style={style} src={char.thumbnail} alt={char.name}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        });
    }

    componentDidMount() {
        this.updateChars();
    }

    render() {
        const {chars, loading, error} = this.state;
        return (
            <div className="char__list">
                <ul className="char__grid" style={loading || error ? {display: 'block'} : null}>
                    {loading ? <Spinner/> : null}
                    {error ? <ErrorMessage/> : null}
                    {!loading && !error ? this.renderChars(chars) : null}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;