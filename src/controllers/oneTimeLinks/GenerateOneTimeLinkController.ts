import generator from "generate-password";
import { RequestHandler } from "express";
import OneTimeLinksModel from "../../models/OneTimeLinks/OneTimeLinkModel";
import UserModel from "../../models/Users/UserModel";
import { sendEmail } from "../../config/NodeMailer";
import ResponseService from "../../utils/ResponseService";
import { TEXT } from "../../utils/JoiErrors";
import validateFields, { JOI } from "../../utils/validation";
import Joi from "joi";

type RequestData = {
  email: string;
};

const validationSchema = JOI.object({
  email: Joi.string().strict().email().required(),
});

const GenerateOneTimeLinkController: RequestHandler<RequestData> = async (req, res) => {
  if (await validateFields(validationSchema, req, res)) {
    return;
  }

  try {
    const token = generator.generate({ length: 20 });
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return ResponseService.error(res, TEXT.ERRORS.userDoesntExists);
    }
    await OneTimeLinksModel.create({
      token: token,
      email: req.body.email,
    });
    // In message.text is an address from which the page will open
    const message = {
      to: req.body.email,
      subject: "Password reset link",
      text:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/reset-password/${token}`
          : `http://localhost:3000/reset-password/${token}`,
    };
    await sendEmail(message);
    ResponseService.success(res, message);
  } catch (err: any) {
    ResponseService.error(res, err.message);
  }
};

export default GenerateOneTimeLinkController;
