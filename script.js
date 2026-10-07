document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isActive = navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active", isActive);
      menuToggle.setAttribute("aria-expanded", isActive);
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", false);
      });
    });
  }

  // Sticky Navbar Glass Effect on Scroll
  const header = document.querySelector("header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  const scheduleForm = document.getElementById("scheduleForm");
  const responseMessage = document.getElementById("responseMessage");

  if (scheduleForm) {
    scheduleForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Desactivar el botón para evitar múltiples envíos
      const submitBtn = scheduleForm.querySelector("button");
      submitBtn.disabled = true;
      submitBtn.innerText = "Enviando...";

      // Obtener los datos del formulario
      const formData = new FormData(scheduleForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJy1doBeVHftFwYjBY_Kk36Edi2N-layK2bTzwTH_LchoTCK21xjfTKbawMafdvKYJGQ/exec';
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Agregado para manejar redirecciones de Google Apps Script
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Con no-cors no podemos leer la respuesta, pero si no hay error asumimos éxito
        scheduleForm.reset();
        scheduleForm.style.display = 'none';
        responseMessage.style.display = 'block';
      } catch (error) {
        console.error("Error:", error);
        alert(
          "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo o llámanos directamente.",
        );
        submitBtn.disabled = false;
        submitBtn.innerText = "Confirmar Solicitud";
      }
    });
  }

  // Copiar Correo al Portapapeles
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const copyEmailText = document.getElementById("copyEmailText");
  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.getAttribute("data-email") || "ntrasportes@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailText.innerText;
        copyEmailText.innerText = "¡Copiado!";
        copyEmailBtn.style.borderColor = "var(--accent-orange)";
        setTimeout(() => {
          copyEmailText.innerText = originalText;
          copyEmailBtn.style.borderColor = "";
        }, 2000);
      } catch (err) {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        copyEmailText.innerText = "¡Copiado!";
        setTimeout(() => {
          copyEmailText.innerText = "Copiar Correo";
        }, 2000);
      }
    });
  }
});
