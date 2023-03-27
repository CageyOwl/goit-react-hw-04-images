import { useState, useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import api from '../services/api';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import STATUS from '../services/statuses';
import { PER_PAGE } from '../services/api';
import css from './app.module.css';

export function App() {
  const [status, setStatus] = useState(() => STATUS.IDLE);
  const [error, setError] = useState(() => '');
  const [searchQuery, setSearchQuery] = useState(() => '');
  const [currentPage, setCurrentPage] = useState(() => 0);
  const [maxPage, setMaxPage] = useState(() => 0);
  const [hits, setHits] = useState(() => []);
  const [isModalOpened, setIsModalOpened] = useState(() => false);
  const [modalImgAlt, setModalImgAlt] = useState(() => '');
  const [modalImgURL, setModalImgURL] = useState(() => '');

  const onSubmit = (event, inputRef) => {
    event.preventDefault();
    const value = inputRef.current.value.trim();
    if (!value) {
      setError('Empty input, write something, please.');
      setStatus(STATUS.REJECTED);
      return;
    }
    if (searchQuery !== value) {
      setSearchQuery(value);
      setCurrentPage(1);
    }
    inputRef.current.value = '';
  };

  const toggleModal = () => {
    setIsModalOpened(!isModalOpened);
  };

  const closeModalOnBackdropClick = event => {
    if (event.currentTarget === event.target) {
      toggleModal();
    }
  };

  const openModal = event => {
    if (event.target.tagName !== 'IMG') return;
    setModalImgAlt(event.target.alt);
    setModalImgURL(event.target.dataset.largeimageurl);
    toggleModal();
  };

  const onLoadMoreClick = () => {
    setCurrentPage(prevState => ++prevState);

    animateScroll.scrollToBottom({
      duration: 1000,
      delay: 0,
      smooth: 'linear',
    });
  };

  const loadNewImages = async (searchQuery, page) => {
    setStatus(STATUS.PENDING);

    let data = {};
    try {
      data = await api(searchQuery, page);
      if (!data.total) {
        throw new Error('No results found.');
      }
    } catch (error) {
      setError(error.message);
      setStatus(STATUS.REJECTED);
      return;
    }

    if (page === 1) {
      setHits([...data.hits]);
      setMaxPage(Math.ceil(data.totalHits / PER_PAGE));
    } else {
      setHits(prevState => [...prevState, ...data.hits]);
    }

    setStatus(STATUS.RESOLVED);
  };

  useEffect(() => {
    if (!searchQuery) return;
    loadNewImages(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  return (
    <div className={css.app}>
      <Searchbar onSubmit={onSubmit} />

      {status === STATUS.PENDING && <Loader />}
      {status === STATUS.REJECTED && <p className={css.error}>{error}</p>}
      {status === STATUS.RESOLVED && (
        <ImageGallery hits={hits} openModal={openModal} />
      )}
      {status === STATUS.RESOLVED && currentPage !== maxPage && (
        <Button onLoadMoreClick={onLoadMoreClick} />
      )}

      {isModalOpened && (
        <Modal
          onClose={closeModalOnBackdropClick}
          onKeyDown={toggleModal}
          imageAlt={modalImgAlt}
          imageURL={modalImgURL}
        />
      )}
    </div>
  );
}
