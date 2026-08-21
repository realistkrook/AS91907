/* ==========================================================================
   Navigation toggle
   AS91907 Digital Technologies 3.8

   Shows and hides the menu at narrow widths. The button is labelled with a
   word rather than a ☰ glyph, so its text swaps between MENU and CLOSE.

   aria-expanded is kept in sync so screen readers announce the menu state —
   verified in the Milestone 6 accessibility test.
   ========================================================================== */

(function () {
  "use strict";

  var toggle = document.querySelector(".nav__toggle");
  var list = document.querySelector(".nav__list");

  if (!toggle || !list) {
    return; // No collapsible nav on this page.
  }

  function setOpen(open) {
    list.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes the menu and hands focus back to the button, so keyboard
  // users are never stranded inside an open menu.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Clear the mobile open state if the window is widened back to desktop.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) {
      setOpen(false);
    }
  });
})();
