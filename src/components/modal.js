import * as bootstrap from "bootstrap";

export default class Modal {
  static set = (modalId) => {
    const element = document.querySelector(modalId);

    return {
      element: element,
      dialog: new bootstrap.Modal(element),
    };
  };

  static onShow = (element, fn) =>
    element.addEventListener("show.bs.modal", fn);

  static onShown = (element, fn) =>
    element.addEventListener("shown.bs.modal", fn);

  static onHide = (element, fn) =>
    element.addEventListener("hide.bs.modal", fn);

  static onHidden = (element, fn) =>
    element.addEventListener("hidden.bs.modal", fn);
}
