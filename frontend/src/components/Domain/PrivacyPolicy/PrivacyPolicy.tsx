import { Typography, Container } from "@mui/material";
import { FONTS } from "../../../globalStyles/stylesObjects.ts";
import { useEffect } from "react";

const PrivacyPolicy = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography  sx={{
        "@media (max-width: 600px)": {
          fontSize: FONTS.size.xl,
        },
      }} variant="h4" gutterBottom>
        Политика конфиденциальности и использования cookie
      </Typography>

      <Typography variant="h6" mt={4}>1. Обработка персональных данных</Typography>
      <Typography mt={2} fontWeight="bold">1.1. Перечень собираемых данных:</Typography>
      <ul>
        <li>Фамилия, имя, отчество</li>
        <li>Адрес электронной почты (email)</li>
        <li>Номер мобильного телефона</li>
        <li>IP-адрес, информация о браузере и устройстве</li>
        <li>Поведенческая информация (клики, переходы, время на странице и т.д.)</li>
        <li>Иные данные, предоставляемые вами добровольно</li>
      </ul>

      <Typography fontWeight="bold">1.2. Цели обработки:</Typography>
      <ul>
        <li>Регистрация и идентификация пользователя</li>
        <li>Предоставление доступа к функционалу сервиса</li>
        <li>Обратная связь и отправка уведомлений</li>
        <li>Аналитика и улучшение сервиса</li>
        <li>Соблюдение законодательства</li>
        <li>Маркетинговые цели (при наличии согласия)</li>
      </ul>

      <Typography fontWeight="bold">1.3. Правовые основания:</Typography>
      <ul>
        <li>Закон КР "О персональных данных" №58 от 14.04.2008</li>
        <li>Федеральный закон РФ №152-ФЗ</li>
        <li>GDPR (при необходимости)</li>
      </ul>

      <Typography fontWeight="bold">1.4. Срок хранения:</Typography>
      <Typography>
        Персональные данные хранятся до достижения целей обработки или отзыва согласия.
      </Typography>

      <Typography fontWeight="bold">1.5. Отзыв согласия:</Typography>
      <Typography>
        Вы можете отозвать своё согласие, написав нам по контактам ниже.
      </Typography>

      <Typography variant="h6" mt={4}>2. Использование cookie</Typography>

      <Typography fontWeight="bold">2.1. Что такое cookie:</Typography>
      <Typography>
        Cookie — это небольшие файлы, сохраняемые на вашем устройстве при посещении сайта.
      </Typography>

      <Typography fontWeight="bold">2.2. Цели использования cookie:</Typography>
      <ul>
        <li>Упрощение входа и навигации</li>
        <li>Сохранение пользовательских настроек</li>
        <li>Аналитика поведения</li>
        <li>Персонализация контента и рекламы</li>
      </ul>

      <Typography fontWeight="bold">2.3. Управление cookie:</Typography>
      <Typography>
        Вы можете отключить cookie в настройках браузера. Это может повлиять на работу сайта.
      </Typography>

      <Typography variant="h6" mt={4}>3. Передача данных третьим лицам</Typography>
      <ul>
        <li>Платформы хостинга и облачных решений</li>
        <li>Сервисы аналитики (Google Analytics, Yandex и др.)</li>
        <li>Платёжные системы</li>
      </ul>
    </Container>
  );
};

export default PrivacyPolicy;