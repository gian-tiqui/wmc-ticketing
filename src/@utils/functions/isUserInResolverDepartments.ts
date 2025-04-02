const isUserInResolverDepartments = (id: number | undefined) => {
  const resolverIds: number[] = [3, 9];

  if (!id) throw new Error("No id provided.");

  const userIsAResolver = resolverIds.includes(id);

  return userIsAResolver;
};

export default isUserInResolverDepartments;
