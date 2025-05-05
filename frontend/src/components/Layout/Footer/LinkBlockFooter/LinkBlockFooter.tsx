import { Typography, Box, Stack } from '@mui/material';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import { useAppSelector } from '../../../../app/hooks.ts';
import { selectEditSite } from '../../../../store/editionSite/editionSiteSlice.ts';
import theme from '../../../../globalStyles/globalTheme.ts';
import insta from '../../../../../public/instagram_icon.webp';
import whatsapp from '../../../../../public/whatsapp_icon.webp';

const LinkBlockFooter = () => {
  const site = useAppSelector(selectEditSite);

  return (
    <Box
      component="section"
      aria-label="Контактная информация"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'flex-start',
        width: 'fit-content',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: theme.fonts.weight.medium,
          fontSize: '14px',
          color: theme.colors.rgbaGrey,
          mb: 1,
        }}
      >
        Связаться с нами
      </Typography>

      {site?.email && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <AlternateEmailOutlinedIcon fontSize="small" sx={{ color: theme.colors.white, }} />
          <a
            href={`mailto:${site.email}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.colors.white,
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            {site.email}
          </a>
        </Stack>
      )}

      {site?.phone && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhoneIphoneOutlinedIcon fontSize="small" sx={{ color: theme.colors.white, }}  />
          <a
            href={`tel:${site.phone}`}
            style={{
              color: theme.colors.white,
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            {site.phone}
          </a>
        </Stack>
      )}

      {site?.linkAddress && site?.address && (
        <a
          href={site.linkAddress}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <NearMeOutlinedIcon fontSize="small" sx={{ color: theme.colors.white, }} />
            <Typography
              style={{
                color: theme.colors.white,
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              {site.address}
            </Typography>
          </Stack>
        </a>
      )}

      {(site?.instagram || site?.whatsapp) && (
        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{ color: theme.colors.rgbaGrey, fontSize: '14px', mb: 0.5,  fontWeight: theme.fonts.weight.medium, }}
          >
            Мы в соцсетях:
          </Typography>
          <Stack direction="column" spacing={1}>
            {site?.instagram && (
              <Box
                component="a"
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                }}
              >
                <Box
                  component="img"
                  src={insta}
                  alt="Instagram"
                  sx={{ width: 30, height: 30 }}
                />
                <Typography sx={{ fontSize: '14px',  color: theme.colors.white, }}>
                  Instagram
                </Typography>
              </Box>
            )}
            {site?.whatsapp && (
              <Box
                component="a"
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                }}
              >
                <Box
                  component="img"
                  src={whatsapp}
                  alt="WhatsApp"
                  sx={{ width: 30, height: 30 }}
                />
                <Typography sx={{ fontSize: '14px', color: theme.colors.white, }}>
                  WhatsApp
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default LinkBlockFooter;
