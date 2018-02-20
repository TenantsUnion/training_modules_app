export const toIdObjMap = <T extends { id: string }> (objects: T[]): { [index: string]: T } => {
    return objects.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
    }, {});
};

export const orderObjByIds = (orderedIds: string[], objectMap: { [p: string]: { id: string } }): any[] => {
    return orderedIds.map((id) => objectMap[id]);
};
