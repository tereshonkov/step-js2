export function filteredFunc(array, inputDescription, select, selectUrgency) {
    let filteredArray = array;

    if (inputDescription && select && selectUrgency) {
        let first = filteredArray.filter(element => element.description.toLowerCase().includes(inputDescription));
        let second = first.filter(element => element.status === select);
        if (second.length === 0) {
            console.log("Элементов не найдено в выбранном Статусе, По таким параметрам элемента массива нет!");
            return;
        }
        let filtered = second.filter(element => element.urgency === selectUrgency);
        if (filtered.length === 0) {
            console.log("Элементов не найдено выбранном Терміновість, По таким параметрам элемента массива нет!");
            return;
        } else {
            filteredArray = filtered;
        }
    }

    if (inputDescription) {
        filteredArray = filteredArray.filter(element => element.description.toLowerCase().includes(inputDescription));
    } else if (select) {
        filteredArray = filteredArray.filter(element => element.status === select);
    } else if (selectUrgency) {
        filteredArray = filteredArray.filter(element => element.urgency === selectUrgency);
    } else {
        console.log("Ошибка в функции фильтрации!");
    }
    return filteredArray;
}