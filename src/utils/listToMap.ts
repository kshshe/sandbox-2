export const listToMap = <T extends string>(list: T[], except?: T): Record<T, true> => {
    return list.reduce((map, item) => {
        if (item !== except) {
            map[item] = true;
        }
        return map;
    }, {} as Record<T, true>);
}