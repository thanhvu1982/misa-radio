import { Box, Container, Grid, makeStyles, Paper } from '@material-ui/core';
import { wrapper } from 'app/store';
import { VideoBox, VideoCardListBox } from 'components/pages/player';
import { authSSR } from 'libs/authSSR';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import en from 'translations/en/player';
import vi from 'translations/vi/player';
import useSocket from 'app/socket';

const useStyles = makeStyles((theme) => ({
  pageRoot: {
    paddingBottom: '70px',
    padding: '120px 0',
  },
  container: {
    padding: 0,
  },
  paper: {
    textAlign: 'center',
    backgroundColor: '#212121',
    color: theme.palette.text.secondary,
    padding: theme.spacing(1.5),
  },
}));

const Player: NextPage = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'vi' ? vi : en;
  const classes = useStyles();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      router.push('/lobby');
    }
  }, [router, socket]);

  return (
    <>
      <Head>
        <title>{t.title} - Misa Radio</title>
      </Head>
      {socket && (
        <Container className={classes.pageRoot}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Grid container spacing={3} className={classes.container}>
              <Grid item xs={12} md={8}>
                <Paper className={classes.paper}>
                  <VideoBox />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper className={classes.paper}>
                  <VideoCardListBox />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context) => {
    const res = await authSSR(
      context.req.cookies,
      store.dispatch,
      context.res,
      true,
    );
    return res;
  });

export default Player;
