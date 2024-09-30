export function transformDateFormat(dateString) {
    const parts = dateString.split('/');
    
    if (parts.length !== 3) {
        throw new Error('Invalid date format. Please use dd/mm/yyyy format.');
    }

    return `${parts[0]}-${parts[1]}-${parts[2]}`;
}