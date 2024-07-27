//Класс для создания объекта и передачи в функцию POST   //Сделать отдельные вкладки для классов
import { loadVisits } from "./script.js";
export class MyVisit {
    constructor(title, description, doctor, bp, age, weight, urgency, status, pib) {
        this.title = title;
        this.description = description;
        this.doctor = doctor;
        this.bp = bp || 0;
        this.age = age || 0;
        this.weight = weight || 0;
        this.urgency = urgency;
        this.status = status || "Open";
        this.pib = pib;
        this.illness = illness || "";
        this.date = date || 0;
    
    }
}

export class Modal { //Сделать отдельные вкладки для классов
    constructor(modalElement) {
        this.modalElement = modalElement;
        this.closeButton = modalElement.querySelector('.close');
        this.bindEvents();
    }

    bindEvents() {
        this.closeButton.addEventListener('click', () => this.hide());
        window.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.hide();
            }
        });
    }

    show() {
        this.modalElement.style.display = 'flex';
    }

    hide() {
        this.modalElement.style.display = 'none';
        loadVisits();
    }
}