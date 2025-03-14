import { Box, Container } from '@mui/material';
import BrandForm from '../../../components/Brand/BrandForm/BrandForm.tsx';
import AdminBar from '../AdminProfile/AdminBar.tsx';
import { IBrandForm } from '../../../types';

const NewBrand = () => {

  const addNewBrand = (brand: IBrandForm) => {
    console.log(brand);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0'}}>
        <AdminBar/>
        <BrandForm addNewBrand={addNewBrand}/>
      </Box>
    </Container>
  );
};

export default NewBrand;