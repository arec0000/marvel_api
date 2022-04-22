import { Component } from 'react/cjs/react.development';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    state = {
        chars: [],
        offset: 210,
        charEnded: false,
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    updateChars = async () => {
        this.setState({loading: true});
        const newChars = await this.marvelService.getAllCharacters(this.state.offset);
        try {
            this.setState(({chars}) => 
                ({chars: [...chars, ...newChars], loading: false, charEnded: newChars.length < 9})
            );
        } catch(err) {
            this.setState({loading: false, error: true});
        }
    }

    onUpdateOffset = () => {
        new Promise(resolve => 
            this.setState(({offset}) => ({offset: offset + 9}), resolve))
            .then(this.updateChars);
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

    onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 50 && !this.state.loading) {
            this.onUpdateOffset();
        }
    }

    componentDidMount() {
        this.updateChars();
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    render() {
        const {chars, loading, error, charEnded} = this.state;
        return (
            <div className="char__list">
                {error ? <ErrorMessage/> : null}
                <ul className="char__grid">
                    {!error ? this.renderChars(chars) : null}
                </ul>
                {loading ? <Spinner/> : null}
                <button 
                    className="button button__main button__long" 
                    onClick={this.onUpdateOffset}
                    disabled={loading}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;