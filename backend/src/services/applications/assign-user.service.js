export async function assignUserToApplication(
  applicationId,
  userId,
  db = prisma,
) {
  return await db.application.update({
    where: {
      id: Number(applicationId),
    },
    data: {
      assignedToId: userId,
    },
  });
}
