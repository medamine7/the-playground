FROM php:8.1

RUN apt-get clean && apt-get update -y && apt-get install -y openssl zip unzip git libssl-dev

RUN pecl install mongodb && docker-php-ext-enable mongodb && pecl install xdebug && docker-php-ext-enable xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /app

COPY . .

RUN composer install
RUN composer update --no-scripts

EXPOSE 8000
CMD php artisan serve --host=0.0.0.0
