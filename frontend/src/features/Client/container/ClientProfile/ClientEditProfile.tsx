import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks.ts";
import { useParams } from "react-router-dom";
import { selectUser } from "../../../../store/users/usersSlice.ts";
import { fetchUserById } from "../../../../store/users/usersThunk.ts";
import UserFormEdition from "../../../../components/Forms/UserFormEdition/UserFormEdition.tsx";
import ClientBar from "../../../../components/Domain/Client/ClientBar.tsx";
import { Box } from '@mui/material';
import Container from '@mui/material/Container';

const ClientEditProfile = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector(selectUser);

  useEffect(() => {
      if (id && !user) {
          dispatch(fetchUserById(id)).unwrap();
      }
  }, [dispatch, id, user]);

  return (
   <Container maxWidth="xl">
     <Box
       sx={{
         display: 'flex',
         gap: 2,
         mt: 5,
         flexDirection: 'column',
         '@media (min-width: 900px)': {
           flexDirection: 'row',
         },
       }}
     >
       {user && user.role === 'client' && (
         <Box
           sx={{
             width: '100%',
             '@media (min-width: 900px)': {
               width: '30%',
             },
           }}
         >
           <ClientBar />
         </Box>
       )}
       <Box
         sx={{
           width: '100%',
           '@media (min-width: 900px)': {
             width: '68%',
           },
         }}
       >
         <UserFormEdition />
       </Box>
     </Box>
   </Container>
  );
};

export default ClientEditProfile;
