import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { Box, Container, Paper, Typography } from '@mui/material';
import { useEffect } from "react";
import { selectClientInfo } from "../../../../store/clientInfo/clientInfoSlice.ts";
import { fetchClientInfo } from "../../../../store/clientInfo/clientInfoThunk.ts";
import { selectUser } from '../../../../store/users/usersSlice.ts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { fetchUserIdBonus } from '../../../../store/users/usersThunk.ts';
import theme from "../../../../globalStyles/globalTheme.ts";

const ClientProfile = () => {
  const dispatch = useAppDispatch();
  const clientInfo = useAppSelector(selectClientInfo);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserIdBonus(String(user.id))).unwrap();
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    dispatch(fetchClientInfo());
  }, [dispatch]);

  useEffect(() => {
    document.title = "Личный кабинет";
  }, []);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box sx={{ flex: { md: "0 0 25%" }, mt: 4 }}>
          <ClientBar />
        </Box>

        <Box sx={{ flex: 1, mt: { xs: 0, md: 5 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Личный кабинет
          </Typography>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              mt: 3,
              position: "relative",
            }}
          >
            <Box
              sx={{
                float: { xs: "none", md: "right" },
                ml: { md: 3 },
                mb: { md: 2 },
                width: "auto",
                minWidth: 200,
                maxWidth: 240,
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.BORDER_CART}`,
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <EmojiEventsIcon sx={{ color: theme.colors.primary, fontSize: 40 }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: theme.fonts.weight.medium,
                    fontSize: theme.fonts.size.default,
                  }}
                >
                  Ваши бонусы
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: theme.fonts.size.default }}
                >
                  {user?.bonus ?? 0} баллов
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{ textAlign: "left", mt: 1 }}
              dangerouslySetInnerHTML={{
                __html: clientInfo?.information || "",
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Container>

  );
};

export default ClientProfile;
