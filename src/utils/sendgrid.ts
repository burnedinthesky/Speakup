import sendgridClient, { MailService } from "@sendgrid/mail";

sendgridClient.setApiKey(process.env.SENDGRID_API_KEY as string);

declare global {
    var sendgrid: MailService | undefined;
}
export const sendgrid = global.sendgrid || sendgridClient;

if (process.env.NODE_ENV !== "production") {
    global.sendgrid = sendgrid;
}
