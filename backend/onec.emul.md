# 📦 Эмулятор запросов 1С

Этот документ описывает, как вручную протестировать работу интеграционного эндпоинта `/api/integration/1c-import`, без подключения реальной системы 1С.

---

## 📍 Эндпоинт

**URL:**  
`POST http://localhost:3000/api/integration/1c-import`

**Требуемые заголовки:**
- `Content-Type: application/json`
- `x-api-key: ваш_секретный_ключ` (тот, что указан в `.env` файле проекта)

---

## 📤 Пример запроса на импорт

```json
{
  "brands": [
    {
      "title": "Purina",
      "logo": "https://example.com/logo.png",
      "description": "Лучший бренд кормов"
    }
  ],
  "categories": [
    {
      "title": "Корма для кошек"
    }
  ],
  "products": [
    {
      "productName": "Корм для кошек Purina",
      "productPhoto": "https://example.com/photo.png",
      "productPrice": 660,
      "productDescription": "Вкусный корм для кошек и",
      "brandTitle": "Purina",
      "categoryTitle": "Корма для кошек",
      "promoPercentage": null,
      "promoPrice": null
    }
  ]
}

```
## 📥 Ответ при успешном импорте



```
{
  "message": "Данные успешно импортированы",
  "result": {
    "success": true,
    "createdProductsCount": 1,
    "skippedProductsCount": 0,
    "skippedProductsNames": []
  }
}
```

## 📥 Ответ при повторной загрузке тех же товаров
```
{
  "message": "Данные успешно импортированы",
  "result": {
    "success": true,
    "createdProductsCount": 0,
    "updatedProductsCount": 1,
    "updatedProductsNames": [
      {
        "productName": "Корм для кошек Purina",
        "updatedFields": {
          "productPrice": {
            "old": 1200,
            "new": 1350
          },
          "sales": {
            "old": false,
            "new": true
          }
        }
      }
    ],
    "skippedProductsCount": 0,
    "skippedProductsNames": []
  }
}
```
## 📥 Пример обновления товара со скидкой

```json
{
  "brands": [{"title": "Purina"}],
  "categories": [{"title": "Корма для кошек"}],
  "products": [
    {
      "productName": "Корм для кошек Purina",
      "productPhoto": "https://example.com/photo-updated.png",
      "productPrice": 1350,
      "productDescription": "Обновленное описание корма",
      "brandTitle": "Purina",
      "categoryTitle": "Корма для кошек",
      "existence": true,
      "sales": true,
      "promoPercentage": 10,
      "promoPrice": 1200
    }
  ]
}

```



##  🧪 Использование моков для тестирования больших объёмов данных

Как сгенерировать тестовые данные
Выполнить скрипт для генерации мока:


В терминале прописать node generate-1c-mock.js
Это создаст файл 1c-mock-data.json в корне проекта.

## ✅ Как отправить сгенерированный мок через Postman
Открыть Postman

Создать новый запрос POST

Указать URL: http://localhost:8000/api/integration/1c-import

## ✅ Как отправить через curl

```
curl -X POST http://localhost:3000/api/integration/1c-import \
-H "Content-Type: application/json" \
-H "x-api-key: ваш_секретный_ключ" \
--data-binary @1c-mock-data.json
```

В Headers добавить:

Content-Type: application/json

x-api-key: ваш_секретный_ключ

В Body выбрать raw, затем JSON,
и вставить содержимое файла 1c-mock-data.json

Отправить запрос ✅

## 🧪 Быстрая отправка через curl

Если хочешь быстро протестировать импорт без Postman — можно использовать обычную команду в терминале:

### ✅ Отправить небольшой тестовый запрос:

```bash
curl -X POST http://localhost:8000/api/integration/1c-import \
-H "Content-Type: application/json" \
-H "x-api-key: ваш_секретный_ключ" \
-d '{
  "brands": [
    {
      "title": "Purina",
      "logo": "https://example.com/logo.png",
      "description": "Лучший бренд кормов"
    }
  ],
  "categories": [
    {
      "title": "Корма для кошек"
    }
  ],
  "products": [
    {
      "productName": "Корм для кошек Purina",
      "productPhoto": "https://example.com/photo.png",
      "productPrice": 660,
      "productDescription": "Вкусный корм для кошек",
      "brandTitle": "Purina",
      "categoryTitle": "Корма для кошек",
      "promoPercentage": null,
      "promoPrice": 134
    }
  ]
}'
```

## 📚 Важные заметки
Если не передать правильный x-api-key → будет 404 Not Found.

Все запросы логируются в таблице integration_logs.

При ошибках — ошибки сохраняются в логи.

При изменении данных товара (например, цены, описания, акции) система автоматически обновляет товар и сохраняет историю изменений в таблице product_update_history.
