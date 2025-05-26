import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Paper
} from "@mui/material";
import { COLORS, FONTS, SPACING } from "../../globalStyles/stylesObjects.ts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ConsentAgreementFull = (
  { onConfirm, back }: { onConfirm: (e: React.FormEvent) => void, back: () => void },) => {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box
      component="form"
      onSubmit={onConfirm}
      sx={{
        padding: SPACING.lg,
        "@media (max-width: 600px)": {
          padding: SPACING.xs,
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: SPACING.lg,
          maxWidth: 900,
          margin: `${SPACING.main_spacing} auto`,
          overflowY: "auto",
          height: "500px",
        }}
      >
        <Button
          sx={{
            color: COLORS.DARK_GREEN,
            display: "block",
            marginLeft: "auto",
            marginBottom: SPACING.xs,
          }}
          onClick={back}
        >
          <ArrowBackIcon />
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            "@media (max-width: 600px)": {
              fontSize: FONTS.size.xl,
            },
            "@media (max-width: 400px)": {
              fontSize: FONTS.size.lg,
            },
          }}
        >
          Согласие на обработку персональных данных и использование cookie
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            sx={{
              "@media (max-width: 400px)": {
                fontSize: FONTS.size.big_default,
              },
            }}
          >
            1. Обработка персональных данных
          </Typography>

          <Typography sx={{ mt: 1 }} fontWeight="bold">
            1.1. Перечень собираемых данных:
          </Typography>
          <ul>
            <li>Фамилия, имя, отчество</li>
            <li>Адрес электронной почты (email)</li>
            <li>Номер мобильного телефона</li>
            <li>IP-адрес, информация о браузере и устройстве</li>
            <li>
              Поведенческая информация (клики, переходы, время на странице и
              т.д.)
            </li>
            <li>Иные данные, предоставляемые мной добровольно</li>
          </ul>

          <Typography fontWeight="bold">1.2. Цели обработки:</Typography>
          <ul>
            <li>Регистрация и идентификация пользователя на сайте</li>
            <li>Обеспечение доступа к персонализированным функциям сервиса</li>
            <li>Осуществление связи с пользователем</li>
            <li>Отправка уведомлений (email, SMS, push)</li>
            <li>Повышение качества обслуживания</li>
            <li>Соблюдение законодательства</li>
            <li>Маркетинговые и аналитические цели (при наличии согласия)</li>
          </ul>

          <Typography fontWeight="bold">1.3. Правовые основания:</Typography>
          <Typography paragraph>
            Обработка осуществляется на основании добровольного согласия
            субъекта персональных данных в соответствии с:
          </Typography>
          <ul>
            <li>Законом КР «О персональных данных» (№58 от 14.04.2008)</li>
            <li>Федеральным законом РФ №152-ФЗ «О персональных данных»</li>
            <li>
              Общим регламентом ЕС по защите данных (GDPR) — при необходимости
            </li>
          </ul>

          <Typography fontWeight="bold">1.4. Способы обработки:</Typography>
          <Typography paragraph>
            Сбор, запись, систематизация, хранение, уточнение (обновление,
            изменение), извлечение, использование, передача (в том числе
            трансграничная), обезличивание, блокирование, удаление, уничтожение.
          </Typography>

          <Typography fontWeight="bold">1.5. Срок хранения:</Typography>
          <Typography paragraph>
            Данные хранятся до момента отзыва согласия или достижения целей
            обработки.
          </Typography>

          <Typography fontWeight="bold">1.6. Отзыв согласия:</Typography>
          <Typography>
            Вы имеете право отозвать своё согласие в любой момент, направив
            письменное уведомление по контактным данным, указанным в разделе
            "Контакты".
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              "@media (max-width: 400px)": {
                fontSize: FONTS.size.big_default,
              },
            }}
          >
            2. Использование файлов cookie
          </Typography>

          <Typography fontWeight="bold">2.1. Что такое cookie:</Typography>
          <Typography paragraph>
            Файлы cookie — это небольшие текстовые файлы, сохраняемые на вашем
            устройстве при посещении сайта. Они не наносят вреда и не содержат
            вирусов.
          </Typography>

          <Typography fontWeight="bold">2.2. Цели использования:</Typography>
          <ul>
            <li>Упрощение навигации и входа в систему</li>
            <li>Сохранение пользовательских предпочтений</li>
            <li>Персонализация контента</li>
            <li>Анализ поведения пользователей на сайте</li>
            <li>Поддержка безопасности и предотвращение мошенничества</li>
            <li>
              Проведение маркетинговых и рекламных кампаний (например, через
              Google Analytics, Meta Pixel и др.)
            </li>
          </ul>

          <Typography fontWeight="bold">2.3. Управление cookie:</Typography>
          <Typography paragraph>
            Вы можете отключить сохранение cookie в настройках браузера, однако
            это может повлиять на работоспособность некоторых функций сайта.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              "@media (max-width: 400px)": {
                fontSize: FONTS.size.big_default,
              },
            }}
          >
            3. Передача данных третьим лицам
          </Typography>
          <Typography paragraph>
            Мои данные могут быть переданы следующим третьим лицам:
          </Typography>
          <ul>
            <li>
              Хостинг-провайдерам, поставщикам серверных и облачных решений
            </li>
            <li>Сервисам аналитики и маркетинга (Google, Yandex и др.)</li>
            <li>Платёжным системам (в случае покупок на сайте)</li>
            <li>
              Только при условии соблюдения конфиденциальности и на основании
              договора/закона
            </li>
          </ul>

          <Typography
            variant="h6"
            sx={{
              mt: 3,
              "@media (max-width: 400px)": {
                fontSize: FONTS.size.big_default,
              },
            }}
          >
            4. Права субъекта персональных данных
          </Typography>
          <ul>
            <li>Получать информацию о целях и способах обработки</li>
            <li>Требовать уточнения, блокирования или удаления моих данных</li>
            <li>
              Отказаться от обработки, кроме случаев, предусмотренных законом
            </li>
            <li>
              Подать жалобу в уполномоченные органы по защите прав субъектов
              данных
            </li>
          </ul>

          <FormControlLabel
            sx={{ mt: 3 }}
            control={
              <Checkbox
                checked={agreed}
                sx={{
                  color: COLORS.DARK_GREEN,
                  "&.Mui-checked": {
                    color: COLORS.DARK_GREEN,
                  },
                }}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            }
            label="Я подтверждаю, что внимательно ознакомился с условиями выше и выражаю своё согласие на обработку моих персональных данных и использование cookie."
          />

          <Box mt={3}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: COLORS.DARK_GREEN,
              }}
              disabled={!agreed}
            >
              Подтвердить и продолжить
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConsentAgreementFull;
