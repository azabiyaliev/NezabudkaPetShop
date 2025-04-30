import { IBrand } from '../../../../../types';
import React from 'react';
import { apiUrl, userRoleAdmin, userRoleSuperAdmin } from '../../../../../globalConstants.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '@mui/material';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, usePermission } from '../../../../../app/hooks.ts';
import { selectUser } from '../../../../../store/users/usersSlice.ts';
import { brandeDelete, getBrands } from '../../../../../store/brands/brandsThunk.ts';
import noImage from '../../../../../assets/no-image.jpg';
import { Link } from '@mui/joy';
import { enqueueSnackbar } from 'notistack';

interface Props {
  brand: IBrand;
  index: number;
}

const Brand: React.FC<Props> = ({ brand, index }) => {
  const user = useAppSelector(selectUser);
  const can = usePermission(user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let brandImage = noImage;

  if (brand.logo) {
    brandImage = apiUrl + brand.logo;
  }

  const deleteThisBrand = async (id: number) => {
    if (user && (can([userRoleAdmin, userRoleSuperAdmin]))) {
      await dispatch(brandeDelete({ brandId: id, token: user.token })).unwrap();
      enqueueSnackbar("Бренд успешно удален!", { variant: 'success' });
      await dispatch(getBrands()).unwrap();
    }
  };

  return (
    <>
      <tr>
        <td
          style={{
            fontSize: "15px",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 400
          }}
        >
          {index + 1}
        </td>
        <td>
          <img
            onClick={() => navigate(`/brand/${brand.id}`)}
            src={brandImage}
            alt={brand.title}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
            }}/>
        </td>
        <td
          style={{
            fontSize: "18px",
          }}
        >
          <Link
            href={`/brand/${brand.id}`}
            sx={{
              fontFamily: "Nunito, sans-serif",
              color: "black",
              textDecoration: "none",
              fontWeight: 600,
              '&:hover': {
                color: "rgba(250, 179, 1, 1)",
              },
            }}
          >{brand.title}</Link>
        </td>
        <td
          style={{
            textAlign: "center",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(`/private/edit_brand/${brand.id}`)}
          >
            <EditNoteOutlinedIcon fontSize="medium" />
          </Button>
        </td>
        <td>
          <Button variant="outlined" onClick={() => deleteThisBrand(brand.id)}>
            <DeleteSweepOutlinedIcon fontSize="medium" />
          </Button>
        </td>
      </tr>
    </>
  );
};

export default Brand;