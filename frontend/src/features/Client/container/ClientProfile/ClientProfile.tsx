import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { selectClientInfo } from "../../../../store/clientInfo/clientInfoSlice.ts";
import { fetchClientInfo } from "../../../../store/clientInfo/clientInfoThunk.ts";

const ClientProfile = () => {
  const dispatch = useAppDispatch();
  const clientInfo = useAppSelector(selectClientInfo);

  useEffect(() => {
    dispatch(fetchClientInfo());
  }, [dispatch]);


  return (
    <>
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
              mt: 2,
              width: "100%",
              mx: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ textAlign: "center" }}
              dangerouslySetInnerHTML={{
                __html: clientInfo?.information || "",
              }}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ClientProfile;
