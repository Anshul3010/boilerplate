const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface IMailOption {
  from: string | undefined;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const sendPlainMail = async (mailOptions: any) => {
    sgMail.send(mailOptions);
};

export { sendPlainMail };