import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks.ts";
import { Box, Paper, Typography } from '@mui/material';
import {useEffect} from "react";
import { selectClientInfo } from '../../../../store/clientInfo/clientInfoSlice.ts';
import { fetchClientInfo } from '../../../../store/clientInfo/clientInfoThunk.ts';

const ClientProfile = () => {
  const dispatch = useAppDispatch();
  const clientInfo = useAppSelector(selectClientInfo);

  useEffect(() => {
    dispatch(fetchClientInfo());
  }, [dispatch]);

  return (
    <div>
      <div className="d-flex ">
        <div className="col-3 mt-5 ">
          <ClientBar />
        </div>
        <div className="col-9 mt-5">
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
            Личный кабинет
          </Typography>
          <Paper
            sx={{
              p: 3,
              mt: 2,
              width: "800px",
              mx: "auto",
              display: "flex",
              justifyContent: "center"
            }}
            elevation={2}
          >
            <Box
              sx={{ textAlign: 'center' }}
              dangerouslySetInnerHTML={{ __html: clientInfo?.information || '' }}
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
