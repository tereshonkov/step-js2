import { postVisits, get, fetchDelete, fetchPut } from "./ajax.js";
import { MyVisit, Modal } from "./class.js";
import { filteredFunc } from "./filters.js";
import { myEmail, myPassword, appointmentForm, modal, authButton, authForm, visitForm, visitsContainer, form, doctorTypeSelect, API_URL } from "./const.js";




// Ховаємо всі поля спочатку через style.css

// Додаємо обробник подій для зміни вибраного лікаря
doctorTypeSelect.addEventListener('change', () => {
    const selectedDoctor = doctorTypeSelect.value;

    const bp = document.getElementById("bp");
    const age = document.getElementById("age");
    const weight = document.getElementById("weight");
    const illness = document.getElementById("illness");
    const date = document.getElementById("date");

    
    // Відображаємо поля в залежності від вибраного лікаря
    if (selectedDoctor === 'cardiologist') {

        bp.style.display = "block";
        age.style.display = "block";
        illness.style.display = "block";
        weight.style.display = "block";

    } else if (selectedDoctor === 'dentist') {

        bp.style.display = "none";
        age.style.display = "none";
        weight.style.display = "none";
        illness.style.display = "none";
        date.style.display = "block";

    } else if (selectedDoctor === 'therapist') {

        bp.style.display = "none";
        weight.style.display = "none";
        illness.style.display = "none";
        date.style.display = "none";
        age.style.display = "block";

    }
});


appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  
  const title = document.getElementById("title").value;
  const pib = document.getElementById("pib").value;
  const description = document.getElementById("description").value;
  const doctor = document.getElementById("doctor").value;
  const bp = document.getElementById("bp").value;
  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;
  const urgency = document.getElementById("urgency").value;
  const status = document.getElementById("status").value;
  const illness = document.getElementById("illness").value;
  const date = document.getElementById("date").value;


  if (title && description && doctor && urgency && status && pib) {
    const appointment = new MyVisit (title, description, doctor, bp, age, weight, urgency, status, pib, illness, date );
    postVisits(appointment);
    loadVisits();
    
    appointmentForm.reset();
  } else {
    alert("Please fill in all fields");
    appointmentForm.reset();
  }
});



authButton.addEventListener('click', () => {
    modal.show();
    authForm.style.display = 'flex';
    visitForm.style.display = 'none';
});

authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        if (email === myEmail && password === myPassword) {
        authButton.innerText = 'Створити візит';
        authButton.addEventListener('click', () => {
            modal.show();
            authForm.style.display = 'none';
            visitForm.style.display = 'flex';
        });

        modal.hide();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('Authentication failed, please check your email and password.');
    } 
});

//filtered form
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputDescription = document.getElementById("searchTitle").value.toLowerCase();
    const select = document.getElementById("searchStatus").value.toLowerCase();
    const selectUrgency = document.getElementById("searchUrgency").value.toLowerCase();

    const array = await get();

    if (inputDescription || select || selectUrgency ) {
            const filteredAll = filteredFunc(array, inputDescription, select, selectUrgency);
            if (!filteredAll) {
                form.reset();
                return;
            }
            form.reset();
            return displayVisits(filteredAll);
    } else {
            console.log("Нужно выбрать хоть один параметр фильтрации");
    }
})

// Drag and Drop
visitsContainer.addEventListener(`dragstart`, (event) => {
    event.dataTransfer.setData(`text/plain`, event.target.id)
})

visitsContainer.addEventListener(`dragover`, (event) => {
    event.preventDefault();
})

visitsContainer.addEventListener(`drop`, (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData(`text/plain`);
    const draggable = document.getElementById(data);
    const droppable = event.target;

    visitsContainer.insertBefore(draggable,droppable);
})


