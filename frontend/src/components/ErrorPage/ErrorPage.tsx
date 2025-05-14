import errorImg from "../../assets/errorCat.webp";
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import SouthIcon from '@mui/icons-material/South';
import { NavLink } from 'react-router-dom';
import { COLORS, SPACING } from '../../globalStyles/stylesObjects.ts';


const ErrorPage = () => {
  return (
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", margin: "100px"}}>
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
        <Typography variant="h1">404</Typography>
        <Typography variant="h4">Ой!</Typography>
        <Typography variant="h5">Кажется что-то пошло не так.</Typography>
        <Typography variant="h5">Давайте вернемся в магазин :)</Typography>
        <SouthIcon sx={{margin: "20px 0"}}/>
        <NavLink to="/" className="text-decoration-none text-black" style={{color: COLORS.primary, backgroundColor: COLORS.yellow, padding: SPACING.xs, borderRadius: "10px"}}>
          Магазин
        </NavLink>
      </Box>
      <Box
        component="img"
        sx={{
          height: 400,
          width: 400,
        }}
        alt="Error"
        src={errorImg}
      />
    </Box>
  );
};

export default ErrorPage;