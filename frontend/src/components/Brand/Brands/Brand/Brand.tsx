import { IBrand } from '../../../../types';
import React from 'react';
import { apiUrl } from '../../../../globalConstants.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '@mui/material';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../features/users/usersSlice.ts';
import { brandeDelete, getBrands } from '../../../../features/brands/brandsThunk.ts';
import { toast } from 'react-toastify';

interface Props {
  brand: IBrand;
  index: number;
}

const Brand:React.FC<Props> = ({brand, index}) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const deleteThisBrand = async (id: number) => {
    if (user && user.role === 'admin') {
      await dispatch(brandeDelete({brandId: id, token: user.token})).unwrap();
      toast.success('Бренд успешно удален!');
      await dispatch(getBrands()).unwrap();
    }
  }

  return (
    <>
      <tr>
        <td style={{
          fontSize: '15px'
        }}>
          {index + 1}
        </td>
        <td>
          <img src={apiUrl + brand.logo} alt={brand.title}
               style={{
                 width: '90px',
                 height: '60px',
                 margin: '10px 0'
               }}/>
        </td>
        <td style={{
          fontSize: '18px'
        }}>
          {brand.title}
        </td>
        <td style={{
          textAlign: 'center'
        }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/private/edit_brand/${brand.id}`)}
          >
            <EditNoteOutlinedIcon fontSize='medium'/>
          </Button>
        </td>
        <td>
          <Button
            variant="outlined"
            onClick={() => deleteThisBrand(brand.id)}
          >
            <DeleteSweepOutlinedIcon fontSize='medium'/>
          </Button>
        </td>
      </tr>
    </>
  );
};

export default Brand;