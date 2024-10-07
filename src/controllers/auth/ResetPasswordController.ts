import { RequestHandler } from "express";
import Joi from "joi";
import UserModel from "../../models/Users/UserModel";
import { TEXT } from "../../utils/JoiErrors";
import ResponseService from "../../utils/ResponseService";
import validateFields, { JOI } from "../../utils/validation";
import { mailer } from "../../config/NodeMailer";

const validationSchema = JOI.object({
  email: Joi.string().strict().email().required(),
});

const ResetPasswordController: RequestHandler = async (req, res) => {
  if (await validateFields(validationSchema, req, res)) return;

  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return ResponseService.error(res, TEXT.ERRORS.instructionsSentToEmail);
    }

    sendEmail(email);

    res.status(201).end();
  } catch (error: any) {
    ResponseService.error(res, error.message);
  }
};

const sendEmail = (email: string) => {
  const token = "";

  const resetPasswordLink =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/finish-reset-password/${token}`
      : `http://localhost:3000/finish-reset-password/${token}`;

  const message = {
    to: email,
    subject: "Reset Password Link",
    text: `To change the password to a new one, go to the following link: ${resetPasswordLink}`,
  };
  mailer(message);
};

export default ResetPasswordController;
