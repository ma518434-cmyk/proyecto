'use strict';

const USUARIOS = { 123456: '123456' };

function intentarLogin() {
    const user = document.getElementById('inp-user').value.trim();
    const pass = document.getElementById('inp-pass').value;
    const err  = document.getElementById('login-error');

    if (USUARIOS[user] && USUARIOS[user] === pass) {
        err.classList.remove('visible');
        /* Guardar usuario en sessionStorage y redirigir al mapa */
        sessionStorage.setItem('mapUser', user);
        window.location.href = 'index.html';
    } else {
        err.classList.add('visible');
        document.getElementById('inp-pass').value = '';
        document.getElementById('inp-pass').focus();
    }
}

document.getElementById('btn-login').addEventListener('click', intentarLogin);
document.getElementById('inp-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') intentarLogin();
});
document.getElementById('inp-user').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('inp-pass').focus();
});