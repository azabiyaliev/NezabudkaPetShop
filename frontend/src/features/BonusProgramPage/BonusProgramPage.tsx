import { Box, Container, Typography } from '@mui/material';
import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useEffect } from 'react';
import { selectBonusProgram } from '../../store/bonusProgramPage/bonusProgramPageSlice.ts';
import { fetchBonusPage } from '../../store/bonusProgramPage/bonusProgramPageThunk.ts';
import theme from '../../globalStyles/globalTheme.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { Link } from "react-router-dom";

const BonusProgramPage = () => {
  const bonusProgram = useAppSelector(selectBonusProgram);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(fetchBonusPage()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    document.title = `Бонусная программа`;
  }, []);

  return (
    <Container maxWidth="xl">
      <div className="d-flex">
        <div className="col-3 mt-5">
          <ByuerBarTopTollBar />
        </div>

        <div className="col-9 mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
          <Container>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
              Бонусная программа
            </Typography>

            <Box
              sx={{
                borderRadius: '5px',
                padding: 4,
                backgroundColor: theme.colors.rgbaGrey,
                mx: 'auto',
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: bonusProgram?.text || '<p>Информация пока не добавлена.</p>' }}
                style={{
                  lineHeight: 1.6,
                  fontSize: '16px',
                  color: theme.colors.text,
                  marginBottom: '16px',
                }}
              />
              {!user && (
                <Box
                  sx={{
                    mt: 4,
                    borderRadius: '5px',
                    mb: 3,
                    color: theme.colors.DARK_GREEN,
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    Чтобы получать и использовать бонусы, вам необходимо{' '}
                    <Link to="/login" style={{ color: theme.colors.DARK_GREEN, textDecoration: 'underline' }}>войти</Link> или{' '}
                    <Link to="/register" style={{ color: theme.colors.DARK_GREEN, textDecoration: 'underline' }}>зарегистрироваться</Link>.
                  </Typography>
                </Box>
              )}
            </Box>
          </Container>
        </div>
      </div>
    </Container>
  );
};

export default BonusProgramPage;
