export const listToMap = <T extends string>(list: T[]): Record<T, true> => {
    return list.reduce((map, item) => {
        map[item] = true;
        return map;
    }, {} as Record<T, true>);
}