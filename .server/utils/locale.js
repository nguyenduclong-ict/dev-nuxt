export const loadLocale = (data) => {
    const vi = {};
    const en = {};
    Object.keys(data).forEach((key) => {
        en[key] = data[key].en || key;
        vi[key] = data[key].vi || key;
    });
    return {
        vi,
        en,
    };
};
