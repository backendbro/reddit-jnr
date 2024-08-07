import nodemailer from 'nodemailer' 

export async function sendEmail (to:string, html:string) {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "06414813769737",
        pass:"5ae0e821a75f4b"
      }
      });

    
      // async..await is not allowed in global scope, must use a wrapper
     
        // send mail with defined transport object
       await transporter.sendMail({
          from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
          to, 
          subject: "Change password",
          html 
        });

}

