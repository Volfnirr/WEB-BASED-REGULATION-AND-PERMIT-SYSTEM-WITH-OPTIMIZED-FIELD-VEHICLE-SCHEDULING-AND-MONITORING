import { prisma } from "../../lib/prisma.js";
import { requireAuthentication } from "../../middleware/requireAuthentication.js";
import { requireAuthorization } from "../../middleware/requireAuthorization.js";
import { createApplicationCopyService } from "../../services/applications/application-copy.service.js";
import { createApplicationCopyRouter } from "./application-copy.router.js";
export default createApplicationCopyRouter(
  createApplicationCopyService(prisma),
  requireAuthentication,
  requireAuthorization("USER", "APPLICATION_ADMIN"),
);
