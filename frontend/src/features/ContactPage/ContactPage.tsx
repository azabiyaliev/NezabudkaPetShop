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
            width: "100%",
            maxWidth: "1000px",
            p: 4,
            borderRadius: "20px",
            position: "relative",
            display: "flex",
            gap: 4,
            justifyContent: "space-between",
              backgroundColor: '#fafafa',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <h4 style={{ marginBottom: '12px' }}>
              Контакты магазина <strong>Незабудка</strong>:
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'max-content 1fr',
                rowGap: '12px',
                columnGap: '12px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
              }}
            >
              <span>📍 <strong>Адрес:</strong></span>
              <span>{site?.address}</span>

              <span>✉️ <strong>Почта:</strong></span>
              <a
                href={`mailto:${site?.email}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black", textDecoration: "none" }}
              >
                {site?.email}
              </a>

              <span>📞 <strong>Телефон:</strong></span>
              <a
                href={`tel:${site?.phone}`}
                style={{ color: "black", textDecoration: "none" }}
              >
                {site?.phone}
              </a>

              <span>⏰ <strong>График:</strong></span>
              <span>{site?.schedule}</span>
            </div>
            {site?.linkAddress && (
              <a
                href={site.linkAddress}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: '20px',
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#2b7bb9',
                  color: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Открыть в 2ГИС
              </a>
            )}
          </Box>

          <Box
            sx={{
              width: "480px",
              height: "480px",
              overflow: "hidden",
              borderRadius: "12px",
              boxShadow: 2,
              position: "relative",
            }}
          >
            <iframe
              src={site?.mapGoogleLink}
              width="600px"
              height="600px"
              style={{
                position: "absolute",
                top: "-60px",
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Box>

      </div>
    </div>
  );
};

export default ContactPage;