window.addEventListener('message', function (evt) {
    const color = evt.data == 0 ? 'success' : 'danger';
    const target = document.querySelector('ion-badge');
    target.setAttribute('color', color);
    target.innerHTML = evt.data;
});
