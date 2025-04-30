import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks.ts";
import { Paper, Typography } from "@mui/material";
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
        <div className="col-9">
          <h2 className="text-uppercase text-center mt-5">Личный кабинет</h2>
          <Paper sx={{ p: 3, mt: 2 }} elevation={2}>
            <Typography variant="body1" align="center">
              {clientInfo?.information || 'Информация отсутствует'}
            </Typography>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
