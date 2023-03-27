import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FiSearch } from 'react-icons/fi';
import css from './searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const input = useRef(null);

  return (
    <header className={css.searchbar}>
      <form
        className={css.form}
        onSubmit={event => onSubmit(event, input)}
      >
        <button className={css.button} type="submit">
          <span>
            <FiSearch size={25} stroke="#3f51b5" />
          </span>
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          ref={input}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};