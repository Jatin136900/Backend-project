import sgMail from "@sendgrid/mail";
import "dotenv/config"

sgMail.setApiKey(process.env.MY_SENDGRID_API_KEY || process.env.MY_SENGRID_API_KEY);

// support multiple env var names and a single sender email var
const senderEmail = process.env.MY_SENDGRID_EMAIL || process.env.MY_SENGRID_EMAIL || process.env.SENDER_EMAIL;

export const sendOTPEmail = async (email, name, otp) => {
    const msg = {
        to: email,
        from: senderEmail,
        subject: "Verify Your Email – OTP Code",
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
          
          <h2 style="color: #111827;">Hello ${name},</h2>

          <p style="color: #374151; font-size: 15px;">
            Thank you for registering with us. To complete your registration, please verify your email address using the OTP below.
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <span style="font-size: 28px; letter-spacing: 4px; font-weight: bold; color: #1d4ed8;">
              ${otp}
            </span>
          </div>

          <p style="color: #374151; font-size: 14px;">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
          </p>

          <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">
            If you did not create this account, please ignore this email.
          </p>

          <hr style="margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            Regards,<br/>
            <strong>Team Ecommerce</strong>
          </p>

        </div>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
    } catch (err) {
        console.log("SENDGRID ERROR (OTP) 👉", err.response?.body || err.message);
        throw err; // rethrow so caller can decide what to do
    }
};



export const sendVerificationEmail = async (email, name, link) => {
    const msg = {
        to: email,
        from: senderEmail,
        subject: "Verify Your Email Address",
        html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
          
          <h2 style="color: #111827;">Hello ${name},</h2>

          <p style="color: #374151; font-size: 15px;">
            Thank you for registering with us. Please verify your email address to complete your registration.
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <a href="${link}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: 600;">
              Verify Email
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px;">
            This link is valid for 24 hours. If you did not create this account, please ignore this email.
          </p>

          <hr style="margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            Regards,<br/>
            <strong>Team Ecommerce</strong>
          </p>

        </div>
      </div>
    `,
    };

    try {
        await sgMail.send(msg);
    } catch (err) {
        console.log("SENDGRID ERROR (VERIFICATION) 👉", err.response?.body || err.message);
        throw err; 
    }

};