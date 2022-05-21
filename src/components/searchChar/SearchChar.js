import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as yup from 'yup';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './searchChar.scss';

const SearchChar = () => {

    const [char, setChar] = useState(null);
    const {loading, error, findCharByName} = useMarvelService();

    const result = char ? 
        char.name ? 
            <div className="char__search-wrapper">
                <div className="char__search-success">There is! Visit {char.name} page?</div>
                <Link to={`/characters/${char.id}`} className="button button__secondary">
                    <div className="inner">To page</div>
                </Link>
            </div> :
            <div className="char__search-error">
                The character was not found. Check the name and try again
            </div> : null

    return (
        <div className="char__search-form">
            <Formik
            initialValues={{
                charName: ''
            }}
            validationSchema={yup.object({
                charName: yup.string().required('Enter name')
            })}
            onSubmit={async ({charName}) => {
                setChar(null);
                setChar(await findCharByName(charName));
            }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName"/>
                </Form>
            </Formik>
            {result}
            {error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null}
        </div>
    )
}

export default SearchChar;
