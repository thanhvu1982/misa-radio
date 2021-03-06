import {
  Box,
  CircularProgress,
  Container,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import useSocket from 'app/socket';
import { SongCard } from 'components/pages/player';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import en from 'translations/en/player';
import vi from 'translations/vi/player';
import { playerActions } from '../playerSlice';
import { searchSongs } from '../playerThunk';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    width: '720px',
    backgroundColor: '#212121',
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4, 3),
    borderRadius: '8px',

    [theme.breakpoints.down('xs')]: {
      width: '360px',
      padding: theme.spacing(2),
    },
  },
  modalHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',

    [theme.breakpoints.down('xs')]: {
      fonSize: '1rem !important',
    },
  },
  formContainer: {
    width: '100%',
  },
  resultList: {
    height: '50vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingTop: '1rem',
    paddingBottom: '1rem',

    '&::-webkit-scrollbar': {
      width: '3px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px #202020',
      webkitBoxShadow: 'inset 0 0 6px #202020',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#555',
      outline: 'none',
      borderRadius: '10px',
    },
  },
  resultItem: {
    cursor: 'pointer',
  },
}));

interface PropTypes {
  handleClose: () => any;
}

export const ModalPopup: FC<PropTypes> = ({ handleClose }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'vi' ? vi : en;
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.player.search.loading);
  const result = useAppSelector((state) => state.player.search.data);
  const socket = useSocket();

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (query) {
      dispatch(
        searchSongs({
          query,
        }),
      );
    } else {
      dispatch(playerActions.clearSearchResult());
    }
  }

  function onSelect(id: string) {
    if (socket) {
      toast.info(t.orderSongPending);
      socket.emit('order-song', {
        roomId: router.query.id,
        id,
      });
    }
  }

  useEffect((): any => {
    if (query) {
      const timeOutId = setTimeout(() => {
        dispatch(
          searchSongs({
            query,
          }),
        );
      }, 500);
      return () => clearTimeout(timeOutId);
    }
    dispatch(playerActions.clearSearchResult());
  }, [query, dispatch]);

  return (
    <Container>
      <Box className={classes.modalRoot}>
        <Box mb={2}>
          <form className={classes.formContainer} onSubmit={onSubmit}>
            <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
              <Typography variant="h5" className={classes.modalHeader}>
                {t.search}
              </Typography>
            </Box>
            <Box>
              <TextField
                size="medium"
                margin="normal"
                variant="outlined"
                fullWidth
                placeholder={`${t.searchSomething} ...`}
                onChange={handleQueryChange}
              />
            </Box>
          </form>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          flexGrow={1}
          className={classes.resultList}
        >
          {loading && <CircularProgress />}
          {result.map((song) => (
            <Box
              mb={1.5}
              key={song.id}
              width="100%"
              className={classes.resultItem}
              onClick={() => {
                onSelect(song.id);
                handleClose();
              }}
            >
              <SongCard song={song} />
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};
