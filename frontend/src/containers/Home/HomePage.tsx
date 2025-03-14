import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { brandsFromSlice } from '../../features/brands/brandsSlice.ts';
import { useEffect } from 'react';
import { getBrands } from '../../features/brands/brandsThunk.ts';

const HomePage = () => {
  const brands = useAppSelector(brandsFromSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  console.log(brands);
  return (
    <>
      главная страница
    </>
  );
};

export default HomePage;