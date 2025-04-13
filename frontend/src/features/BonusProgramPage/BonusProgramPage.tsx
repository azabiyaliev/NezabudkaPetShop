import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { selectBonusProgram } from '../../store/bonusProgramPage/bonusProgramPageSlice.ts';
import { fetchBonusPage } from '../../store/bonusProgramPage/bonusProgramPageThunk.ts';

const BonusProgramPage = () => {
  const bonusProgram = useAppSelector(selectBonusProgram);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const clickButtonEdit = () =>{
    if (bonusProgram && bonusProgram.id) {
      navigate(`/bonus_program/${bonusProgram.id}`);
    }
  }

  useEffect(() => {
    dispatch(fetchBonusPage()).unwrap()
  }, [dispatch]);
  return (
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
                  width: "700px",
                  p: 6,
                  borderRadius: "20px",
                  position: "relative",
                }}
              >
                {(user && (user.role === "admin" || user.role === "superAdmin")) && (
                  <Box
                    component="button"
                    onClick={clickButtonEdit}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
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

                <div dangerouslySetInnerHTML={{ __html: bonusProgram?.text || '' }} />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusProgramPage;