export function formatDateTime(dateString: string): string {
    const unformattedDate = new Date(dateString);
    const dateFormattingOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Intl.DateTimeFormat('pt-BR', dateFormattingOptions).format(unformattedDate).replace(',', '');
}