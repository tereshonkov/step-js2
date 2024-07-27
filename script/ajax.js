import { AUTH_TOKEN, API_URL } from "./const.js";
import { loadVisits } from "./script.js";

//Отредактированный POST запрос 
export async function postVisits(newObj) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: AUTH_TOKEN,
            },
            body: JSON.stringify(newObj)
        });

        if (response.ok) {
            // getAppointmentList();
            console.log(response.json());
        } else {
            console.error('Failed to create appointment', response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
      
}
//GET запрос на получение данных с сервера 
export async function get() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: AUTH_TOKEN,
            },
        });
        
        return response.ok ? response.json() : Promise.reject(response);
    } catch (erorr) {
        console.error(`Ошибка ${erorr}`);
    }
}

//Delete  Запрос

export async function fetchDelete(id) {
    try {
       const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: AUTH_TOKEN,
            },
        });

        return console.log(response.ok);
    }catch(erorr) {
        console.error(erorr);
    }
}

//Put Запрос

export async  function fetchPut(data, id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify(data),
    });

    return response.ok ? loadVisits(): Promise.reject(data);
}


