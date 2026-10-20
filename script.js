(() => {
  function iniciarJogo() {
    const form = document.querySelector("#game");
    const input = document.querySelector("#guess");
    const message = document.querySelector("#message");
    const restart = document.querySelector("#restart");

    if (!form || !input || !message || !restart) return;

    let secret = Math.floor(Math.random() * 10) + 1;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const guess = Number(input.value);

      if (!Number.isInteger(guess) || guess < 1 || guess > 10) {
        message.textContent = "Digite um número inteiro de 1 a 10.";
        return;
      }

      if (guess === secret) {
        message.textContent = `Acertou! O número era ${secret}.`;
        form.hidden = true;
        restart.hidden = false;
      } else {
        message.textContent = guess < secret
          ? "Tente um número maior."
          : "Tente um número menor.";
        input.value = "";
        input.focus();
      }
    });

    restart.addEventListener("click", () => {
      secret = Math.floor(Math.random() * 10) + 1;
      message.textContent = "Digite seu palpite.";
      input.value = "";
      form.hidden = false;
      restart.hidden = true;
      input.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarJogo);
  } else {
    iniciarJogo();
  }
})();