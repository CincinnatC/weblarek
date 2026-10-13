import { Component } from "../base/Component"
import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/Events"

interface ModalData {
  content: HTMLElement;
}

export class Modal extends Component<ModalData> {
  protected modalElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
    this.modalElement = ensureElement<HTMLElement>(".modal", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
    this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    })
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }
  open() {
    this.modalElement.classList.add('modal_active');
  }
  close() {
    this.modalElement.classList.remove('modal_active');
  }
}