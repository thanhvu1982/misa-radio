import { Box, makeStyles } from '@material-ui/core';
import { useAppSelector } from 'app/hooks';
import useSocket from 'app/socket';
import { wrapper } from 'app/store';
import { bannerImage } from 'constants/config';
import { CreateForm } from 'features/lobby/components/CreateForm';
import { JoinForm } from 'features/lobby/components/JoinForm';
import { authSSR } from 'libs/authSSR';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import en from 'translations/en/lobby';
import vi from 'translations/vi/lobby';

const useStyles = makeStyles((theme) => ({
  pageRoot: {
    width: '100vw',
    minHeight: '100vh',
    paddingTop: '120px',
    paddingBottom: '120px',
    backgroundImage: `linear-gradient(
      0deg, rgba(0,0,0,0.9) 0%,
      rgba(0,0,0,0.85) 10%,
      rgba(0,0,0,0.6) 50%,
      rgba(0,0,0,0.85) 90%,
      rgba(0,0,0,0.9) 100%
    ), url('${bannerImage}')`,
    backgroundPosition: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    width: '350px',
  },
  paperBox: {
    margin: 0,
    padding: 0,
  },
}));

const Lobby: NextPage = () => {
  const { locale } = useRouter();
  const t = locale === 'vi' ? vi : en;
  const { title } = t;
  const classes = useStyles();
  const option = useAppSelector((state) => state.lobby.option);
  const socket = useSocket();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta property="og:title" content={title} />
        <meta property="twitter:title" content={title} />
      </Head>
      <Box
        className={classes.pageRoot}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {socket && option === 'join' && <JoinForm />}
        {socket && option !== 'join' && <CreateForm />}
      </Box>
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

export default Lobby;
