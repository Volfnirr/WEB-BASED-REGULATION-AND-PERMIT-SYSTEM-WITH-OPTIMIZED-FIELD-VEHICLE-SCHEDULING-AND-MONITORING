import { getApplicationNumber } from "../../services/applications/application.service.js";
import { submitChainsawForm } from "../../services/applications/chainsaw.service.js";
import { createAuditLog } from "../../services/audit.service.js";
import { prisma } from "../../lib/prisma.js";

export async function submitChainsawFormMW(req, res) {
  try {
    const lastId = await getApplicationNumber();
    const nextId = lastId + 1;
    const year = new Date().getFullYear();
    // Using CRF for Chainsaw Registration Form
    const refNo = `CRF-${year}-${String(nextId).padStart(5, "0")}`;
    console.log("userId being sent:", req.user.id);

    // apply interactive transaction of prisma uhmmmmmmmmmm
    // two types of  transaction 1. Sequential 2. Interactive
    // interactive when when queries depend on each other
    // if one faill all fail no insert lol
    // wahhhhhhh guide sleep
    const application = await prisma.$transaction(async (tx) => {
      // if i forgot to explain
      // parameters in order when you use them in the services sleepppppppppppppppppppppppppp
      const newApplication = await submitChainsawForm(
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
          target: "Chainsaw Registration",
          details: `Submitted Chainsaw Registration application (${refNo})`,
        },
        tx,
        // this thing is here because i do ({}),
        // db = prisma outside the destructuring but in the submitChainsawForm theres no need to destructure
      );

      // only returning newApplication here since we dont want to pass the auditlog to user
      return newApplication;
    });

    return res.status(201).json({
      message: "Chainsaw registration application submitted",
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}