export const sortService = (
  modelList: any,
  modelId: any,
  entityList: any
): any => {
  let found = modelList.find((element: any) => element.id == modelId);
  if (found.orderType == "custom") {
    return entityList.sort((a: any, b: any) => a.order - b.order);
  } else if (found.orderType == "desc") {
    return entityList
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName))
      .reverse();
  } else {
    return entityList.sort((a: any, b: any) =>
      a.displayName.localeCompare(b.displayName)
    );
  }
};
