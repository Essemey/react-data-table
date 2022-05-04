
/**
 * 
 * @param {string} type //Column type
 * @param {boolean} order  //Sort order (asc, desc)
 * @param {array} data // Data's array to organized
 * @param {string} column //Column's name
 * @returns 
 */

export function sortData(type, order, column, data) {


    switch (type.toUpperCase()) {
        case 'TEXT':
            return order
                ?
                [...data.sort((a, b) => a[column].localeCompare(b[column]))]
                :
                [...data.sort((a, b) => b[column].localeCompare(a[column]))]
        case 'NUMBER':
            return order
                ?
                [...data.sort((a, b) => a[column] - b[column])]
                :
                [...data.sort((a, b) => b[column] - a[column])]
        case 'DATE':
            return order
                ?
                [...data.sort((a, b) => new Date(a[column]) - new Date(b[column]))]
                :
                [...data.sort((a, b) => new Date(b[column]) - new Date(a[column]))]
    }
}


