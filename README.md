# Proyecto Web DS6_II

## Introducción

Este proyecto es una aplicación web que permite crear y gestionar un catálogo de productos organizados por categorías. Los usuarios pueden navegar entre diferentes categorías y visualizar los productos correspondientes a cada una.

## Características Principales

- Gestión de catálogo de productos
- Organización por categorías
- Navegación intuitiva entre categorías
- Visualización dinámica de productos por categoría

## Requisitos funcionales

- Una pantalla de entrada para autenticar al usuario.
- Gestión de productos/categorías.
- Base de datos para almacenar la información de productos y categorías.
- Interfaz intuitiva y utilizar vistas como listas, formularios y tablas.
- Seguridad en la autenticación de usuarios.
- Separar roles de administrador y usuario.

## Tecnologías Usadas

- PHP Laravel Filament
- MySQL
- HTML/CSS
- JavaScript

## Arquitectura

- **Modelo-Vista-Controlador (MVC)**: La aplicación sigue el patrón MVC, donde la lógica de negocio está separada de la presentación.
- **Base de Datos**: Utiliza MySQL para almacenar la información de productos y categorías.
- **Frontend**: HTML y CSS para la estructura y el diseño de la interfaz de usuario.
- **Backend**: PHP Laravel para la lógica del servidor y la gestión de la base de datos.

## Patrón de Diseño

- **Abstract Factory**: Se utiliza para crear objetos de diferentes tipos de productos y categorías sin especificar la clase exacta.

## Guía de las Carpetas

- **assets/**: Contiene recursos estáticos como imágenes, archivos CSS, JavaScript, fuentes y otros elementos multimedia utilizados en la interfaz de usuario.
- **class/**: Incluye las clases PHP principales del sistema, como modelos de datos, clases de negocio y entidades del dominio.
- **components/**: Almacena componentes reutilizables de la interfaz de usuario, como elementos de formulario, botones, modales y widgets personalizados.
- **config/**: Contiene archivos de configuración del sistema, incluyendo configuraciones de base de datos, parámetros de la aplicación y variables de entorno.
- **modules/**: Organiza la funcionalidad en módulos específicos como gestión de productos, categorías, autenticación y administración de usuarios.
- **public/**: Directorio público accesible desde el navegador, contiene el punto de entrada de la aplicación (index.php) y recursos públicos compilados.
- **controllers/**: Contiene los controladores que manejan las peticiones HTTP y coordinan la interacción entre modelos y vistas.

## Estructura del Proyecto

```
DS6_II/Web/
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   ├── admin.css
│   │   └── components.css
│   ├── js/
│   │   ├── main.js
│   │   ├── product-manager.js
│   │   └── category-manager.js
│   ├── images/
│   │   ├── logo.png
│   │   ├── products/
│   │   └── icons/
│   └── fonts/
├── class/
│   ├── Product.php
│   ├── Category.php
│   ├── User.php
│   ├── Database.php
│   └── ProductFactory.php
├── components/
│   ├── navbar.php
│   ├── sidebar.php
│   ├── product-card.php
│   ├── category-list.php
│   ├── modal.php
│   └── form-elements/
│       ├── input.php
│       ├── select.php
│       └── button.php
├── config/
│   ├── database.php
│   ├── app.php
│   ├── auth.php
│   └── constants.php
├── modules/
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── register.php
│   ├── products/
│   │   ├── list.php
│   │   ├── create.php
│   │   ├── edit.php
│   │   └── delete.php
│   ├── categories/
│   │   ├── list.php
│   │   ├── create.php
│   │   ├── edit.php
│   │   └── delete.php
│   └── admin/
│       ├── dashboard.php
│       ├── users.php
│       └── reports.php
├── public/
│   ├── index.php
│   ├── admin.php
│   ├── api/
│   │   ├── products.php
│   │   └── categories.php
│   └── uploads/
│       └── products/
└──  controllers/
    ├── ProductController.php
    ├── CategoryController.php
    ├── AuthController.php
    ├── AdminController.php
    └── BaseController.php

```
