# Stage 1: Build React App
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Apache
FROM httpd:2.4-alpine

# Enable mod_rewrite
RUN sed -i 's/^#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf

# Create .htaccess file
RUN echo -e "RewriteEngine On\nRewriteBase /\nRewriteRule ^index\.html$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.html [L]" > /usr/local/apache2/htdocs/.htaccess

# Copy build files
COPY --from=build /app/dist /usr/local/apache2/htdocs

# Update Apache configuration to allow .htaccess
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]