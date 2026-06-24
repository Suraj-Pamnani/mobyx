const transporter =
require("../config/email");


const sendEmail = async(options)=>{


await transporter.sendMail({

    from:process.env.EMAIL_USER,

    to:options.email,

    subject:options.subject,

    html:options.message

});


};


module.exports = sendEmail;