// Функція для відображення візитів
function displayVisits(visits) {
    visitsContainer.innerHTML = '';
    visits.forEach(visitData => {
        const visitCard = document.createElement('div');
        visitCard.classList.add('visit-card');
        visitCard.setAttribute(`draggable`, `true`);

        visitCard.id = visitData.id;

        const doctor = document.createElement('h2');
        doctor.textContent = `Лікар: ${visitData.doctor.toUpperCase()}`;
        visitCard.appendChild(doctor);

        const fullName = document.createElement('p');
        fullName.textContent = `ПІБ: ${visitData.pib}`;
        visitCard.appendChild(fullName);

        const btnMore = document.createElement("button");
        btnMore.textContent = "Показати більше ▼";
        btnMore.classList.add("btn-more");
        visitCard.append(btnMore);

        btnMore.addEventListener("click", () => {
            btnMore.style.display = "none";

            const title = document.createElement('h3');
            title.textContent = visitData.title;
            visitCard.appendChild(title);
    
            const description = document.createElement('p');
            description.textContent = visitData.description;
            visitCard.appendChild(description);
    
            const urgency = document.createElement('p');
            urgency.textContent = `Терміновість: ${visitData.urgency}`;
            visitCard.appendChild(urgency);
    
    
            // Додаємо специфічні поля для кожного типу лікаря
            if (visitData.doctor === 'cardiologist') {
                const pressure = document.createElement('p');
                pressure.textContent = `Тиск: ${visitData.bp}`;
                visitCard.appendChild(pressure);
    
                const age = document.createElement('p');
                age.textContent = `Вік: ${visitData.age}`;
                visitCard.appendChild(age);
    
                const weight = document.createElement('p');
                weight.textContent = `Вага: ${visitData.weight}`;
                visitCard.appendChild(weight);
            } else if (visitData.doctor === 'dentist') {
                const lastVisitDate = document.createElement('p');
                lastVisitDate.textContent = `Дата останнього відвідування: ${visitData.date}`;
                visitCard.appendChild(lastVisitDate);
            } else if (visitData.doctor === 'therapist') {
                const age = document.createElement('p');
                age.textContent = `Вік: ${visitData.age}`;
                visitCard.appendChild(age);
            }
        })

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "✍";
        btnEdit.classList.add("btn-edit");
        visitCard.append(btnEdit);

        btnEdit.addEventListener("click", () => {
            btnEdit.textContent = "";
            const editWrapper = document.getElementById("edit-wrapper-form");
            editWrapper.style.display = "block";
            visitCard.append(editWrapper);

            const editForm = document.getElementById("edit-form");

            const titleEdit = document.getElementById("title-edit");
            titleEdit.value = visitData.title;

            const descriptionEdit = document.getElementById("description-edit");
            descriptionEdit.value = visitData.description;

            const pibEdit = document.getElementById("pib-edit");
            pibEdit.value = visitData.pib;

            const urgencyEdit = document.getElementById("urgency-edit").value;

            const doctorEdit = document.getElementById("doctor-edit");

            const statusEdit = document.getElementById("status-edit").value;

            const illnessEdit = document.getElementById("illness-edit");
            illnessEdit.value = visitData.illness;

            const dateEdit = document.getElementById("date-edit");
            dateEdit.value = visitData.date;

            const bpEdit = document.getElementById("bp-edit");
            bpEdit.value = visitData.bp;

            const ageEdit = document.getElementById("age-edit");
            ageEdit.value = visitData.age;

            const weightEdit = document.getElementById("weight-edit");
            weightEdit.value = visitData.weight;

            doctorEdit.addEventListener("change", () => {
                const selectedDoctor = doctorEdit.value;
            
                
                // Відображаємо поля в залежності від вибраного лікаря
                if (selectedDoctor === 'cardiologist') {
            
                    bpEdit.style.display = "block";
                    ageEdit.style.display = "block";
                    illnessEdit.style.display = "block";
                    weightEdit.style.display = "block";
            
                } else if (selectedDoctor === 'dentist') {
            
                    bpEdit.style.display = "none";
                    ageEdit.style.display = "none";
                    weightEdit.style.display = "none";
                    illnessEdit.style.display = "none";
                    dateEdit.style.display = "block";
            
                } else if (selectedDoctor === 'therapist') {
            
                    bpEdit.style.display = "none";
                    weightEdit.style.display = "none";
                    illnessEdit.style.display = "none";
                    dateEdit.style.display = "none";
                    ageEdit.style.display = "block";
            
                }
            });


            editForm.addEventListener("submit", (event) => {
                event.preventDefault();
                editWrapper.style.display = "none";

                const editObj = new MyVisit(titleEdit.value, descriptionEdit.value, doctorEdit.value, bpEdit.value, ageEdit.value, weightEdit.value, urgencyEdit, statusEdit,  pibEdit.value, illnessEdit.value, dateEdit.value);
                
                fetchPut(editObj, visitData.id);
                loadVisits();
            });

        })

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "❌";
        btnDelete.classList.add("btn-delete");
        visitCard.append(btnDelete);

        btnDelete.addEventListener("click", async () => {
          await fetchDelete(visitData.id); 
            loadVisits();

        });

        

        visitsContainer.append(visitCard);
    });
}

