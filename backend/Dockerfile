FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev libxml2-dev libsqlite3-dev default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip mbstring xml bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .
RUN composer install --no-interaction --optimize-autoloader

EXPOSE 8000