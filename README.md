SnDR
El proyecto Stats and Dice Rolls (SnDR), desarrollado por Benjamín Pérez de Gea, es una plataforma web gratuita diseñada para facilitar partidas de juegos de rol de mesa (TTRPG) en línea. Surge como una alternativa accesible a herramientas comerciales como Roll20, con el objetivo de reducir barreras económicas y técnicas para nuevos jugadores.

Propósito:
Brindar una solución sencilla e intuitiva para gestionar partidas, fichas de personajes, tiradas de dados y comunicación entre jugadores, sin requerir instalaciones complejas. Aunque la versión actual es una demo funcional, sienta las bases para futuras mejoras como sincronización en tiempo real y funcionalidades avanzadas.

Requisitos Previos
Node.js (v16.x o superior recomendado)

npm (normalmente viene con Node.js) o Yarn

MySQL

Servidor Apache

Instalación
Sigue estos pasos para configurar el proyecto localmente:

1. Clonar el Repositorio
bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

2. Instalar dependencias
bash
npm install

3. Configurar base de datos MySQL
Crear la base de datos con nombre SnDR
CREATE DATABSE SnDR;

Crear usuario con todos los permisos (nombre: sndr_user, contraseña: tu_password_seguro) //Puedes modificar esto en src/inc/conn.php
CREATE USER sndr_user IDENTIFIED BY tu_password_seguro;
GRANT ALL PRIVILEGES ON SnDR TO 'sndr_user'@'localhost';

Importar el archivo sndrDB.sql incluido en el proyecto

4. Iniciar la aplicación
bash
npm run dev
