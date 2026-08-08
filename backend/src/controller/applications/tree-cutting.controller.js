import { getApplicationNumber } from "../../services/applications/application.service.js";
import { submitTreeCuttingForm } from "../../services/applications/tree-cutting.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { prisma } from "../../lib/prisma.js";

export async function submitTreeCuttingFormMW(req, res) {
  try {
    const lastId = await getApplicationNumber();
    const nextId = lastId + 1;
    const year = new Date().getFullYear();
    const refNo = `TCPF-${year}-${String(nextId).padStart(5, "0")}`;
    console.log("userId being sent:", req.user.id);

    // apply interactive transaction of prisma uhmmmmmmmmmm
    // two types of  transaction 1. Sequential 2. Interactive
    // interactive when when queries depend on each other
    // if one faill all fail no insert lol
    // wahhhhhhh guide sleep
    const application = await prisma.$transaction(async (tx) => {
      // if i forgot to explain
      // parameters in order when you use them in the services sleepppppppppppppppppppppppppp
      const newApplication = await submitTreeCuttingForm(
        refNo,
        req.user.id,
        req.validatedData,
        tx,
      );

      // interative so if one fail all fail, buwahhhhh }:<
      // need it so you can keep track of all
      // first version lol
      await createAuditLog(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: "Submit Form Application",
          target: "Tree Cutting Permit",
          details: `Submitted Tree Cutting Permit application (${refNo})`,
        },
        tx,
        // this thing is here because i do ({}),
        // db = prisma outside the destructuring but in the submitTreeCuttingForm theres no need to destructure
      );

      // only returnign newApplication here since we dont want to pass the auditlog to user
      return newApplication;
    });

    return res.status(201).json({
      message: "Tree cutting application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
