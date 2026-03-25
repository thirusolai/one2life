import cron from "node-cron";
import GymBill from "../models/GymBill.js";
import { sendMail } from "../utils/sendMail.js";
import { birthdayTemplate, anniversaryTemplate } from "../utils/mailTemplates.js";

cron.schedule("0 9 * * *", async () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;

  const clients = await GymBill.find();

  for (const c of clients) {
    if (c.dob) {
      const dob = new Date(c.dob);
      if (dob.getDate() === day && dob.getMonth() + 1 === month) {
        await sendMail({
          to: c.email,
          subject: "🎉 Happy Birthday from Elite Fitness",
          html: birthdayTemplate(c.name),
        });
      }
    }

    if (c.anniversaryDate) {
      const ann = new Date(c.anniversaryDate);
      if (ann.getDate() === day && ann.getMonth() + 1 === month) {
        await sendMail({
          to: c.email,
          subject: "🎊 Happy Anniversary",
          html: anniversaryTemplate(c.name),
        });
      }
    }
  }
});
