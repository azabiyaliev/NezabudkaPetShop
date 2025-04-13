import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectCompany } from '../../store/companyPage/compantPageSlice.ts';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { fetchCompanyPage } from '../../store/companyPage/companyPageThunk.ts';
import { selectUser } from '../../store/users/usersSlice.ts';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const CompanyPage = () => {
  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const clickButtonEdit = () =>{
    if (company && company.id) {
      navigate(`/my_company/${company.id}`);
    }
  }

  useEffect(() => {
    dispatch(fetchCompanyPage()).unwrap()
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

                <div dangerouslySetInnerHTML={{ __html: company?.text || '' }} />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;