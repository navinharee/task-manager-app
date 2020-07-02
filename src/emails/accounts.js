const sgMail = require('@sendgrid/mail');




sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'navinsourie@gmail.com',
        subject: 'Welcome to LAFAYETTE!!!',
        text: `Welcome to the HSG, ${name}. Let me know how you get along with the app!!!`
    })

};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'navinsourie@gmail.com',
        subject: 'Cancellation LAFAYETTE Email!!!',
        text: `Hello ${name}..any reason why you are cancelling your account?!!!!`
    })
}

// sgMail.send({
//     to: 'keeplearn2grow@gmail.com',
//     from: 'navinsourie@gmail.com',
//     subject: 'Testing the email from Task App',
//     text: 'This is dummy email test..please bear'
// })

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}