export async function loadVisits() {
    const visits = await get();
    const blockNotItem = document.getElementById('visitContainer'); 
     
        if (visits.length == 0) { 
            blockNotItem .style.display = 'block'; 
        } else { 
            blockNotItem .style.display = 'none'; 
        } 
     
        console.log(visits); 
        displayVisits(visits); 

    
    displayVisits(visits);
}

appointmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(appointmentForm);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        pib: formData.get('pib'),
        doctor: formData.get('doctor'),
        urgency: formData.get('urgency'),
        status: formData.get('status'),
        bp: formData.get('bp'),
        bmi: formData.get('bmi'),
        diseases: formData.get('diseases'),
        age: formData.get('age'),
        lastVisitDate: formData.get('lastVisitDate'),
        therapistAge: formData.get('therapistAge')
    };

    const errors = validateForm(data);

    if (errors.length > 0) {
        errorMessage.textContent = errors.join(" ");
        errorMessage.style.display = 'block';
    } else {
        // errorMessage.style.display = 'none';
        // await createAppointment(data);
        appointmentForm.reset();
        loadVisits();
    }
});

function validateForm(data) {
    const errors = [];
    if (data.doctor === 'cardiologist') {
        if (data.bp < 50 || data.bp > 160) {
            errors.push("Тиск повинен бути числом у діапазоні від 50 до 160.");
        }
        if (data.bmi <= 0) {
            errors.push("Індекс маси тіла повинен бути додатнім числом.");
        }
        if (data.age <= 0) {
            errors.push("Вік повинен бути додатнім числом.");
        }
    } else if (data.doctor === 'dentist') {
        if (!data.lastVisitDate) {
            errors.push("Дата останнього відвідування повинна бути вказана.");
        }
    } else if (data.doctor === 'therapist') {
        if (data.therapistAge <= 0) {
            errors.push("Вік повинен бути додатнім числом.");
        }
    }

    return errors;
}



// document.addEventListener('DOMContentLoaded', () => {
//     const visitsContainer = document.getElementById('visitsContainer');
//     const noItemsMessage = document.getElementById('noItemsMessage');

//     function checkVisits() {
//         const visitCards = visitsContainer.querySelectorAll('.visit-card');
//         if (visitCards.length === 0) {
//             noItemsMessage.style.display = 'block';
//         } else {
//             noItemsMessage.style.display = 'none';
//         }
//     }
//     function loadVisits() {
//         // Replace this with your actual implementation to fetch visits from the server
//         const visits = [
//             { id: 1, doctor: 'Cardiologist' },
//             { id: 2, doctor: 'Dentist' },
//            { id: 3, doctor: 'therapist'},
//         ]; 
// // Clear existing visits
// while (visitsContainer.firstChild && visitsContainer.firstChild !== noItemsMessage) {
//     visitsContainer.removeChild(visitsContainer.firstChild);
// }

// // Add new visits
// visits.forEach(visitData => {
//     const visitCard = document.createElement('div');
//     visitCard.classList.add('visit-card');
//     visitCard.textContent = `Visit by: ${visitData.doctor}`;
//     visitsContainer.appendChild(visitCard);
// });

// // Check visits after loading
// checkVisits();
// }

// // Initial check on page load
// checkVisits();

// // Simulate loading visits after some time
// setTimeout(loadVisits, 1000);
// });


