# Live Russia Assistant

Мобильное Expo-приложение для помощников Live Russia: команды, цены, регламенты, аккаунты и Premium-доступ.

## Загрузка в GitHub

1. Распакуйте архив и загрузите **содержимое** в корень репозитория, рядом с этим `README.md`.
2. В GitHub откройте `Settings → Secrets and variables → Actions`.
3. Создайте следующие Repository secrets:

| Secret | Значение |
|---|---|
| `EXPO_PUBLIC_DOMAIN` | Публичный домен API без `https://`, например `api.example.com` |
| `ANDROID_KEYSTORE_BASE64` | Base64-содержимое release keystore |
| `ANDROID_KEY_ALIAS` | Alias ключа из keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Пароль keystore |
| `ANDROID_KEY_PASSWORD` | Пароль ключа |

Не добавляйте secrets в файлы проекта и не отправляйте их в чат.

## Создание Android keystore

На компьютере с установленным JDK выполните:

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore live-russia-release.keystore \
  -alias live-russia \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Затем получите Base64:

```bash
base64 -w 0 live-russia-release.keystore
```

Результат вставьте в `ANDROID_KEYSTORE_BASE64`. Сам keystore храните в безопасном месте: он понадобится для всех будущих обновлений приложения.

## Сборка APK

Для первой проверки не нужен keystore:

1. Откройте `Actions → Android Release APK → Run workflow`.
2. В поле `APK type to build` выберите `debug`.
3. Укажите `EXPO_PUBLIC_DOMAIN` и запустите workflow.
4. Скачайте artifact `live-russia-assistant-debug-apk`.

Debug APK подходит для установки на телефон и проверки приложения. Для публикации и обновлений используйте подписанный release APK:

1. Сначала создайте keystore и добавьте все пять secrets из таблицы выше.
2. В `Actions → Android Release APK → Run workflow` выберите `release`.
3. Скачайте artifact `live-russia-assistant-release-apk`.

Внутри artifact будет подписанный файл `app-release.apk`.

## API

Для работы установленного APK нужен постоянно доступный публичный API-домен. Dev-домен Replit работает только пока запущен dev-сервер. Перед сборкой укажите в `EXPO_PUBLIC_DOMAIN` домен опубликованного API или другого постоянного backend-сервера.