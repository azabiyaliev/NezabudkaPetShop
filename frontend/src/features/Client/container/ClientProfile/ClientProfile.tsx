import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";
import { useAppSelector } from "../../../../app/hooks.ts";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import { Paper, Typography, Box } from "@mui/material";

const ClientProfile = () => {
  const user = useAppSelector(selectUser);
  return (
    <div>
      <h2 className="text-uppercase text-center mt-5">Личный кабинет</h2>
      <div className="d-flex ">
        <div className="col-3 mt-5 ">
          <ClientBar />
        </div>
        <div className="col-9">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Paper
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#FFEB3B",
                borderRadius: 2,
                boxShadow: 3,
                width: "200px",
                marginRight:8
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
                Ваши бонусы:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#FF5722", marginTop: 1 }}>
                {user && user.bonus}
              </Typography>
            </Paper>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
