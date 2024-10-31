export function formatCurrency(value, decimalPlaces, currencyCode, locale = 'pt-BR') {
    const options = {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    };

    const formatter = new Intl.NumberFormat(locale, options);

    return formatter.format(value);
}
