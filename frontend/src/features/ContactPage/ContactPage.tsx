import ByuerBarTopTollBar from '../../components/UI/ByuerBarTopTollBar/ByuerBarTopTollBar.tsx';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectEditSite } from '../../store/editionSite/editionSiteSlice.ts';
import { useEffect } from 'react';
import { fetchSite } from '../../store/editionSite/editionSiteThunk.ts';


const ContactPage = () => {
  const site = useAppSelector(selectEditSite)
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchSite());
  }, [dispatch]);

  return (
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
          <div style={{ padding: '16px'}}>
            <h4 style={{ marginBottom: '12px' }}>Контакты магазина <strong>Незабудка</strong>:</h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'max-content 1fr',
              rowGap: '12px',
              columnGap: '12px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
            }}>
              <span>📍 <strong>Адрес:</strong></span>
              <span>{site?.address}</span>

              <span>✉️ <strong>Почта:</strong></span>
              <a href={`https://mail.google.com/mail/?view=cm&to=:${site?.email}`}
                 className="text-blue-600 hover:underline"
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{ color: "black", textDecoration: "none" }}
              >
                {site?.email}
              </a>

              <span>📞 <strong>Телефон:</strong></span>
              <a href={`tel:${site?.phone}`} className="text-blue-600 hover:underline"  style={{ color: "black", textDecoration: "none" }}>
                {site?.phone}
              </a>

              <span>⏰ <strong>График:</strong></span>
              <span>{site?.schedule}</span>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ContactPage;