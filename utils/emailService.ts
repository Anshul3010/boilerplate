const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendGridKey);

interface IMailOption {
  from: string | undefined;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const sendPlainMail = (mailOptions: any) => {
  sgMail.send(mailOptions);
};

export { sendPlainMail };