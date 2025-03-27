import { IBrand } from '../../../../../types';
import React from 'react';
import { apiUrl } from '../../../../../globalConstants.ts';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { Button } from '@mui/material';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks.ts';
import { selectUser } from '../../../../../store/users/usersSlice.ts';
import { brandeDelete, getBrands } from '../../../../../store/brands/brandsThunk.ts';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import noImage from '../../../../../assets/no-image.jpg';

interface Props {
  brand: IBrand;
  index: number;
}

const Brand:React.FC<Props> = ({brand, index}) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let sanitizedDescription = '';
  let brandImage = noImage;

  if (brand.logo) {
    brandImage = apiUrl + brand.logo;
  }

  if (brand.description !== null) {
    sanitizedDescription = DOMPurify.sanitize(brand.description);
  }

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
          <img
            src={brandImage}
            alt={brand.title}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
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
        <td>
          <div
            style={{
              height: '10%',
              width: '10%',
              border: '1px solid #ccc',
              padding: '10px',
            }}
            dangerouslySetInnerHTML={{__html: sanitizedDescription}}
          />
        </td>
      </tr>
    </>
  );
};

export default Brand;