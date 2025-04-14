import { Box } from '@mui/joy';
import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { selectDelivery } from '../../store/deliveryPage/deliveryPageSlice.ts';
import { fetchDeliveryPage } from '../../store/deliveryPage/deliveryPageThunk.ts';

const DeliveryPage = () => {
  const delivery = useAppSelector(selectDelivery);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const clickButtonEdit = () =>{
    if (delivery && delivery.id) {
      navigate(`/delivery/${delivery.id}`);
    }
  }

  useEffect(() => {
    dispatch(fetchDeliveryPage()).unwrap()
  }, [dispatch]);

  return (
    <div>
      <div>
        <div>
          <div>
            <div className="d-flex ">
              <div className="col-3 mt-5 ">
                <ByuerBarTopTollBar />
              </div>
              <div className="col-9">
                <Box
                  sx={{
                    border: "1px solid lightgray",
                    mt: 8,
                    width: "100%",
                    p: 6,
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                  }}
                >
                  {(user && (user.role === "admin" || user.role === "superAdmin")) && (
                    <Box
                      component="button"
                      onClick={clickButtonEdit}
                      sx={{
                        position: "absolute",
                        top: "200px",
                        right: "220px",
                        backgroundColor: "darkgreen",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: "14px",
                        '&:hover': {
                          backgroundColor: "#1565c0"
                        }
                      }}
                    >
                      <EditIcon/>
                    </Box>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <div dangerouslySetInnerHTML={{ __html: delivery?.text || '' }} />
                    <div dangerouslySetInnerHTML={{ __html: delivery?.price || '' }} />
                  </Box>

                  <Box sx={{ width: "480px", height: "480px", flexShrink: 0 }}>
                    <iframe
                      src={delivery?.map}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </Box>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
