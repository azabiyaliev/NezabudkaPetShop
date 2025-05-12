import errorImg from "../../assets/errorCat.png";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import SouthIcon from "@mui/icons-material/South";
import { NavLink } from "react-router-dom";
import { COLORS, SPACING } from "../../globalStyles/stylesObjects.ts";

const ErrorPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
        marginTop: "100px",
        marginBottom: "100px",
        "@media (max-width: 780px)": {
          flexDirection: "column-reverse",
          margin: "50px 20px",
          textAlign: "center",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: "3rem", sm: "4rem", md: "6rem" } }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, mb: 1 }}
        >
          Ой!
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" }, mb: 0.5 }}
        >
          Кажется, что-то пошло не так.
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" }, mb: 2 }}
        >
          Давайте вернемся в магазин :)
        </Typography>
        <SouthIcon
          sx={{ margin: "20px 0", fontSize: { xs: "2rem", sm: "3rem" } }}
        />
        <NavLink
          to="/"
          className="text-decoration-none text-black"
          style={{
            color: COLORS.primary,
            backgroundColor: COLORS.yellow,
            padding: SPACING.xs,
            borderRadius: "10px",
          }}
        >
          Магазин
        </NavLink>
      </Box>
      <Box
        component="img"
        sx={{
          width: { xs: 180, sm: 250, md: 400 },
          height: "auto",
        }}
        alt="Error"
        src={errorImg}
      />
    </Box>
  );
};

export default ErrorPage;
