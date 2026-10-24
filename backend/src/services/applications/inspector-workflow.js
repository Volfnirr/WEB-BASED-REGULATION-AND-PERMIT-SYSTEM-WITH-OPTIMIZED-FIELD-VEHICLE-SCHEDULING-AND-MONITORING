export function applicationId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new Error("INVALID_APPLICATION_ID");
  }
  return id;
}

export async function pendingReview(value, user, db) {
  const id = applicationId(value);

  await db.$queryRaw`SELECT id FROM application WHERE id = ${id} FOR UPDATE`;
  const application = await db.application.findUnique({
    where: { id },
    include: { agricultural_form: true, residential_free_patent_form: true },
  });

  if (!application) {
    throw new Error("APPLICATION_NOT_FOUND");
  }

  const isAssignedToService = user.assignedServices?.some(
    (s) => s.serviceId === application.serviceId,
  );

  if (
    user.role !== "APPLICATION_ADMIN" ||
    !isAssignedToService ||
    application.assignedToId !== user.id
  ) {
    throw new Error("APPLICATION_REVIEW_FORBIDDEN");
  }

  if (application.status !== "PENDING") {
    throw new Error("APPLICATION_NOT_PENDING");
  }

  return application;
}

export function inspectorForm(application) {
  if (application.serviceId === 1) {
    return application.agricultural_form;
  }
  if (application.serviceId === 2) {
    return application.residential_free_patent_form;
  }
}

export function requireInspector(application) {
  if (
    [1, 2].includes(application.serviceId) &&
    !inspectorForm(application)?.assignedInspector
  ) {
    throw new Error("INSPECTOR_REQUIRED");
  }
}

export async function saveInspector(value, inspectorId, user, db) {
  const application = await pendingReview(value, user, db);

  if (![1, 2].includes(application.serviceId)) {
    throw new Error("INSPECTOR_SERVICE_NOT_SUPPORTED");
  }

  const form = inspectorForm(application);
  if (!form) {
    throw new Error("APPLICATION_FORM_NOT_FOUND");
  }

  if (
    !Number.isSafeInteger(inspectorId) ||
    inspectorId < 1 ||
    inspectorId > 2147483647
  ) {
    throw new Error("INVALID_INSPECTOR_ID");
  }

  await db.$queryRaw`SELECT id FROM inspectors WHERE id = ${inspectorId} FOR SHARE`;
  const inspector = await db.inspectors.findUnique({
    where: { id: inspectorId },
  });

  if (!inspector) {
    throw new Error("INSPECTOR_NOT_FOUND");
  }
  if (!inspector.isAvailable) {
    throw new Error("INSPECTOR_NOT_AVAILABLE");
  }

  const previousInspectorId = form.assignedInspector;

  if (application.serviceId === 1) {
    await db.agricultural_form.update({
      where: { applicationId: application.id },
      data: { assignedInspector: inspectorId },
    });
  } else {
    await db.residential_free_patent_form.update({
      where: { applicationId: application.id },
      data: { assignedInspector: inspectorId },
    });
  }

  return { application, inspector, previousInspectorId };
}
