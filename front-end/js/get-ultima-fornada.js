function getUltimaFornada(button) {
  const xhr = new XMLHttpRequest();
  const url = "http://localhost:8080/fornada/" + button.id;
  xhr.open("get", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      openModal(JSON.parse(xhr.responseText));
    } else if (xhr.readyState === 4) {
      alert("Erro ao recuperar a última fornada.");
    }
  };
  xhr.send();
}

function openModal(ultimaFornada) {
  const closeButton = document.createElement("button");
  closeButton.setAttribute("onclick", "closeModal()");
  closeButton.textContent = "Fechar";

  const modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  modal.appendChild(createDiv(ultimaFornada));
  modal.appendChild(closeButton);
  document.querySelector("body").appendChild(modal);

  addCountdownTimer();
}

function createDiv(fornada) {
  const header = document.createElement("h2");
  header.textContent = fornada.pao.tipo;

  const spanTempoInicio = document.createElement("span");
  spanTempoInicio.textContent = `Início: ${dateToTime(fornada.tempoInicio)}`;

  const spanTempoFim = document.createElement("span");
  spanTempoFim.textContent = `Fim: ${dateToTime(fornada.tempoFim)}`;

  const spanCountdownTimer = document.createElement("span");
  spanCountdownTimer.setAttribute("id", "countdownTimer");
  spanCountdownTimer.setAttribute("data-tempoFim", `${fornada.tempoFim}`);

  const div = document.createElement("div");
  div.setAttribute("class", "fornada");
  div.appendChild(header);
  div.appendChild(spanTempoInicio);
  div.appendChild(spanTempoFim);
  div.appendChild(spanCountdownTimer);

  return div;
}

function dateToTime(dateMilliseconds) {
  const date = new Date(dateMilliseconds);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function closeModal() {
  document.getElementById("modal").remove();
}

function addCountdownTimer() {
  const countdownTimer = setInterval(function() {
    const span = document.getElementById("countdownTimer");
    const tempoFinal = parseInt(span.getAttribute("data-tempoFim"), 10);
    const tempoAtual = new Date().getTime();
    const tempoRestante = tempoFinal - tempoAtual;

    const dias = Math.floor(tempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
    const minutos = Math.floor(tempoRestante / (1000 * 60));
    const segundos = Math.floor(tempoRestante / 1000);

    const d = dias;
    const h = horas - dias * 24;
    const m = minutos - horas * 60;
    const s = segundos - minutos * 60;

    span.textContent = `${format(m)}:${format(s)}`;

    if (tempoRestante < 0) {
      span.textContent = "Pronta!";
      span.style.color = "#556b2f";
      clearInterval(countdownTimer);
    }
  }, 1000);

  function format(time) {
    return (time >= 10) ? `${time}` : `0${time}`;
  }
}
