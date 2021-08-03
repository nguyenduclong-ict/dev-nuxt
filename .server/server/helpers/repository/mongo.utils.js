export function createIfNotExits(repository, query, data = query, onCreate = null, options = { cascade: true }) {
    return repository
        .findOne({
        query,
    })
        .then((doc) => {
        if (!doc) {
            onCreate && onCreate();
            return repository.create({
                data: data,
                cascade: true,
                ...options,
            });
        }
        return doc;
    });
}
