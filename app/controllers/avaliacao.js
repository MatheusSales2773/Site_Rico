const form = document.getElementById('avaliacaoForm');
const textoAvaliacao = document.getElementById('textoAvaliacao');
const editarBtn = document.getElementById('editarBtn');
let avaliacaoEnviada = false;

if (form && textoAvaliacao && editarBtn) {
  form.addEventListener('submit', function (e) {
    if (!avaliacaoEnviada) {
      textoAvaliacao.readOnly = true;
      document.querySelectorAll('.star-rating input').forEach(i => i.disabled = true);
      editarBtn.classList.remove('d-none');
      form.querySelector('button[type="submit"]').innerText = 'Enviado!';
      avaliacaoEnviada = true;
    }
  });

  editarBtn.addEventListener('click', function () {
    textoAvaliacao.readOnly = false;
    document.querySelectorAll('.star-rating input').forEach(i => i.disabled = false);
    editarBtn.classList.add('d-none');
    form.querySelector('button[type="submit"]').innerText = 'Enviar Avaliação';
    avaliacaoEnviada = false;
  });
}
