require("dotenv").config();

const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin
// For Vercel/Render: Use JSON from environment variable
//test
// Note: If bucket doesn't exist, enable Firebase Storage in Firebase Console
const STORAGE_BUCKET = "foursix46-production-4a43f.appspot.com";
const PROJECT_ID = "foursix46-production-4a43f";

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // For Render: Use JSON string from environment variable
    const serviceAccount = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: STORAGE_BUCKET,
    });
    console.log("✅ Firebase initialized from JSON environment variable");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Try to use file path (for local development)
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (fs.existsSync(credPath)) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: STORAGE_BUCKET,
      });
      console.log("✅ Firebase initialized from file path:", credPath);
    } else {
      // Try relative path
      const relativePath = path.join(__dirname, "serviceAccountKey.json");
      if (fs.existsSync(relativePath)) {
        admin.initializeApp({
          credential: admin.credential.cert(require(relativePath)),
          storageBucket: STORAGE_BUCKET,
        });
        console.log("✅ Firebase initialized from relative path");
      } else {
        // Fallback to applicationDefault
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          storageBucket: STORAGE_BUCKET,
        });
        console.log(
          "⚠️  Firebase initialized with applicationDefault (file not found)"
        );
      }
    }
  } else {
    // Fallback for local development
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: STORAGE_BUCKET,
    });
    console.log("✅ Firebase initialized with applicationDefault");
  }
} catch (error) {
  console.error("❌ Error initializing Firebase:", error.message);
  throw error;
}

const db = admin.firestore();

// Get storage bucket - try to get from app config first, fallback to explicit name
let bucket;
try {
  // Try to get bucket from the app (uses storageBucket from initialization)
  bucket = admin.storage().bucket();
  console.log(`✅ Storage bucket initialized: ${bucket.name}`);
} catch (error) {
  console.warn(
    `⚠️  Could not get bucket from app config, trying explicit name: ${STORAGE_BUCKET}`
  );
  bucket = admin.storage().bucket(STORAGE_BUCKET);
  console.log(
    `✅ Storage bucket initialized with explicit name: ${STORAGE_BUCKET}`
  );
}

const app = express();
const allowedOrigins = [
  'https://couriers46.vercel.app',
  'https://route46couriers.co.uk',       // ← add
  'https://www.route46couriers.co.uk',   // ← add (this is what's being blocked)
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ PASTE THIS before app.use(express.json(...))
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const paymentId   = session.metadata?.paymentId;
    const bookingId = session.metadata?.bookingId;
    const payerName   = session.metadata?.name   || "N/A";
    const payerEmail  = session.metadata?.email  || "N/A";
    const reference   = session.metadata?.reference   || "N/A";
    const totalAmount = session.metadata?.totalAmount || "N/A";
    const netAmount   = session.metadata?.netAmount   || "N/A";
    const vatAmount   = session.metadata?.vatAmount   || "N/A";

    if (paymentId && !bookingId) {
      await db.collection('payments').doc(paymentId).update({
        status: 'paid',
        stripePaymentIntentId: session.payment_intent,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('✅ Payment marked as paid:', paymentId);

      // ---------------- EMAIL TO OPERATIONS ----------------

      const paidAt = new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const paymentSubject = `Payment Received – Route46 Couriers`;

      const paymentHtml = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received – Route46 Couriers</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;">

  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Payment received from ${payerName} – £${totalAmount}. Reference: ${reference}.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing:0;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin:0;font-size:34px;font-weight:900;letter-spacing:-1px;line-height:1;">
                <span style="color:#48AEDD;">Route</span><span style="color:#E53935;">46</span>
              </h1>
              <p style="margin:4px 0 0;font-size:11px;color:#134467;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Couriers</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border-top:6px solid #1a7a4a;border:1px solid #edf2f7;box-shadow:0 4px 20px rgba(0,0,0,0.05);padding:36px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">

                <!-- Badge + Heading -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <span style="display:inline-block;background:#d4edda;color:#155724;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:20px;margin-bottom:12px;">
                      ✓ &nbsp;Payment Confirmed
                    </span>
                    <h2 style="margin:0;font-size:20px;font-weight:800;color:#134467;">Payment Received</h2>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding-bottom:20px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"/></td></tr>

                <!-- Payer Details -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#134467;text-transform:uppercase;letter-spacing:0.5px;">Payer Details</p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;width:130px;">Name</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${payerName}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Email</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${payerEmail}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding-bottom:20px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"/></td></tr>

                <!-- Payment Breakdown -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#134467;text-transform:uppercase;letter-spacing:0.5px;">Payment Breakdown</p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;width:130px;">Net Amount</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">&pound;${netAmount}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">VAT (20%)</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">&pound;${vatAmount}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:6px 0 4px;border-top:1px solid #eee;">Total Paid</td>
                        <td style="font-size:15px;color:#1a7a4a;font-weight:800;padding-top:6px;border-top:1px solid #eee;">&pound;${totalAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding-bottom:20px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"/></td></tr>

                <!-- Reference & Timestamp -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;width:130px;">Reference</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${reference}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Payment ID</td>
                        <td style="font-size:13px;color:#48AEDD;font-weight:600;font-family:monospace;">${paymentId}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Stripe Intent</td>
                        <td style="font-size:12px;color:#888;font-family:monospace;">${session.payment_intent}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Submitted At</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${paidAt}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Note -->
                <tr>
                  <td style="background:#f0f7ff;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#134467;font-weight:600;">
                      Please check the backend for full details and verification.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px;font-size:11px;color:#94a3b8;line-height:1.7;">
              <strong style="color:#134467;">Route46 Couriers</strong> – Internal Notification<br/>
              A trading brand of FourSix46&reg; Global Ltd &nbsp;&bull;&nbsp; 66 Paul Street, London, EC2A 4NA<br/>
              &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const OPERATIONS_EMAIL = "operations@route46couriers.co.uk";

      await sendApplicationEmail(
        OPERATIONS_EMAIL,
        "Route46 Operations",
        paymentSubject,
        paymentHtml,
        "booking"
      );
      console.log(`📧 Payment notification sent to ${OPERATIONS_EMAIL} for payment ${paymentId}`);

      // -------------------------------------------------------
    }
    // In webhook — bookingId block
if (bookingId) {
  const docRef = db.collection('bookings').doc(bookingId);
  const doc = await docRef.get();

  // ✅ Skip if frontend already confirmed it
  if (doc.exists && doc.data()?.status === 'confirmed') {
    console.log('⏭️ Booking already confirmed by frontend, skipping webhook:', bookingId);
  } else {
    await docRef.update({
      status: 'confirmed',
      stripePaymentIntentId: session.payment_intent,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Booking confirmed via webhook:', bookingId);
  }
}
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));// Serve assets statically with forced download
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
/* =========================================
   VALIDATION HELPERS
========================================= */

function validateBlogPostForPublish(data) {
  const required = [
    "title",
    "slug",
    "excerpt",
    "category",
    "authorName",
    "publishedDate",
    "seoTitle",
    "seoDescription",
  ];

  const missing = required.filter(field => !data[field]);

  if (!data.intro && (!data.contentBlocks || data.contentBlocks.length === 0)) {
    missing.push("intro or contentBlocks");
  }

  return missing;
}


function validateServiceForPublish(data) {
  const required = [
    "name",
    "slug",
    "heroTitle",
    "seoTitle",
    "seoDescription"
  ];

  return required.filter(field => !data[field]);
}

function validateSectorForPublish(data) {
  const required = [
    "name",
    "slug",
    "heroTitle",
    "seoTitle",
    "seoDescription"
  ];

  const missing = required.filter(field => !data[field]);

  if (!data.recommendedServices || data.recommendedServices.length === 0) {
    missing.push("recommendedServices");
  }

  return missing;
}

function validateLocationForPublish(data) {
  const required = [
    "name",
    "slug",
    "heroTitle",
    "seoTitle",
    "seoDescription"
  ];

  const missing = required.filter(field => !data[field]);

  if (!data.recommendedServices || data.recommendedServices.length === 0) {
    missing.push("recommendedServices");
  }

  return missing;
}

function validateLandingForPublish(data) {
  const required = [
    "locationSlug",
    "serviceSlug",
    "heroTitle",
    "intro",
    "seoTitle",
    "seoDescription"
  ];

  return required.filter(field => !data[field]);
}
// --- NODEMAILER CONFIGURATION ---
// Try multiple SMTP configurations to work around Render's restrictions
const SENDER_EMAIL = process.env.EMAIL_USER || "noreply@foursix46.com";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error(
    "⚠️  WARNING: EMAIL_USER or EMAIL_PASS not set! Email will not work."
  );
} else {
  // Single SMTP configuration for Vercel: Port 465 with SSL (recommended for Gmail)
  const transporter465 = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false,
      ciphers: "SSLv3",
    },
  });

  // In Vercel serverless, cold starts can wipe globals and verification is wasteful.
  // We assign the SSL transporter directly without pre-verification.
  global.nodemailerTransporter = transporter465;
  console.log("✅ Email transporter configured for Gmail SSL (465)");
}

const OWNER_EMAIL = process.env.OWNER_EMAIL || SENDER_EMAIL;

// --- HELPER FUNCTIONS FOR EMAIL ---

// Resolve credentials based on sender type
// Supports email aliasing: one Gmail account with multiple "from" addresses
function getEmailCredentials(type) {
  // Always use the main account credentials for authentication
  const authUser = process.env.EMAIL_USER;
  const authPass = process.env.EMAIL_PASS;

  // Determine which "from" email address to use based on sender type
  let fromEmail = authUser; // Default to main email

  if (type) {
    const t = type.toLowerCase();
    // Check for alias emails (these use the same credentials but different "from" address)
    if (t === 'customer' && process.env.CUSTOMER_EMAIL) {
      fromEmail = process.env.CUSTOMER_EMAIL;
    } else if (t === 'driver' && process.env.DRIVER_EMAIL) {
      fromEmail = process.env.DRIVER_EMAIL;
    } else if (t === 'shipper' && process.env.SHIPPER_EMAIL) {
      fromEmail = process.env.SHIPPER_EMAIL;
    } else if (t === 'booking' && process.env.BOOKINGS_EMAIL) {
      fromEmail = process.env.BOOKINGS_EMAIL;
    }
  }

  return {
    user: authUser,      // For SMTP authentication
    pass: authPass,      // For SMTP authentication
    fromEmail: fromEmail // For "From" header in email
  };
}

// Global cache for transporters to avoid recreating them for every request
global.emailTransporters = global.emailTransporters || {};

function getTransporter(user, pass) {
  const key = user;
  // If we don't have a transporter for this user, create one
  if (!global.emailTransporters[key]) {
    console.log(`🔌 Creating new email transporter for: ${user}`);
    global.emailTransporters[key] = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      tls: { rejectUnauthorized: false, ciphers: "SSLv3" },
    });
  }
  return global.emailTransporters[key];
}

/**
 * Sends an email using the appropriate account based on senderType.
 * @param {string} toEmail - Recipient email
 * @param {string} toName - Recipient name
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML body
 * @param {string} [senderType=null] - "Customer", "Driver", "Shipper" or null for default
 */
async function sendApplicationEmail(
  toEmail,
  toName,
  subject,
  htmlContent,
  senderType = null,
  attachments = []   // ← new optional param, defaults to no attachments
) {
  if (!toEmail) {
    console.error("❌ Cannot send email: recipient email is missing");
    return false;
  }

  const { user, pass, fromEmail } = getEmailCredentials(senderType);

  if (!user || !pass) {
    console.error(`❌ Missing email credentials for type: ${senderType || "default"}. Check your .env file.`);
    return false;
  }

  let transporter = getTransporter(user, pass);

  let displayName = "FourSix46 Support";
  if (senderType) {
    const t = senderType.toLowerCase();
    if (t === 'customer')    displayName = "FourSix46 Customer Support";
    else if (t === 'driver') displayName = "FourSix46 Driver Support";
    else if (t === 'shipper') displayName = "FourSix46 Shipper Support";
    else if (t === 'booking') displayName = "FourSix46 Bookings";
  }

  const mailOptions = {
    from: `"${displayName}" <${fromEmail}>`,
    to: toEmail,
    subject: subject,
    html: htmlContent,
    ...(attachments.length > 0 && { attachments }), // ← only added when present
  };

  const trySend = async (currentTransporter, label) => {
    try {
      const info = await currentTransporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${toEmail} via ${label}: ${info.messageId}`);
      return { success: true, info };
    } catch (error) {
      console.error(`❌ Email send attempt failed via ${label}:`, error?.message || error);
      return { success: false, error };
    }
  };

  const first = await trySend(transporter, `${user}-initial`);
  if (first.success) return true;

  console.log(`🔄 Refreshing transporter for ${user} and retrying...`);
  global.emailTransporters[user] = null;
  transporter = getTransporter(user, pass);

  const second = await trySend(transporter, `${user}-retry`);
  if (second.success) return true;

  console.error(`❌ Failed to send email from ${user} to ${toEmail} after retry.`);
  return false;
}
// === API ENDPOINTS ===
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the FourSix46 API!" });
});

/**
 * @route   GET /api/businesses/lookup/:registrationNumber
 * @desc    Look up an APPROVED business by registration number
 *          Bypasses client-side security rules by running as admin,
 *          but strictly filters for 'approved' status and returns limited fields.
 */
app.get("/api/businesses/lookup/:registrationNumber", async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    if (!registrationNumber) {
      return res.status(400).json({ message: "Registration number is required" });
    }

    // Query for APPROVED businesses only
    const snapshot = await db.collection("businesses")
      .where("registrationNumber", "==", registrationNumber)
      .where("status", "==", "approved")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Business not found or not approved" });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Return only allowed fields (Projection)
    const businessDetails = {
      registrationNumber: data.registrationNumber,
      companyName: data.companyName,
      companyAddress: data.companyAddress,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      status: data.status,
      vatNumber: data.vatNumber
    };

    res.json(businessDetails);

  } catch (error) {
    console.error("Error looking up business:", error);
    res.status(500).json({ message: "Internal server error during business lookup" });
  }
});

/**
 * @route   POST /api/drivers/apply
 * @desc    Handles new driver applications
 */
app.post("/api/drivers/apply", async (req, res) => {
  try {
    const driverData = req.body;

    // 🔐 Basic required field validation
    if (!driverData.firstName || !driverData.email) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    // 🔐 UTR validation + normalization
    if (!driverData.utrNumber) {
      return res.status(400).json({
        message: "UTR Number is required.",
      });
    }

    const normalizedUTR = driverData.utrNumber.replace(/\s/g, "");

    if (!/^\d{10}$/.test(normalizedUTR)) {
      return res.status(400).json({
        message: "UTR must be exactly 10 digits.",
      });
    }

    // 🔐 Whitelist allowed fields (prevents malicious injection)
    const application = {
      firstName: driverData.firstName,
      lastName: driverData.lastName,
      dateOfBirth: driverData.dateOfBirth,
      email: driverData.email,
      phone: driverData.phone,
      addressLine1: driverData.addressLine1,
      addressLine2: driverData.addressLine2 || "",
      town: driverData.town,
      county: driverData.county,
      postcode: driverData.postcode,

      vehicleType: driverData.vehicleType,
      registration: driverData.registration,
      makeModel: driverData.makeModel,
      dvlaCheckCode: driverData.dvlaCheckCode,
      year: driverData.year,
      niNumber: driverData.niNumber,
      utrNumber: normalizedUTR,
      rightToWorkCode: driverData.rightToWorkCode,
      dbsConfirmed: driverData.dbsConfirmed,

      accountName: driverData.accountName,
      sortCode: driverData.sortCode,
      accountNumber: driverData.accountNumber,

      // 🔹 System fields
      status: "pending",
      documentsUploaded: false,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("drivers").add(application);

    // ------------------ EMAIL SECTION ------------------

    const subject = "Application Received - FourSix46 Couriers";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Tahoma,Verdana,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;">
          <div style="padding:30px;text-align:center;border-bottom:1px solid #eee;">
            <h1 style="margin:0;">
              <span style="color:#48AEDD;">FourSix</span>
              <span style="color:#E53935;">46</span>
            </h1>
            <p style="margin:5px 0 0;font-size:11px;color:#134467;text-transform:uppercase;">
              Couriers
            </p>
          </div>
          <div style="padding:40px 30px;color:#333;">
            <h2 style="color:#134467;">Application Received</h2>
            <p>Hello <strong>${driverData.firstName}</strong>,</p>
            <p>Thank you for applying to drive with <strong>FourSix46 Couriers</strong>.</p>
            <p>Our team is reviewing your application and documents. We will contact you shortly with next steps.</p>
            <br/>
            <p>Best regards,<br/><strong>The FourSix46 Team</strong></p>
          </div>
          <div style="background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;">
            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd.
          </div>
        </div>
      </body>
      </html>
    `;

    await sendApplicationEmail(
      driverData.email,
      driverData.firstName,
      subject,
      htmlContent,
      "driver"
    );

    // ---------------------------------------------------

    return res.status(201).json({
      message: "Application submitted successfully!",
      driverId: docRef.id,
    });

  } catch (error) {
    console.error("❌ Error submitting application:", error);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

/**
 * @route   POST /api/businesses/apply
 * @desc    Handles new business registrations
 */
app.post("/api/businesses/apply", async (req, res) => {
  try {
    const businessData = req.body;

    const registration = {
      ...businessData,
      status: "pending",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("businesses").add(registration);

    // --- Send Confirmation Email ---
    const subject = "Application Received – Route46 Couriers";

const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received – Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }

        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }

        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .mobile-padding { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
        We have received your application and our team is currently reviewing your details.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">

                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Couriers</p>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #134467;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                <!-- Heading -->
                                <tr>
                                    <td align="center" style="padding-bottom: 28px;">
                                        <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #134467;">Application Received</h2>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td align="left" style="font-size: 15px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 14px;">Hi <strong>${businessData.contactFirstName}</strong>,</p>
                                        <p style="margin: 0 0 14px;">
                                            Thank you for your interest in working with <strong>Route46 Couriers</strong>.
                                        </p>
                                        <p style="margin: 0 0 24px;">
                                            We have successfully received your application and our team is currently reviewing your details.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- What Happens Next -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">What happens next?</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            Your application will be assessed to ensure suitability for our courier network. This may include reviewing your business details and delivery requirements.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- What You Can Expect -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">What you can expect</h3>
                                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666666; line-height: 1.9;">
                                            <li>You will receive an update once your application has been reviewed</li>
                                            <li>If approved, we will provide onboarding instructions and required documents</li>
                                            <li>If additional information is needed, our team will contact you</li>
                                        </ul>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- About Route46 -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">About Route46</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            Route46 Couriers operates through a nationwide courier network, providing access to thousands of verified drivers and flexible delivery solutions across the UK.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Sign-off -->
                                <tr>
                                    <td align="left" style="font-size: 14px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 18px;">
                                            If you have any questions, you can reply directly to this email and our team will assist you. Thank you for choosing Route46 Couriers.
                                        </p>
                                        <p style="margin: 0;">
                                            Kind regards,<br/>
                                            <strong>Route46 Couriers Team</strong><br/>
                                            <a href="mailto:shippers@route46couriers.co.uk" style="color: #48AEDD; text-decoration: none;">
                                                shippers@route46couriers.co.uk
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; line-height: 1.7; margin-top: 20px;">
                            <strong style="color: #134467;">Route46 Couriers</strong><br/>
                            A trading brand of FourSix46&reg; Global Ltd<br/>
                            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
                            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    await sendApplicationEmail(businessData.contactEmail, businessData.contactFirstName, subject, htmlContent, 'shipper');
    // -------------------------------

    res.status(201).json({
      message: "Business registration submitted successfully!",
      businessId: docRef.id,
    });
  } catch (error) {
    console.error("Error submitting business registration: ", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

/**
 * @route   POST /api/create-checkout-session
 * @desc    Creates a Stripe Embedded Checkout session
 */
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    let { amount, currency = "gbp", bookingId, customerEmail, returnUrl, bookingData } = req.body;

    // If bookingData is provided, save it to Firestore first
    if (bookingData) {
      // Add server timestamp
      bookingData.createdAt = admin.firestore.FieldValue.serverTimestamp();

      const docRef = await db.collection("bookings").add(bookingData);
      bookingId = docRef.id;
      console.log("Booking created via backend:", bookingId);
    }

    if (!amount || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Parcel Delivery Service',
              description: `Booking Reference: ${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // Amount in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      customer_email: customerEmail,
      metadata: {
        bookingId: bookingId,
        paymentId: bookingId,   // ← ADD THIS so webhook can update the record
        email: customerEmail,
      }
    });

    res.send({ clientSecret: session.client_secret, bookingId });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: error.message });
  }
});

// --- We are keeping this temporarily for you to set up your admin ---
// --- REMOVE THIS AFTER YOU RUN IT ---
/**
 * @route   POST /api/make-admin
 * @desc    Sets a custom 'admin' claim on a user.
 * @access  SECURE: Run this one time, then remove it.
 */
// --- ONE-TIME ADMIN SETUP — DELETE AFTER USE ---
// app.post('/api/make-admin', async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: 'Email is required.' });

//     const user = await admin.auth().getUserByEmail(email);
//     await admin.auth().setCustomUserClaims(user.uid, { admin: true });

//     return res.status(200).json({ 
//       message: `Success! ${email} is now an admin.`,
//       uid: user.uid
//     });
//   } catch (error) {
//     console.error('make-admin error:', error);
//     return res.status(500).json({ message: error.message });
//   }
// });
// --- END ONE-TIME SETUP ---


/**
 * @route   POST /api/drivers/:id/approve
 * @desc    Approves a driver application AND sends email
 */
app.post("/api/drivers/:id/approve", async (req, res) => {
  try {
    const driverId = req.params.id;
    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required." });
    }

    const docRef = db.collection("drivers").doc(driverId);

    // --- Get driver data BEFORE updating ---
    const doc = await docRef.get();
    if (!doc.exists) {
      return res
        .status(404)
        .json({ message: `Driver with ID ${driverId} not found.` });
    }
    const driverData = doc.data();
    // ----------------------------------------

    // Update the document
    await docRef.update({ status: "approved" });

    // --- Send Email ---
    const subject = "Driver Application Approved – Next Steps | Route46 Couriers";
const apiUrl = process.env.VITE_API_URL || process.env.API_URL || "http://localhost:5000";

const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Application Approved – Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }

        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }

        .step-circle {
            background-color: #E53935;
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            text-align: center;
            line-height: 32px;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
        }

        ul.content-list { margin: 0 0 15px 0; padding-left: 20px; font-size: 14px; color: #666666; line-height: 1.6; }
        ul.content-list li { margin-bottom: 5px; }

        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .mobile-padding { padding: 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
        Your Route46 Couriers application has been approved. Complete your onboarding steps to get started.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">

                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Couriers</p>
                        </td>
                    </tr>

                    <!-- Approval Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #134467;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 25px;">
                                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #134467;">Application Approved</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="font-size: 15px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 14px;">Hi <strong>${driverData.firstName}</strong>,</p>
                                        <p style="margin: 0 0 14px;">We're pleased to inform you that your application to join <strong>Route46 Couriers</strong> has been approved.</p>
                                        <p style="margin: 0;">You can now proceed with the final onboarding steps to start working within our courier network.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- Next Steps / Documents Section -->
                    <tr>
                        <td class="card" style="padding: 0; background-color: #ffffff; overflow: hidden;">

                            <!-- Section Header -->
                            <div style="background-color: #F5EB18; padding: 15px 30px;">
                                <h3 style="margin: 0; color: #134467; font-size: 18px; font-weight: 700; text-transform: uppercase;">Next Steps (Required)</h3>
                            </div>

                            <div style="padding: 30px;" class="mobile-padding">
                                <p style="margin: 0 0 6px; font-size: 15px; color: #555;">Please review and complete the following documents, which are <strong>attached to this email</strong>:</p>

                                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

                                <!-- Step 1: Documents to Sign -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                                    <tr>
                                        <td valign="top" width="50" style="padding-right: 15px;">
                                            <div class="step-circle">1</div>
                                        </td>
                                        <td valign="top">
                                            <h4 style="margin: 0 0 8px; font-size: 16px; color: #134467;">Documents to Sign</h4>
                                            <ul class="content-list">
                                                <li><strong>Driver Agreement</strong></li>
                                                <li><strong>Driver Policy Acknowledgement</strong></li>
                                            </ul>
                                            <p style="margin: 0; font-size: 14px; color: #555; background: #f8fafc; border-left: 3px solid #48AEDD; padding: 10px 14px; border-radius: 4px;">
                                                Please sign these documents and <strong>reply to this email with the signed copies</strong>.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Step 2: Documents to Read -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px dashed #eee; padding-top: 28px;">
                                    <tr>
                                        <td valign="top" width="50" style="padding-right: 15px;">
                                            <div class="step-circle">2</div>
                                        </td>
                                        <td valign="top">
                                            <h4 style="margin: 0 0 8px; font-size: 16px; color: #134467;">Documents to Read</h4>
                                            <ul class="content-list">
                                                <li><strong>Driver Handbook</strong> – Safety, Operational Guidelines &amp; Insurance Requirements</li>
                                            </ul>
                                            <p style="margin: 0; font-size: 14px; color: #666;">
                                                These documents outline how the Route46 network operates and the standards expected when completing deliveries.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                            </div>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- Important Requirements Section -->
                    <tr>
                        <td class="card" style="padding: 0; background-color: #ffffff; overflow: hidden;">

                            <div style="background-color: #134467; padding: 15px 30px;">
                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; text-transform: uppercase;">Important Requirements</h3>
                            </div>

                            <div style="padding: 30px;" class="mobile-padding">
                                <p style="margin: 0 0 14px; font-size: 15px; color: #555;">Before starting work, please ensure:</p>
                                <ul class="content-list">
                                    <li>Your driving licence is valid</li>
                                    <li>Your vehicle is roadworthy (MOT, tax)</li>
                                    <li>You have active <strong>Hire &amp; Reward</strong> and <strong>Goods-in-Transit</strong> insurance</li>
                                    <li>All submitted information remains accurate and up to date</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- What Happens After Submission -->
                    <tr>
                        <td class="card" style="padding: 0; background-color: #ffffff; overflow: hidden;">

                            <div style="background-color: #48AEDD; padding: 15px 30px;">
                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; text-transform: uppercase;">What Happens After Submission</h3>
                            </div>

                            <div style="padding: 30px;" class="mobile-padding">
                                <p style="margin: 0 0 14px; font-size: 15px; color: #555;">Once we receive your signed documents:</p>
                                <ul class="content-list">
                                    <li>Your profile will be fully activated</li>
                                    <li>You will be eligible to receive delivery opportunities</li>
                                    <li>Our team may contact you with initial job guidance</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- Contact / Reply Card -->
                    <tr>
                        <td class="card" style="padding: 30px; background-color: #134467; color: #ffffff; border-radius: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left" class="mobile-stack" style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                                        <p style="margin: 0 0 6px; color: #ffffff; font-size: 15px;">
                                            Route46 Couriers operates through a nationwide network, providing access to thousands of verified drivers and delivery opportunities across the UK.
                                        </p>
                                        <p style="margin: 0; color: #cbd5e1; font-size: 14px;">
                                            If you have any questions during onboarding, simply reply to this email and our team will assist you.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <a href="mailto:drivers@route46couriers.co.uk" style="color: #F5EB18; font-weight: bold; text-decoration: none; border-bottom: 1px solid #F5EB18; font-size: 15px;">drivers@route46couriers.co.uk</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Welcome Sign-Off -->
                    <tr>
                        <td style="padding: 30px 20px 10px; text-align: center;">
                            <p style="margin: 0 0 6px; font-size: 17px; color: #134467; font-weight: bold;">Welcome to Route46 Couriers.</p>
                            <p style="margin: 0 0 16px; font-size: 15px; color: #555;">Kind regards,<br/><strong>Route46 Couriers Team</strong></p>
                            <a href="mailto:drivers@route46couriers.co.uk" style="color: #48AEDD; font-size: 14px; text-decoration: none;">drivers@route46couriers.co.uk</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; border-top: 1px solid #eee; line-height: 1.7;">
                            <strong style="color: #134467;">Route46 Couriers</strong><br/>
                            A trading brand of FourSix46&reg; Global Ltd<br/>
                            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
                            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    const path = require("path");
    const docsBase = path.join(__dirname, "../assets/Documents/");
    // Send email and wait (Vercel serverless may stop background work if not awaited)
    const emailOk = await sendApplicationEmail(
      driverData.email,
      driverData.firstName,
      subject,
      htmlContent,
      'driver',
      [
    {
      filename: "Driver Agreement.pdf",
      path: path.join(docsBase, "ROUTE46 COURIERS – DRIVER AGREEMENT.pdf"),
      contentType: "application/pdf",
    },
    {
      filename: "Driver Policy Acknowledgement.pdf",
      path: path.join(docsBase, "ROUTE46 COURIERS – DRIVER POLICY ACKNOWLEDGEMENT.pdf"),
      contentType: "application/pdf",
    },
    {
      filename: "Driver Handbook.pdf",
      path: path.join(docsBase, "ROUTE46 COURIERS – DRIVER HANDBOOK.pdf"),
      contentType: "application/pdf",
    },
  ]
    );
    if (!emailOk) {
      return res.status(502).json({
        message: `Driver ${driverId} approved, but email failed to send.`,
      });
    }
    // ------------------

    res
      .status(200)
      .json({ message: `Driver ${driverId} approved successfully.` });
  } catch (error) {
    console.error(`Error approving driver ${req.params.id}: `, error);
    res.status(500).json({ message: "Something went wrong while approving." });
  }
});

/**
 * @route   POST /api/drivers/:id/upload-file
 * @desc    Uploads a file to Firebase Storage and returns the download URL
 */app.post("/api/drivers/:id/upload-file", async (req, res) => {
  try {
    const driverId = req.params.id;
    const { fileName, fileData, contentType, fileType } = req.body;

    if (!driverId || !fileName || !fileData || !fileType) {
      return res.status(400).json({
        message: "Driver ID, file name, file data, and file type are required.",
      });
    }

    // ✅ Only allow specific file types
    const allowedFileTypes = [
      "driving-license",
      "vehicle-insurance",
      "public-liability",
      "goods-transit",
      "right-to-work",
    ];

    if (!allowedFileTypes.includes(fileType)) {
      return res.status(400).json({
        message: "Invalid file type.",
      });
    }

    console.log(
      `📤 [Upload API] Uploading ${fileType} for driver ${driverId}`
    );

    // ✅ Check bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      return res.status(500).json({
        message: `Storage bucket "${bucket.name}" not accessible.`,
      });
    }

    // ✅ Strip base64 header safely
    const base64Match = fileData.match(/^data:(.*);base64,(.*)$/);
    const base64String = base64Match ? base64Match[2] : fileData;

    const fileBuffer = Buffer.from(base64String, "base64");

    // ✅ Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      return res.status(400).json({
        message: "File size exceeds 5MB limit.",
      });
    }

    // ✅ Validate allowed content types
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedMimeTypes.includes(contentType)) {
      return res.status(400).json({
        message: "Invalid file type. Only PDF, JPG, PNG allowed.",
      });
    }

    // ✅ Safe filename
    const sanitizedName = fileName.replace(/[^\w.\-]/g, "_");

    const safeFileName = `${fileType}-${Date.now()}-${sanitizedName}`;

    const storagePath = `applications/${driverId}/${safeFileName}`;

    console.log(`📁 Storage path: ${storagePath}`);

    // ✅ Upload file
    const file = bucket.file(storagePath);

    await file.save(fileBuffer, {
      metadata: {
        contentType: contentType,
        metadata: {
          originalName: fileName,
          fileType,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // ✅ Signed URL (1 year)
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    console.log(
      `✅ [Upload API] ${fileType} uploaded successfully`
    );

    return res.status(200).json({
      message: "File uploaded successfully.",
      url: signedUrl,
      fileName: safeFileName,
      fileType,
    });

  } catch (error) {
    console.error("❌ [Upload API] Error:", error);

    let errorMessage = error.message || "Upload failed.";

    if (error.code === 403) {
      errorMessage =
        "Permission denied. Ensure service account has Storage Admin role.";
    }

    return res.status(500).json({
      message: errorMessage,
      code: error.code,
    });
  }
});
/**
 * @route   POST /api/drivers/:id/files
 * @desc    Updates driver document with uploaded file URLs (from client Storage uploads)
 */app.post("/api/drivers/:id/files", async (req, res) => {
  try {
    const driverId = req.params.id;

    console.log(
      `📁 [Files API] Received request to update files for driver: ${driverId}`
    );

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required." });
    }

    const {
      drivingLicenseUrl,
      rightToWorkDocUrl,
      vehicleInsuranceUrl,
      publicLiabilityInsuranceUrl,
      goodsInTransitInsuranceUrl,
    } = req.body || {};

    console.log(`📁 [Files API] Received URLs:`, {
      drivingLicenseUrl: drivingLicenseUrl ? "✅" : "❌",
      rightToWorkDocUrl: rightToWorkDocUrl ? "✅" : "❌",
      vehicleInsuranceUrl: vehicleInsuranceUrl ? "✅" : "❌",
      publicLiabilityInsuranceUrl: publicLiabilityInsuranceUrl ? "✅" : "❌",
      goodsInTransitInsuranceUrl: goodsInTransitInsuranceUrl ? "✅" : "❌",
    });

    const updates = {};

    if (drivingLicenseUrl)
      updates.drivingLicenseUrl = drivingLicenseUrl;

    if (rightToWorkDocUrl)
      updates.rightToWorkDocUrl = rightToWorkDocUrl;

    if (vehicleInsuranceUrl)
      updates.vehicleInsuranceUrl = vehicleInsuranceUrl;

    if (publicLiabilityInsuranceUrl)
      updates.publicLiabilityInsuranceUrl = publicLiabilityInsuranceUrl;

    if (goodsInTransitInsuranceUrl)
      updates.goodsInTransitInsuranceUrl = goodsInTransitInsuranceUrl;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No file URLs provided." });
    }

    await db.collection("drivers").doc(driverId).update({
      ...updates,
      documentsUploaded: true,
      documentsUploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(
      `✅ [Files API] Successfully updated driver ${driverId}`
    );

    return res.status(200).json({
      message: "Driver files updated successfully.",
      driverId,
      updatedFields: Object.keys(updates),
    });

  } catch (error) {
    console.error(
      `❌ [Files API] Error updating files for driver ${req.params.id}:`,
      error
    );

    res.status(500).json({
      message: "Failed to update driver files.",
      error: error.message,
    });
  }
});
/**
 * @route   POST /api/drivers/:id/reject
 * @desc    Rejects a driver application AND sends email
 */
app.post("/api/drivers/:id/reject", async (req, res) => {
  try {
    const driverId = req.params.id;
    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required." });
    }

    const docRef = db.collection("drivers").doc(driverId);

    // --- Get driver data BEFORE updating ---
    const doc = await docRef.get();
    if (!doc.exists) {
      return res
        .status(404)
        .json({ message: `Driver with ID ${driverId} not found.` });
    }
    const driverData = doc.data();
    // ----------------------------------------

    // Update the document
    await docRef.update({ status: "rejected" });

    // --- Send Email ---
    const subject = "Driver Application Update – Route46 Couriers";

const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Application Update – Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }

        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }

        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .mobile-padding { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
        An update regarding your Route46 Couriers driver application.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">

                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Couriers</p>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #134467;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                <!-- Heading -->
                                <tr>
                                    <td align="center" style="padding-bottom: 28px;">
                                        <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #134467;">Application Update</h2>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td align="left" style="font-size: 15px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 14px;">Hi <strong>${driverData.firstName}</strong>,</p>
                                        <p style="margin: 0 0 14px;">
                                            Thank you for your interest in joining <strong>Route46 Couriers</strong>.
                                        </p>
                                        <p style="margin: 0 0 24px;">
                                            After reviewing your application, we regret to inform you that we are unable to proceed with your application at this time.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- What This Means -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">What this means</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            This decision may be based on current requirements, availability, or suitability for our network at this stage.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Future Opportunities -->
                                <tr>
                                    <td align="left" style="padding-bottom: 28px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Future Opportunities</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            You are welcome to reapply in the future as our network continues to grow and requirements may change.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Sign-off -->
                                <tr>
                                    <td align="left" style="font-size: 14px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 18px;">
                                            We appreciate the time you took to apply and wish you all the best.
                                        </p>
                                        <p style="margin: 0;">
                                            Kind regards,<br/>
                                            <strong>Route46 Couriers Team</strong><br/>
                                            <a href="mailto:drivers@route46couriers.co.uk" style="color: #48AEDD; text-decoration: none;">
                                                drivers@route46couriers.co.uk
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; border-top: 1px solid #eee; line-height: 1.7; margin-top: 20px;">
                            <strong style="color: #134467;">Route46 Couriers</strong><br/>
                            A trading brand of FourSix46&reg; Global Ltd<br/>
                            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
                            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    // Send email and wait
    const emailOk = await sendApplicationEmail(
      driverData.email,
      driverData.firstName,
      subject,
      htmlContent,
      'driver'
    );
    if (!emailOk) {
      return res.status(502).json({
        message: `Driver ${driverId} rejected, but email failed to send.`,
      });
    }
    // ------------------

    res
      .status(200)
      .json({ message: `Driver ${driverId} rejected successfully.` });
  } catch (error) {
    console.error(`Error rejecting driver ${req.params.id}: `, error);
    res.status(500).json({ message: "Something went wrong while rejecting." });
  }
});

/**
 * @route   GET /api/businesses/lookup/:registrationNumber
 * @desc    Lookup a business by registration number (used by client to pre-fill company details)
 */
app.get("/api/businesses/lookup/:registrationNumber", async (req, res) => {
  try {
    // Decode and trim the registration number from URL parameter
    const reg = decodeURIComponent(req.params.registrationNumber).trim();
    if (!reg)
      return res
        .status(400)
        .json({ message: "Registration number is required." });

    const businessesRef = db.collection("businesses");

    // Try exact match first (case-sensitive)
    let snapshot = await businessesRef
      .where("registrationNumber", "==", reg)
      .limit(1)
      .get();

    // If no exact match, try case-insensitive by getting all and filtering
    // Note: Firestore doesn't support case-insensitive queries directly
    if (snapshot.empty) {
      // Get all businesses and filter client-side (for small datasets)
      // For production, consider storing a lowercase version of registrationNumber
      const allBusinesses = await businessesRef.get();
      const matchingDoc = allBusinesses.docs.find((doc) => {
        const regNum = doc.data().registrationNumber;
        return regNum && regNum.trim().toLowerCase() === reg.toLowerCase();
      });

      if (matchingDoc) {
        const data = matchingDoc.data();
        return res.status(200).json({ id: matchingDoc.id, ...data });
      }

      return res.status(404).json({ message: "Business not found." });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return res.status(200).json({ id: doc.id, ...data });
  } catch (error) {
    console.error("Error looking up business:", error);
    res.status(500).json({ message: "Error looking up business" });
  }
});


/**
 * @route   POST /api/businesses/:id/approve
 * @desc    Approves a business registration AND sends email
 */
app.post("/api/businesses/:id/approve", async (req, res) => {
  try {
    const businessId = req.params.id;
    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required." });
    }

    const docRef = db.collection("businesses").doc(businessId);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res
        .status(404)
        .json({ message: `Business with ID ${businessId} not found.` });
    }
    const businessData = doc.data();

    await docRef.update({ status: "approved" });

    // Send Email
    const subject = "Application Approved – Next Steps | Route46 Couriers";
const apiUrl = process.env.VITE_API_URL || process.env.API_URL || "http://localhost:5000";

const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Approved – Next Steps | Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }

        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }

        .step-circle {
            background-color: #E53935;
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            text-align: center;
            line-height: 32px;
            font-weight: bold;
            font-size: 16px;
            display: inline-block;
        }

        ul.content-list { margin: 0 0 15px 0; padding-left: 20px; font-size: 14px; color: #666666; line-height: 1.6; }
        ul.content-list li { margin-bottom: 5px; }

        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .mobile-padding { padding: 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
        Your Route46 Couriers application has been approved. Complete your onboarding steps to activate your account.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">

                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Couriers</p>
                        </td>
                    </tr>

                    <!-- Approval Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #134467;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 25px;">
                                        <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #134467;">Application Approved</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="font-size: 15px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 14px;">Hi <strong>${businessData.companyName || businessData.contactFirstName}</strong>,</p>
                                        <p style="margin: 0 0 14px;">We're pleased to inform you that your application to work with <strong>Route46 Couriers</strong> has been approved.</p>
                                        <p style="margin: 0;">You can now proceed with the final onboarding steps to begin using our courier network.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- Next Steps / Documents Section -->
                    <tr>
                        <td class="card" style="padding: 0; background-color: #ffffff; overflow: hidden;">

                            <!-- Section Header -->
                            <div style="background-color: #F5EB18; padding: 15px 30px;">
                                <h3 style="margin: 0; color: #134467; font-size: 18px; font-weight: 700; text-transform: uppercase;">Next Steps (Required)</h3>
                            </div>

                            <div style="padding: 30px;" class="mobile-padding">
                                <p style="margin: 0 0 6px; font-size: 15px; color: #555;">Please review and complete the following documents, which are <strong>attached to this email</strong>:</p>

                                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

                                <!-- Step 1: Documents to Sign -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td valign="top" width="50" style="padding-right: 15px;">
                                            <div class="step-circle">1</div>
                                        </td>
                                        <td valign="top">
                                            <h4 style="margin: 0 0 8px; font-size: 16px; color: #134467;">Documents to Sign</h4>
                                            <ul class="content-list">
                                                <li><strong>Shipper Agreement</strong></li>
                                                <li><strong>Shipper Policy Acknowledgement</strong></li>
                                            </ul>
                                            <p style="margin: 0; font-size: 14px; color: #555; background: #f8fafc; border-left: 3px solid #48AEDD; padding: 10px 14px; border-radius: 4px;">
                                                Please sign these documents and <strong>reply to this email with the signed copies</strong>.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- How to Sign Section -->
                    <tr>
                        <td class="card" style="padding: 0; background-color: #ffffff; overflow: hidden;">

                            <div style="background-color: #48AEDD; padding: 15px 30px;">
                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; text-transform: uppercase;">How to Sign Easily</h3>
                            </div>

                            <div style="padding: 30px;" class="mobile-padding">
                                <p style="margin: 0 0 20px; font-size: 15px; color: #555555;">You can sign the PDFs directly on your phone:</p>

                                <!-- iPhone -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                    <tr>
                                        <td valign="top" width="80" style="padding-right: 15px;">
                                            <div style="background-color: #E53935; color: #ffffff; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; font-weight: bold; font-size: 24px;">📱</div>
                                        </td>
                                        <td valign="top">
                                            <h4 style="margin: 0 0 8px; font-size: 16px; color: #134467; font-weight: 700;">iPhone:</h4>
                                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">Open PDF → Share → Markup → Add Signature → Save</p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Android -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                    <tr>
                                        <td valign="top" width="80" style="padding-right: 15px;">
                                            <div style="background-color: #48AEDD; color: #ffffff; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; font-weight: bold; font-size: 24px;">📱</div>
                                        </td>
                                        <td valign="top">
                                            <h4 style="margin: 0 0 8px; font-size: 16px; color: #134467; font-weight: 700;">Android:</h4>
                                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">Open in Google Drive → "Fill &amp; Sign" → Add Signature → Save</p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Desktop -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px dashed #eeeeee; padding-top: 20px;">
                                    <tr>
                                        <td valign="top" width="80" style="padding-right: 15px;">
                                            <div style="background-color: #F5EB18; color: #134467; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; font-weight: bold; font-size: 24px;">💻</div>
                                        </td>
                                        <td valign="top">
                                            <h4 style="margin: 0 0 8px; font-size: 16px; color: #134467; font-weight: 700;">Desktop:</h4>
                                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">Open in Adobe Reader → "Fill &amp; Sign" → Add Signature</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- What Happens After Submission -->
                    <tr>
                        <td class="card" style="padding: 0; background-color: #ffffff; overflow: hidden;">

                            <div style="background-color: #134467; padding: 15px 30px;">
                                <h3 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 700; text-transform: uppercase;">What Happens After Submission</h3>
                            </div>

                            <div style="padding: 30px;" class="mobile-padding">
                                <p style="margin: 0 0 14px; font-size: 15px; color: #555;">Once we receive your signed documents:</p>
                                <ul class="content-list">
                                    <li>Your account will be fully activated</li>
                                    <li>You will be able to request and manage deliveries</li>
                                    <li>Our team may assist you with your initial bookings if required</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Spacer -->
                    <tr><td height="30"></td></tr>

                    <!-- About Route46 + Contact Card -->
                    <tr>
                        <td class="card" style="padding: 30px; background-color: #134467; border-radius: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <p style="margin: 0 0 4px; font-size: 13px; font-weight: 700; color: #48AEDD; text-transform: uppercase; letter-spacing: 0.5px;">About Route46</p>
                                        <p style="margin: 0; font-size: 14px; color: #cbd5e1; line-height: 1.7;">
                                            Route46 Couriers operates through a nationwide courier network, providing access to thousands of verified drivers and flexible delivery solutions across the UK.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                                        <p style="margin: 0 0 8px; font-size: 14px; color: #ffffff;">
                                            If you have any questions during onboarding, please reply to this email and our team will assist you.
                                        </p>
                                        <a href="mailto:shippers@route46couriers.co.uk" style="color: #F5EB18; font-weight: bold; text-decoration: none; border-bottom: 1px solid #F5EB18; font-size: 15px;">shippers@route46couriers.co.uk</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Sign-Off -->
                    <tr>
                        <td style="padding: 30px 20px 10px; text-align: center;">
                            <p style="margin: 0 0 6px; font-size: 16px; color: #134467; font-weight: bold;">We look forward to supporting your delivery requirements.</p>
                            <p style="margin: 0 0 16px; font-size: 15px; color: #555;">Kind regards,<br/><strong>Route46 Couriers Team</strong></p>
                            <a href="mailto:shippers@route46couriers.co.uk" style="color: #48AEDD; font-size: 14px; text-decoration: none;">shippers@route46couriers.co.uk</a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; border-top: 1px solid #eee; line-height: 1.7;">
                            <strong style="color: #134467;">Route46 Couriers</strong><br/>
                            A trading brand of FourSix46&reg; Global Ltd<br/>
                            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
                            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    const emailOk = await sendApplicationEmail(
      businessData.contactEmail,
      businessData.contactFirstName,
      subject,
      htmlContent,
      'shipper',
      [
    {
      filename: "Shipper Agreement.pdf",
      path: path.join(docsBase, "ROUTE46 COURIERS – SHIPPER AGREEMENT.pdf"),
      contentType: "application/pdf",
    },
    {
      filename: "Shipper Policy Acknowledgement.pdf",
      path: path.join(docsBase, "ROUTE46 COURIERS – SHIPPER POLICY ACKNOWLEDGEMENT.pdf"),
      contentType: "application/pdf",
    },
  ]
    );
    if (!emailOk) {
      return res.status(502).json({
        message: `Business ${businessId} approved, but email failed to send.`,
      });
    }

    res
      .status(200)
      .json({ message: `Business ${businessId} approved successfully.` });
  } catch (error) {
    console.error(`Error approving business ${req.params.id}:`, error);
    res.status(500).json({ message: "Something went wrong while approving." });
  }
});

/**
 * @route   POST /api/businesses/:id/reject
 * @desc    Rejects a business registration AND sends email
 */
app.post("/api/businesses/:id/reject", async (req, res) => {
  try {
    const businessId = req.params.id;
    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required." });
    }

    const docRef = db.collection("businesses").doc(businessId);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res
        .status(404)
        .json({ message: `Business with ID ${businessId} not found.` });
    }
    const businessData = doc.data();

    await docRef.update({ status: "rejected" });

    // Send Email
    const subject = "Application Update – Route46 Couriers";

const htmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Update – Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }

        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }

        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .mobile-padding { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
        An update regarding your Route46 Couriers shipper application.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">

                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Couriers</p>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #134467;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                <!-- Heading -->
                                <tr>
                                    <td align="center" style="padding-bottom: 28px;">
                                        <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #134467;">Application Update</h2>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td align="left" style="font-size: 15px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 14px;">Hi <strong>${businessData.contactFirstName}</strong>,</p>
                                        <p style="margin: 0 0 14px;">
                                            Thank you for your interest in working with <strong>Route46 Couriers</strong>.
                                        </p>
                                        <p style="margin: 0 0 24px;">
                                            After reviewing your application, we regret to inform you that we are unable to proceed at this time.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- What This Means -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">What this means</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            This decision may be based on current requirements, operational considerations, or suitability for our network at this stage.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Future Opportunities -->
                                <tr>
                                    <td align="left" style="padding-bottom: 28px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Future Opportunities</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            As our network continues to expand, we may review applications again in the future. You are welcome to reapply at a later date.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Sign-off -->
                                <tr>
                                    <td align="left" style="font-size: 14px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 18px;">
                                            We appreciate your interest in Route46 Couriers and thank you for your time.
                                        </p>
                                        <p style="margin: 0;">
                                            Kind regards,<br/>
                                            <strong>Route46 Couriers Team</strong><br/>
                                            <a href="mailto:shippers@route46couriers.co.uk" style="color: #48AEDD; text-decoration: none;">
                                                shippers@route46couriers.co.uk
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; line-height: 1.7; margin-top: 20px;">
                            <strong style="color: #134467;">Route46 Couriers</strong><br/>
                            A trading brand of FourSix46&reg; Global Ltd<br/>
                            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
                            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    const emailOk = await sendApplicationEmail(
      businessData.contactEmail,
      businessData.contactFirstName,
      subject,
      htmlContent,
      'shipper'
    );
    if (!emailOk) {
      return res.status(502).json({
        message: `Business ${businessId} rejected, but email failed to send.`,
      });
    }

    res
      .status(200)
      .json({ message: `Business ${businessId} rejected successfully.` });
  } catch (error) {
    console.error(`Error rejecting business ${req.params.id}:`, error);
    res.status(500).json({ message: "Something went wrong while rejecting." });
  }
});

/**
 * @route   POST /api/contact
 * @desc    Handles contact form submissions and sends styled emails to client and owner
 */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message, senderType } = req.body || {};

    // Validate required fields
    if (!name || !email || !subject || !message || !senderType) {
      return res.status(400).json({
        message: "All fields (name, email, senderType, subject, message) are required.",
      });
    }

    // Validate senderType value
    const allowedTypes = ["Driver", "Shipper", "Customer"];
    if (!allowedTypes.includes(senderType)) {
      return res.status(400).json({
        message: "Invalid senderType. Allowed values: Driver, Shipper, Customer.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    // Determine specific support email based on sender type
    let supportEmail = "operations@route46couriers.co.uk"; // Default
    if (senderType === "Customer") supportEmail = "customers.support@foursix46.com";
    if (senderType === "Driver")   supportEmail = "drivers.support@foursix46.com";
    if (senderType === "Shipper")  supportEmail = "shippers.support@foursix46.com";

    // ─────────────────────────────────────────────────────────
    // CLIENT CONFIRMATION EMAIL
    // ─────────────────────────────────────────────────────────
    const clientHtmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We've Received Your Request – Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }
        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; margin: auto !important; }
            .mobile-padding { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <!-- Preheader -->
    <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
        We have received your request and our team will be in touch shortly.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Couriers</p>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #134467;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                <!-- Heading -->
                                <tr>
                                    <td align="center" style="padding-bottom: 28px;">
                                        <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #134467;">We've Received Your Request</h2>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td align="left" style="font-size: 15px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 14px;">Hi <strong>${name}</strong>,</p>
                                        <p style="margin: 0 0 24px;">
                                            Thank you for contacting <strong>Route46 Couriers</strong>. We have successfully received your request and our team will review your message shortly.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- What Happens Next -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">What happens next?</h3>
                                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666666; line-height: 1.9;">
                                            <li>Our team will assess your enquiry</li>
                                            <li>A response will be provided based on your request</li>
                                            <li>If required, we may contact you for additional information</li>
                                        </ul>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Response Time -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Response Time</h3>
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            We aim to respond as quickly as possible, typically within business hours.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- About Route46 -->
                                <tr>
                                    <td align="left" style="padding-bottom: 24px;">
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.7;">
                                            Route46 Couriers operates through a nationwide courier network, providing access to thousands of verified drivers and delivery solutions across the UK.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Sign-off -->
                                <tr>
                                    <td align="left" style="font-size: 14px; line-height: 1.7; color: #555555;">
                                        <p style="margin: 0 0 18px;">
                                            If your enquiry is urgent, please mention it in your reply so we can prioritise accordingly.
                                        </p>
                                        <p style="margin: 0;">
                                            Kind regards,<br/>
                                            <strong>Route46 Couriers Team</strong><br/>
                                            <a href="mailto:operations@route46couriers.co.uk" style="color: #48AEDD; text-decoration: none;">
                                                operations@route46couriers.co.uk
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; line-height: 1.7; margin-top: 20px;">
                            <strong style="color: #134467;">Route46 Couriers</strong><br/>
                            A trading brand of FourSix46&reg; Global Ltd<br/>
                            66 Paul Street, London, EC2A 4NA, United Kingdom<br/>
                            &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    // ─────────────────────────────────────────────────────────
    // ADMIN / INTERNAL NOTIFICATION EMAIL
    // ─────────────────────────────────────────────────────────
    const ownerHtmlContent = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission – Route46 Couriers</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; }
        .card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #edf2f7; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-spacing: 0;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1;">
                                <span style="color: #48AEDD;">Route</span><span style="color: #E53935;">46</span>
                            </h1>
                            <p style="margin: 5px 0 0; font-size: 12px; color: #134467; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Internal Notification</p>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td class="card" style="padding: 40px; background-color: #ffffff; border-top: 6px solid #E53935;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                <!-- Heading -->
                                <tr>
                                    <td align="center" style="padding-bottom: 28px;">
                                        <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #134467;">New Contact Form Submission</h2>
                                        <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8;">
                                            Received ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Contact Details -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Contact Details</h3>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #edf2f7;">
                                            <tr>
                                                <td style="padding: 14px 20px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #666; width: 30%;">Name</td>
                                                <td style="padding: 14px 20px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #333; font-weight: 600;">${name}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 14px 20px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #666;">Email</td>
                                                <td style="padding: 14px 20px; border-bottom: 1px solid #edf2f7;">
                                                    <a href="mailto:${email}" style="color: #48AEDD; text-decoration: none; font-size: 14px; font-weight: 600;">${email}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 14px 20px; font-size: 14px; color: #666;">Phone</td>
                                                <td style="padding: 14px 20px; font-size: 14px; color: #333; font-weight: 600;">
                                                    ${phone
                                                      ? `<a href="tel:${phone}" style="color: #48AEDD; text-decoration: none;">${phone}</a>`
                                                      : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Enquiry Type -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Enquiry Type</h3>
                                        <p style="margin: 0; font-size: 15px; color: #333; font-weight: 600; background-color: #f8fafc; padding: 12px 16px; border-radius: 6px; border: 1px solid #edf2f7;">
                                            ${subject}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Message -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
                                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #48AEDD; font-size: 14px; color: #555; line-height: 1.7; white-space: pre-wrap;">
                                            ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                                        </div>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Source Details -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 700; color: #134467; text-transform: uppercase; letter-spacing: 0.5px;">Source Details</h3>
                                        <p style="margin: 0 0 6px; font-size: 13px; color: #666;">Who Submitted</p>
                                        <p style="margin: 0; font-size: 15px; color: #ffffff; font-weight: 700; background-color: #134467; display: inline-block; padding: 6px 16px; border-radius: 20px;">
                                            ${senderType}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <hr style="border: none; border-top: 1px solid #eee; margin: 0;" />
                                    </td>
                                </tr>

                                <!-- Action Required -->
                                <tr>
                                    <td style="padding-bottom: 28px;">
                                        <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #E53935; text-transform: uppercase; letter-spacing: 0.5px;">Action Required</h3>
                                        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #555555; line-height: 1.9;">
                                            <li>Review the enquiry</li>
                                            <li>Respond to the sender if required</li>
                                            <li>Log or assign internally if needed</li>
                                        </ul>
                                    </td>
                                </tr>

                                <!-- Reply CTA -->
                                <tr>
                                    <td align="center">
                                        <a href="mailto:${email}" style="display: inline-block; background-color: #134467; color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 32px; border-radius: 8px; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
                                            Reply to ${name}
                                        </a>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 20px; color: #94a3b8; font-size: 11px; line-height: 1.7; border-top: 1px solid #eee; margin-top: 20px;">
                            <strong style="color: #134467;">Route46 Couriers</strong> – Internal Notification<br/>
                            Sent automatically by the Route46 System &middot; ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })}
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

    // Send confirmation email to the contact
    const clientEmailSent = await sendApplicationEmail(
      email,
      name,
      "We've Received Your Request – Route46 Couriers",
      clientHtmlContent,
      senderType
    );

    if (!clientEmailSent) {
      return res.status(502).json({
        message: "We received your message but failed to send a confirmation email. We'll still review it.",
      });
    }

    // Send internal alert to the correct department inbox
    let ownerEmailSent = true;
    if (supportEmail) {
      ownerEmailSent = await sendApplicationEmail(
        supportEmail,
        "Route46 Admin",
        `New Contact Form Submission – Route46 Couriers | ${senderType} – ${name}`,
        ownerHtmlContent,
        null
      );
    }

    if (!ownerEmailSent) {
      console.warn(`⚠️ Admin notification failed for contact from ${email}, but client email sent`);
    }

    return res.status(200).json({
      message: "Thank you! Your message has been received. We'll get back to you shortly.",
      submittedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({
      message: "Failed to process your message. Please try again later.",
    });
  }
});
/**
 * @route   GET /api/invoices/:reference
 * @desc    Generates and returns a PDF invoice for a booking
 */
app.get("/api/invoices/:reference", async (req, res) => {
  try {
    const reference = req.params.reference;

    if (!reference) {
      return res.status(400).json({ message: "Booking reference is required." });
    }

    // Fetch booking data from Firestore
    const bookingsRef = db.collection("bookings");
    const snapshot = await bookingsRef.where("reference", "==", reference).limit(1).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const bookingDoc = snapshot.docs[0];
    const booking = bookingDoc.data();

    // Import PDFKit
    const PDFDocument = require("pdfkit");

    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${reference}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // --- BRANDED HEADER ---
    // Define brand colors
    const brandRed = "#F81E30";      // FourSix46 red (updated to match letterhead)
    const brandCyan = "#33C3F0";     // FourSix46 cyan/blue (sky blue)
    const darkGray = "#333333";
    const mediumGray = "#666666";

    // Add large watermark logo in center + regular logo
    const logoPath = path.join(__dirname, "assets", "FourSix PNG Logo-Photoroom.png");

    if (fs.existsSync(logoPath)) {
      try {
        // Large watermark in center background (faint)
        doc.save();
        doc.opacity(0.04);  // Very faint watermark
        doc.image(logoPath, 48, 200, {
          width: 500,   // Large watermark
          height: 500
        });
        doc.restore();

        // Regular logo at top-left (LARGER SIZE)
        doc.image(logoPath, 50, 25, {
          width: 80,   // Increased from 60 to 80
          height: 80   // Increased from 60 to 80
        });
      } catch (logoError) {
        console.warn("⚠️ Could not load logo:", logoError.message);
      }
    }

    // Company name ALL IN RED (no cyan/red split)
    doc
      .fontSize(28)
      .fillColor(brandRed)
      .font("Helvetica-Bold")
      .text("FOURSIX46 COURIERS", 140, 50);

    doc
      .fontSize(10)
      .fillColor(mediumGray)
      .font("Helvetica")
      .text("THE COURIER WITH A DIFFERENCE", 0, 82, { align: "center", width: 595 });



    // "INVOICE" text - right side above invoice details
    doc
      .fontSize(24)
      .fillColor(brandRed)
      .font("Helvetica-Bold")
      .text("INVOICE", 400, 115);

    // Invoice details section - RIGHT ALIGNED properly
    doc.fontSize(9).fillColor(darkGray).font("Helvetica");
    doc.text(`Invoice Number:`, 400, 150);
    doc.font("Helvetica-Bold").text(`${reference}`, 400, 162);

    if (booking.paymentIntentId) {
      doc.fontSize(9).fillColor(darkGray).font("Helvetica");
      doc.text(`Payment Reference:`, 50, 150);
      doc.font("Helvetica-Bold").text(`${booking.paymentIntentId}`, 50, 162);
    }

    doc.fontSize(9).fillColor(darkGray).font("Helvetica").text(
      `Date: ${new Date(
        booking.createdAt?._seconds * 1000 || Date.now()
      ).toLocaleDateString("en-GB")}`,
      400,
      177
    );
    doc.text(`VAT Number: 502529223`, 400, 192);

    // Horizontal line separator
    doc
      .strokeColor(brandCyan)
      .lineWidth(3)
      .moveTo(50, 210)
      .lineTo(545, 210)
      .stroke();

    // --- CUSTOMER DETAILS ---
    doc.fontSize(12).fillColor(brandRed).font("Helvetica-Bold").text("BILLED TO:", 50, 230);
    doc.fontSize(10).fillColor(darkGray).font("Helvetica");

    const clientName =
      booking.mode === "business"
        ? booking.business?.companyName || "N/A"
        : booking.sender?.name || "N/A";
    const clientEmail =
      booking.mode === "business"
        ? booking.business?.contactEmail || booking.sender?.email || "N/A"
        : booking.sender?.email || "N/A";
    const clientPhone =
      booking.mode === "business"
        ? booking.business?.contactPhone || booking.sender?.phone || "N/A"
        : booking.sender?.phone || "N/A";

    doc.text(clientName, 50, 250);
    doc.text(`Email: ${clientEmail}`, 50, 265);
    doc.text(`Phone: ${clientPhone}`, 50, 280);

    // --- DELIVERY DETAILS ---
    doc.fontSize(12).fillColor(brandRed).font("Helvetica-Bold").text("DELIVERY DETAILS:", 300, 230);
    doc.fontSize(10).fillColor(darkGray).font("Helvetica");
    doc.text(`Service: ${booking.delivery?.service || "N/A"}`, 300, 250);
    doc.text(`Pickup: ${booking.delivery?.pickupAddress || "N/A"}`, 300, 265, {
      width: 245,
    });
    doc.text(`Drop-off: ${booking.delivery?.dropoffAddress || "N/A"}`, 300, 290, {
      width: 245,
    });
    doc.text(
      `Distance: ${booking.delivery?.distance || "N/A"} miles`,
      300,
      315
    );

    // --- PARCEL DETAILS TABLE ---
    const tableTop = 345;
    doc.fontSize(12).fillColor(brandRed).font("Helvetica-Bold").text("PARCEL DETAILS:", 50, tableTop);

    // Table header - FIXED: Use black text on cyan background for visibility
    const itemY = tableTop + 25;
    doc.rect(50, itemY, 495, 25).fill(brandCyan);
    doc.fontSize(10).fillColor("#000000").font("Helvetica-Bold");  // BLACK text for visibility
    doc.text("Item", 60, itemY + 8);
    doc.text("Dimensions (L x W x H)", 200, itemY + 8);
    doc.text("Weight", 400, itemY + 8);

    // Table rows
    let currentY = itemY + 25;
    doc.fillColor(darkGray).font("Helvetica");

    if (Array.isArray(booking.parcels) && booking.parcels.length > 0) {
      booking.parcels.forEach((parcel, index) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        const rowColor = index % 2 === 0 ? "#F0F8FF" : "#FFFFFF";  // Light blue alternating
        doc.rect(50, currentY, 495, 25).fill(rowColor);
        doc.fillColor(darkGray);
        doc.text(`Parcel ${index + 1}`, 60, currentY + 8);
        doc.text(
          `${parcel.length || 0} x ${parcel.width || 0} x ${parcel.height || 0} cm`,
          200,
          currentY + 8
        );
        doc.text(`${parcel.weight || 0} kg`, 400, currentY + 8);
        currentY += 25;
      });
    } else {
      doc.rect(50, currentY, 495, 25).fill("#F0F8FF");
      doc.text("No parcel details provided", 60, currentY + 8);
      currentY += 25;
    }

    // Special instructions if any
    if (booking.delivery?.specialInstructions) {
      currentY += 15;
      doc.fontSize(10).fillColor(brandRed).font("Helvetica-Bold").text("Special Instructions:", 50, currentY);
      currentY += 15;
      doc.fontSize(9).fillColor(mediumGray).font("Helvetica").text(
        booking.delivery.specialInstructions,
        50,
        currentY,
        { width: 495 }
      );
      currentY += 30;
    } else {
      currentY += 15;
    }

    // --- PRICING SUMMARY ---
    currentY += 20;
    doc
      .strokeColor(brandCyan)
      .lineWidth(2)
      .moveTo(50, currentY)
      .lineTo(545, currentY)
      .stroke();

    currentY += 20;
    doc.fontSize(12).fillColor(brandRed).font("Helvetica-Bold").text("PRICING SUMMARY:", 350, currentY);
    currentY += 25;

    const finalPrice = Number(booking.pricing?.finalPrice || 0);
    const vatPercent = Number(booking.pricing?.vatPercent || 0);
    const vatRate = vatPercent / 100;
    let subtotal = booking.pricing?.subtotal || 0;
    let vatAmount = booking.pricing?.vatAmount || 0;

    // Calculate if not provided
    if ((!subtotal || Number(subtotal) === 0) && vatRate) {
      subtotal = Math.round((finalPrice / (1 + vatRate)) * 100) / 100;
    }
    if ((!vatAmount || Number(vatAmount) === 0) && vatRate) {
      vatAmount = Math.round((finalPrice - Number(subtotal)) * 100) / 100;
    }

    subtotal = Number(subtotal || 0);
    vatAmount = Number(vatAmount || 0);

    // Discount line if applicable
    if (booking.pricing?.discountApplied) {
      doc.fontSize(10).fillColor("#28A745");
      doc.text("Discount Applied:", 350, currentY);
      doc.text(`${booking.pricing.discountApplied}%`, 480, currentY, {
        align: "right",
      });
      currentY += 20;
    }

    doc.fillColor(darkGray).font("Helvetica");
    doc.text("Subtotal (excl. VAT):", 350, currentY);
    doc.text(`£${subtotal.toFixed(2)}`, 480, currentY, { align: "right" });
    currentY += 20;

    doc.text(`VAT (${vatPercent}%):`, 350, currentY);
    doc.text(`£${vatAmount.toFixed(2)}`, 480, currentY, { align: "right" });
    currentY += 20;

    // Total line
    doc
      .strokeColor(brandCyan)
      .lineWidth(2)
      .moveTo(340, currentY)
      .lineTo(545, currentY)
      .stroke();
    currentY += 15;

    doc.fontSize(14).fillColor(brandRed).font("Helvetica-Bold");
    doc.text("TOTAL:", 350, currentY);
    doc.fontSize(20).text(`£${finalPrice.toFixed(2)}`, 480, currentY, {
      align: "right",
    });

    // --- BRANDED FOOTER ---
    // Adjusted footer position to ensure all content fits on one page
    const footerY = 720;  // Changed from 750 to 720 to fit on first page



    doc
      .strokeColor(brandCyan)
      .lineWidth(2)
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .stroke();

    // Footer in BOLD BLACK
    doc.fontSize(8).fillColor("#000000").font("Helvetica-Bold");
    doc.text(
      "FourSix46® Global Ltd, CRN: 16712658, Cardiff, United Kingdom",
      50,
      footerY + 10,
      { align: "center", width: 495 }
    );
    doc.text(
      "Phone: +44 7393363802, Email: info@foursix46.com",
      50,
      footerY + 22,
      { align: "center", width: 495 }
    );
    doc.fontSize(7).fillColor("#000000");
    doc.text(
      `© ${new Date().getFullYear()} FourSix46 - THE COURIER WITH A DIFFERENCE`,
      50,
      footerY + 34,
      { align: "center", width: 495 }
    );

    // Finalize PDF
    doc.end();

    console.log(`✅ Invoice generated for booking: ${reference}`);
  } catch (error) {
    console.error("Error generating invoice:", error);
    return res.status(500).json({
      message: "Failed to generate invoice.",
      error: error.message,
    });
  }
});

// POST /api/payments/confirm-payment (frontend calls this)
app.post('/api/payments/confirm-payment', async (req, res) => {
  try {
    const { bookingId, sessionId } = req.body;
    if (!bookingId || !sessionId) {
      return res.status(400).json({ message: 'Missing bookingId or sessionId' });
    }

    const docRef = db.collection('bookings').doc(bookingId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // ✅ IDEMPOTENCY CHECK — if already confirmed, skip silently
    if (doc.data()?.status === 'confirmed') {
      return res.status(200).json({ message: 'Already confirmed', bookingId });
    }

    // Verify session with Stripe before updating (important!)
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    await docRef.update({
      status: 'confirmed',
      stripePaymentIntentId: session.payment_intent,
      stripeSessionId: sessionId,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: 'Booking confirmed', bookingId });
  } catch (error) {
    console.error('confirm-payment error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});
/**
 * @route POST /api/services
 * Create new service
 */
app.post("/api/services", async (req, res) => {
  try {

    const service = req.body;

    if (!service.name || !service.slug) {
      return res.status(400).json({
        message: "Name and slug are required"
      });
    }

    // slug uniqueness check
    const existing = await db
      .collection("services")
      .where("slug", "==", service.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        message: "Slug already exists"
      });
    }

    // publish validation
    if (service.status === "published") {

      const missing = [];

      if (!service.heroTitle) missing.push("heroTitle");
      if (!service.seoTitle) missing.push("seoTitle");
      if (!service.seoDescription) missing.push("seoDescription");

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish service",
          missingFields: missing
        });
      }
    }

    const docRef = await db.collection("services").add({
      ...service,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: "Service created",
      id: docRef.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error creating service"
    });

  }
});
/**
 * GET service by slug
 */
app.get("/api/services/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const snapshot = await db
      .collection("services")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const doc = snapshot.docs[0];

    res.json({
      id: doc.id,
      ...doc.data(),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
app.put("/api/services/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const docRef = db.collection("services").doc(id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    const existingData = existingDoc.data();

    const updatedData = {
      ...existingData,
      ...req.body
    };

    /* ==============================
       SLUG UNIQUENESS CHECK
    ============================== */

    if (req.body.slug && req.body.slug !== existingData.slug) {

      const duplicate = await db
        .collection("services")
        .where("slug", "==", req.body.slug)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        return res.status(400).json({
          message: "Slug already exists"
        });
      }

    }

    /* ==============================
       PREVENT INVALID PUBLISH
    ============================== */

    if (updatedData.status === "published") {

      const missing = [];

      if (!updatedData.heroTitle) missing.push("heroTitle");
      if (!updatedData.seoTitle) missing.push("seoTitle");
      if (!updatedData.seoDescription) missing.push("seoDescription");

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish service. Missing required fields.",
          missingFields: missing
        });
      }

    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: "Service updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed"
    });

  }
});
app.delete("/api/services/:id", async (req, res) => {
  try {
    await db.collection("services").doc(req.params.id).delete();

    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/**
 * POST /api/sectors
 * Create sector automatically from CMS
 */
app.post("/api/sectors", async (req, res) => {
  try {

    const sector = req.body;

    if (!sector.name || !sector.slug) {
      return res.status(400).json({
        message: "Name and slug required"
      });
    }

    const existing = await db
      .collection("sectors")
      .where("slug", "==", sector.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        message: "Slug already exists"
      });
    }

    if (sector.status === "published") {

      const missing = [];

      if (!sector.heroTitle) missing.push("heroTitle");
      if (!sector.seoTitle) missing.push("seoTitle");
      if (!sector.seoDescription) missing.push("seoDescription");

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish sector",
          missingFields: missing
        });
      }
    }

    const docRef = await db.collection("sectors").add({
      ...sector,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: "Sector created",
      id: docRef.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error creating sector"
    });

  }
});
/**
 * GET all published sectors
 */
app.get("/api/sectors", async (req, res) => {
  try {

    const snapshot = await db
      .collection("sectors")
      .where("status", "==", "published")
      .orderBy("sortOrder")
      .get();

    const sectors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(sectors);

  } catch (error) {
    console.error("SECTORS FETCH ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch sectors",
      error: error.message,
    });
  }
});
/**
 * GET sector by slug
 */
app.get("/api/sectors/:slug", async (req, res) => {
  try {

    const { slug } = req.params;

    const snapshot = await db
      .collection("sectors")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: "Sector not found"
      });
    }

    const doc = snapshot.docs[0];

    res.json({
      id: doc.id,
      ...doc.data()
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
app.put("/api/sectors/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const docRef = db.collection("sectors").doc(id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({
        message: "Sector not found"
      });
    }

    const existingData = existingDoc.data();

    const updatedData = {
      ...existingData,
      ...req.body
    };

    /* SLUG UNIQUENESS */

    if (req.body.slug && req.body.slug !== existingData.slug) {

      const duplicate = await db
        .collection("sectors")
        .where("slug", "==", req.body.slug)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        return res.status(400).json({
          message: "Slug already exists"
        });
      }

    }

    /* PREVENT INVALID PUBLISH */

    if (updatedData.status === "published") {

      const missing = [];

      if (!updatedData.heroTitle) missing.push("heroTitle");
      if (!updatedData.seoTitle) missing.push("seoTitle");
      if (!updatedData.seoDescription) missing.push("seoDescription");

      if (!updatedData.recommendedServices || updatedData.recommendedServices.length === 0) {
        missing.push("recommendedServices");
      }

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish sector. Missing required fields.",
          missingFields: missing
        });
      }

    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: "Sector updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed"
    });

  }
});
app.delete("/api/sectors/:id", async (req, res) => {
  try {
    await db
      .collection("sectors")
      .doc(req.params.id)
      .delete();

    res.json({ message: "Sector deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/locations", async (req, res) => {
  try {

    const data = req.body;

    if (!data.name || !data.slug) {
      return res.status(400).json({
        message: "Name and slug required"
      });
    }

    const existing = await db
      .collection("locations")
      .where("slug", "==", data.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        message: "Slug already exists"
      });
    }

    if (data.status === "published") {

      const missing = [];

      if (!data.heroTitle) missing.push("heroTitle");
      if (!data.seoTitle) missing.push("seoTitle");
      if (!data.seoDescription) missing.push("seoDescription");

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish location",
          missingFields: missing
        });
      }
    }

    const docRef = await db.collection("locations").add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: "Location created",
      id: docRef.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to create location"
    });

  }
});
app.get("/api/locations", async (req, res) => {
  try {
    const snapshot = await db
      .collection("locations")
      .where("status", "==", "published")
      .orderBy("sortOrder")
      .get();

    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(locations);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch locations",
      error: err.message,
    });
  }
});
app.get("/api/locations/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const snapshot = await db
      .collection("locations")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    const doc = snapshot.docs[0];

    res.json({
      id: doc.id,
      ...doc.data(),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});
app.put("/api/locations/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const docRef = db.collection("locations").doc(id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({
        message: "Location not found"
      });
    }

    const existingData = existingDoc.data();

    const updatedData = {
      ...existingData,
      ...req.body
    };

    /* SLUG UNIQUENESS */

    if (req.body.slug && req.body.slug !== existingData.slug) {

      const duplicate = await db
        .collection("locations")
        .where("slug", "==", req.body.slug)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        return res.status(400).json({
          message: "Slug already exists"
        });
      }

    }

    /* PREVENT INVALID PUBLISH */

    if (updatedData.status === "published") {

      const missing = [];

      if (!updatedData.heroTitle) missing.push("heroTitle");
      if (!updatedData.seoTitle) missing.push("seoTitle");
      if (!updatedData.seoDescription) missing.push("seoDescription");

      if (!updatedData.recommendedServices || updatedData.recommendedServices.length === 0) {
        missing.push("recommendedServices");
      }

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish location. Missing required fields.",
          missingFields: missing
        });
      }

    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: "Location updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed"
    });

  }
});
app.delete("/api/locations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .collection("locations")
      .doc(id)
      .delete();

    res.json({
      message: "Location deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
});/* =========================================
   CREATE LANDING PAGE
========================================= */
app.post("/api/location-services", async (req, res) => {
  try {

    const {
      locationSlug,
      serviceSlug,
      status = "draft"
    } = req.body;

    if (!locationSlug || !serviceSlug) {
      return res.status(400).json({
        message: "locationSlug and serviceSlug required"
      });
    }

    const uniqueKey = `${locationSlug}_${serviceSlug}`;

    const existing = await db
      .collection("locationServicePages")
      .where("uniqueKey", "==", uniqueKey)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        message: "Landing page already exists"
      });
    }

    if (status === "published") {

      const missing = [];

      if (!req.body.heroTitle) missing.push("heroTitle");
      if (!req.body.intro) missing.push("intro");
      if (!req.body.seoTitle) missing.push("seoTitle");
      if (!req.body.seoDescription) missing.push("seoDescription");

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish landing page",
          missingFields: missing
        });
      }
    }

    const docRef = await db.collection("locationServicePages").add({
      ...req.body,
      uniqueKey,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: "Landing page created",
      id: docRef.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to create landing page"
    });

  }
});


/* =========================================
   GET LANDING PAGE (STRICT RESOLUTION)
========================================= */
app.get(
  "/api/location-services/:locationSlug/:serviceSlug",
  async (req, res) => {
    try {
      const { locationSlug, serviceSlug } = req.params;

      /* ==============================
         1️⃣ Validate Location Exists
      ============================== */
      const locationSnapshot = await db
        .collection("locations")
        .where("slug", "==", locationSlug)
        .where("status", "==", "published")
        .limit(1)
        .get();

      if (locationSnapshot.empty) {
        return res.status(404).json({
          message: "Location not found"
        });
      }

      const locationDoc = locationSnapshot.docs[0];

      /* ==============================
         2️⃣ Validate Service Exists
      ============================== */
      const serviceSnapshot = await db
        .collection("services")
        .where("slug", "==", serviceSlug)
        .where("status", "==", "published")
        .limit(1)
        .get();

      if (serviceSnapshot.empty) {
        return res.status(404).json({
          message: "Service not found"
        });
      }

      const serviceDoc = serviceSnapshot.docs[0];

      /* ==============================
         3️⃣ Validate Landing Page Exists
      ============================== */
      const uniqueKey = `${locationSlug}_${serviceSlug}`;

      const landingSnapshot = await db
        .collection("locationServicePages")
        .where("uniqueKey", "==", uniqueKey)
        .where("status", "==", "published")
        .limit(1)
        .get();

      if (landingSnapshot.empty) {
        return res.status(404).json({
          message: "Landing page not found"
        });
      }

      const landingDoc = landingSnapshot.docs[0];

      /* ==============================
         4️⃣ Return Only Landing Content
      ============================== */
      res.json({
        id: landingDoc.id,
        location: {
          id: locationDoc.id,
          ...locationDoc.data()
        },
        service: {
          id: serviceDoc.id,
          ...serviceDoc.data()
        },
        ...landingDoc.data()
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to fetch landing page"
      });
    }
  }
);

/* =========================================
   UPDATE LANDING PAGE
========================================= */
app.put("/api/location-services/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const docRef = db.collection("locationServicePages").doc(id);

    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({
        message: "Landing page not found"
      });
    }

    const existingData = existingDoc.data();

    const locationSlug = req.body.locationSlug || existingData.locationSlug;
    const serviceSlug = req.body.serviceSlug || existingData.serviceSlug;

    const newUniqueKey = `${locationSlug}_${serviceSlug}`;

    /* UNIQUE LANDING PAGE CHECK */

    if (newUniqueKey !== existingData.uniqueKey) {

      const duplicate = await db
        .collection("locationServicePages")
        .where("uniqueKey", "==", newUniqueKey)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        return res.status(400).json({
          message: "Landing page already exists for this location + service"
        });
      }

    }

    const updatedData = {
      ...existingData,
      ...req.body
    };

    /* PREVENT INVALID PUBLISH */

    if (updatedData.status === "published") {

      const missing = [];

      if (!updatedData.heroTitle) missing.push("heroTitle");
      if (!updatedData.intro) missing.push("intro");
      if (!updatedData.seoTitle) missing.push("seoTitle");
      if (!updatedData.seoDescription) missing.push("seoDescription");

      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish landing page. Missing required fields.",
          missingFields: missing
        });
      }

    }

    await docRef.update({
      ...req.body,
      uniqueKey: newUniqueKey,
      updatedAt: Date.now()
    });

    res.json({
      message: "Landing page updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed"
    });

  }
});


/* =========================================
   DELETE LANDING PAGE
========================================= */
app.delete("/api/location-services/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db
      .collection("locationServicePages")
      .doc(id);

    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({
        message: "Landing page not found"
      });
    }

    await docRef.delete();

    res.json({
      message: "Landing page deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Delete failed"
    });
  }
});
app.get('/sitemap.xml', async (req, res) => {
  try {
    const BASE_URL = process.env.BASE_URL || 'https://www.route46couriers.co.uk';
    const today = new Date().toISOString().split('T')[0]; // 2026-04-03

    // [url, changefreq, priority]
    let urls = [
      [BASE_URL,                    'weekly',  '1.0'],
      [`${BASE_URL}/services`,      'weekly',  '0.8'],
      [`${BASE_URL}/sectors`,       'weekly',  '0.8'],
      [`${BASE_URL}/locations`,     'weekly',  '0.8'],
      [`${BASE_URL}/blog`,          'weekly',  '0.7'],
      [`${BASE_URL}/contact`,       'monthly', '0.6'],
      [`${BASE_URL}/about`,         'monthly', '0.6'],
      [`${BASE_URL}/become-driver`, 'monthly', '0.6'],
      [`${BASE_URL}/become-shipper`,'monthly', '0.6'],
    ];

    // Dynamic: Services
    const services = await db.collection('services').where('status', '==', 'published').get();
    services.forEach(doc => {
      const data = doc.data();
      if (!data.noindex) {
        const lastmod = data.updatedAt?.toDate?.()?.toISOString().split('T')[0] || today;
        urls.push([`${BASE_URL}/services/${data.slug}`, 'weekly', '0.8', lastmod]);
      }
    });

    // Dynamic: Sectors
    const sectors = await db.collection('sectors').where('status', '==', 'published').get();
    sectors.forEach(doc => {
      const data = doc.data();
      if (!data.noindex) {
        const lastmod = data.updatedAt?.toDate?.()?.toISOString().split('T')[0] || today;
        urls.push([`${BASE_URL}/sectors/${data.slug}`, 'weekly', '0.7', lastmod]);
      }
    });

    // Dynamic: Locations
    const locations = await db.collection('locations').where('status', '==', 'published').get();
    locations.forEach(doc => {
      const data = doc.data();
      if (!data.noindex) {
        const lastmod = data.updatedAt?.toDate?.()?.toISOString().split('T')[0] || today;
        urls.push([`${BASE_URL}/locations/${data.slug}`, 'weekly', '0.7', lastmod]);
      }
    });

    // Dynamic: Location+Service Landing Pages
    const landings = await db.collection('locationServicePages').where('status', '==', 'published').get();
    landings.forEach(doc => {
      const data = doc.data();
      if (!data.noindex) {
        const lastmod = data.updatedAt ? new Date(data.updatedAt).toISOString().split('T')[0] : today;
        urls.push([`${BASE_URL}/locations/${data.locationSlug}/${data.serviceSlug}`, 'weekly', '0.6', lastmod]);
      }
    });

    // Dynamic: Blog Posts
    const blogPosts = await db.collection('blogPosts').where('status', '==', 'published').get();
    blogPosts.forEach(doc => {
      const data = doc.data();
      if (!data.noindex) {
        const lastmod = data.updatedAt?.toDate?.()?.toISOString().split('T')[0] || today;
        urls.push([`${BASE_URL}/blog/${data.slug}`, 'monthly', '0.6', lastmod]);
      }
    });

    // Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, changefreq, priority, lastmod]) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod || today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache 1 hour
    res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Sitemap generation failed');
  }
});
app.post("/api/faqs", async (req, res) => {
  try {

    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer required"
      });
    }

    const docRef = await db.collection("faqs").add({
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: "FAQ created",
      id: docRef.id
    });

  } catch (err) {

    res.status(500).json({
      message: "Failed to create FAQ"
    });

  }
});

/**
 * @route   POST /api/quick-quotes
 * @desc    Submit Quick Quote request
 */
app.post("/api/quick-quotes", async (req, res) => {
  try {
    const data = req.body;

    // 🔐 Required field validation
    if (
  !data.contactName || !data.contactEmail || !data.contactPhone ||
  !data.pickupName || !data.pickupPostcode || !data.pickupDate ||
  !data.pickupFrom || !data.pickupTo ||
  !data.dropName || !data.dropPostcode || !data.dropDate ||
  !data.distanceMiles || !data.jobDescription || !data.suggestedVehicle
) {
  return res.status(400).json({ message: "Missing required fields." });
}


    if (!data.asap && !data.dropTime) {
      return res.status(400).json({
        message: "Drop time required or select ASAP.",
      });
    }

    // 🔹 Build record
    // Replace the existing drop block inside POST /api/quick-quotes
const quickQuote = {
  contact: {
    name: data.contactName,
    email: data.contactEmail,
    phone: data.contactPhone,
  },
  pickup: {
    name: data.pickupName,
    postcode: data.pickupPostcode,
    date: data.pickupDate,
    timeFrom: data.pickupFrom,
    timeTo: data.pickupTo,
  },
  drop: {
    name: data.dropName,
    postcode: data.dropPostcode,
    date: data.dropDate,
    time: data.asap ? "ASAP" : data.dropTime,
  },
  distanceMiles: Number(data.distanceMiles),
  jobDescription: data.jobDescription,
  suggestedVehicle: data.suggestedVehicle,
  notes: data.notes || "",
  status: "new",
  adminPriceQuote: null,
  adminNotes: null,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};


    const docRef = await db.collection("quickQuotes").add(quickQuote);

    // ---------------- EMAIL TO ADMIN ----------------

    // ---------------- EMAIL TO ADMIN ----------------

const submittedAt = new Date().toLocaleString("en-GB", {
  timeZone: "Europe/London",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const subject = `New Quote Request – Route46 Couriers`;

const ownerHtml = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;">

  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    New quote request received from ${quickQuote.contact.name}. Check the backend for full details.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="border-spacing:0;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin:0;font-size:34px;font-weight:900;letter-spacing:-1px;line-height:1;">
                <span style="color:#48AEDD;">Route</span><span style="color:#E53935;">46</span>
              </h1>
              <p style="margin:4px 0 0;font-size:11px;color:#134467;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Couriers</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:12px;border-top:6px solid #134467;border:1px solid #edf2f7;box-shadow:0 4px 20px rgba(0,0,0,0.05);padding:36px 40px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">

                <!-- Badge + Heading -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <span style="display:inline-block;background:#FFF3CD;color:#856404;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 10px;border-radius:20px;margin-bottom:12px;">
                      Internal Notification
                    </span>
                    <h2 style="margin:0;font-size:20px;font-weight:800;color:#134467;">New Quote Request</h2>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding-bottom:20px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"/></td></tr>

                <!-- Contact Details -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#134467;text-transform:uppercase;letter-spacing:0.5px;">Contact</p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;width:120px;">Name</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.contact.name}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Phone</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.contact.phone}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Email</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.contact.email}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding-bottom:20px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"/></td></tr>

                <!-- Job Details -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#134467;text-transform:uppercase;letter-spacing:0.5px;">Job Details</p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;width:120px;">Pickup</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.pickup.name} &mdash; ${quickQuote.pickup.postcode}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Drop</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.drop.name} &mdash; ${quickQuote.drop.postcode}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Distance</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.distanceMiles} miles</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Pickup Date</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.pickup.date} &nbsp;(${quickQuote.pickup.timeFrom} – ${quickQuote.pickup.timeTo})</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Drop Time</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.drop.date} &nbsp;${quickQuote.drop.time}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Vehicle</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.suggestedVehicle}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;">Service</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.jobDescription}</td>
                      </tr>
                      ${quickQuote.notes ? `
                      <tr>
                        <td style="font-size:13px;color:#555;padding:4px 0;vertical-align:top;">Notes</td>
                        <td style="font-size:13px;color:#222;">${quickQuote.notes}</td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="padding-bottom:20px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"/></td></tr>

                <!-- Submitted At -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size:13px;color:#555;width:120px;">Submitted At</td>
                        <td style="font-size:13px;color:#222;font-weight:600;">${submittedAt}</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#555;padding-top:4px;">Quote ID</td>
                        <td style="font-size:13px;color:#48AEDD;font-weight:600;font-family:monospace;padding-top:4px;">${docRef.id}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Note -->
                <tr>
                  <td style="background:#f0f7ff;border-radius:8px;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#134467;font-weight:600;">
                      Please check the backend for full details and follow up.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px;font-size:11px;color:#94a3b8;line-height:1.7;">
              <strong style="color:#134467;">Route46 Couriers</strong> – Internal Notification<br/>
              A trading brand of FourSix46&reg; Global Ltd &nbsp;&bull;&nbsp; 66 Paul Street, London, EC2A 4NA<br/>
              &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// FIXED — correct recipient + simplified template
const QUOTES_EMAIL = "quotes@route46couriers.co.uk";

const quoteSubject = `New Quote Request`;

const quoteHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Tahoma,Verdana,sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding:40px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="560" style="background:#fff;border-radius:10px;border-top:4px solid #134467;border:1px solid #edf2f7;box-shadow:0 4px 16px rgba(0,0,0,0.05);">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:28px 40px 0;">
              <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:-1px;line-height:1;">
                <span style="color:#48AEDD;">Route</span><span style="color:#E53935;">46</span>
              </h1>
              <p style="margin:4px 0 0;font-size:11px;color:#134467;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Couriers</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 40px 32px;">

              <!-- Badge -->
              <span style="display:inline-block;background:#FFF3CD;color:#856404;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:4px 12px;border-radius:20px;margin-bottom:16px;">
                Internal Notification
              </span>

              <h2 style="margin:0 0 6px;font-size:19px;font-weight:800;color:#134467;">New Quote Request</h2>
              <p style="margin:0 0 24px;font-size:13px;color:#94a3b8;">New quote request received.</p>

              <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">

              <!-- Details -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size:13px;color:#555;padding:5px 0;width:130px;">Name</td>
                  <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.contact.name}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#555;padding:5px 0;">Phone</td>
                  <td style="font-size:13px;color:#222;font-weight:600;">${quickQuote.contact.phone}</td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size:13px;color:#555;padding:5px 0;width:130px;">Submitted At</td>
                  <td style="font-size:13px;color:#222;font-weight:600;">${submittedAt}</td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">

              <!-- CTA note -->
              <div style="background:#f0f7ff;border-radius:8px;padding:14px 16px;">
                <p style="margin:0;font-size:13px;color:#134467;font-weight:600;">
                  Please check the backend for full details and follow up.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:0 20px 24px;font-size:11px;color:#94a3b8;line-height:1.7;">
              <strong style="color:#134467;">Route46 Couriers</strong> – Internal Notification<br/>
              A trading brand of FourSix46&reg; Global Ltd &nbsp;&bull;&nbsp; 66 Paul Street, London, EC2A 4NA<br/>
              &copy; ${new Date().getFullYear()} FourSix46 Global Ltd. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

await sendApplicationEmail(QUOTES_EMAIL, "Route46 Quotes Team", quoteSubject, quoteHtml, "booking");

    res.status(201).json({
      message: "Quick quote submitted successfully.",
      id: docRef.id,
    });

  } catch (error) {
    console.error("Quick Quote Error:", error);
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});
/**
 * @route POST /api/payments/create-checkout-session
 * @desc Create Stripe checkout session for manual payment page
 */app.post("/api/payments/create-checkout-session", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      netAmount,
      reference,
      linkedQuoteId
    } = req.body;

    // ================= VALIDATION =================

    if (!name || !email || !netAmount || !reference) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (Number(netAmount) < 1) {
      return res.status(400).json({ message: "Minimum amount is £1" });
    }

    // ================= VAT CALCULATION =================

    const net = Number(netAmount);
    const vat = Number((net * 0.2).toFixed(2));
    const total = Number((net + vat).toFixed(2));
    const totalPence = Math.round(total * 100);

    if (!totalPence || totalPence < 100) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // ================= CREATE FIRESTORE RECORD =================

    const paymentRef = await db.collection("payments").add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      name,
      email,
      phone: phone || "",
      reference,
      netAmount: net,
      vatAmount: vat,
      totalAmount: total,
      currency: "GBP",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      status: "pending",
      linkedQuoteId: linkedQuoteId || null
    });

    // ================= CREATE STRIPE SESSION =================

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "FourSix46 Payment",
            },
            unit_amount: totalPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        paymentId: paymentRef.id,
        name,
        email,
        reference,
        netAmount: net.toString(),
        vatAmount: vat.toString(),
        totalAmount: total.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pay/cancel`,
    });

    // ================= UPDATE RECORD WITH SESSION ID =================

    await paymentRef.update({
      stripeSessionId: session.id
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Payment session error:", error);
    res.status(500).json({ message: "Payment creation failed" });
  }
});

app.get("/api/payments/:id", async (req, res) => {
  const doc = await db.collection("payments").doc(req.params.id).get();

  if (!doc.exists) {
    return res.status(404).json({ message: "Payment not found" });
  }

  res.json({ id: doc.id, ...doc.data() });
});
app.get('/api/faqs', async (req, res) => {
  try {
    const snapshot = await db
      .collection('faqs')
      .where('status', '==', 'published')
      .get();                                  // ← no .orderBy() here

    const faqs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)); // ← sort in JS

    res.json(faqs);
  } catch (err) {
    console.error('GET /api/faqs error:', err);
    res.status(500).json({ message: 'Failed to fetch FAQs', error: err.message });
  }
});
app.get("/api/admin/services", async (req, res) => {
  try {

    const { status, search } = req.query;

    const snapshot = await db
      .collection("services")
      .orderBy("createdAt", "desc")
      .get();

    let services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (status) {
      services = services.filter(s => s.status === status);
    }

    if (search) {

      const q = search.toLowerCase();

      services = services.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
      );

    }

    res.json(services);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch services"
    });

  }
});
app.get("/api/admin/sectors", async (req, res) => {
  try {

    const { status, search } = req.query;

    const snapshot = await db
      .collection("sectors")
      .orderBy("createdAt", "desc")
      .get();

    let sectors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (status) {
      sectors = sectors.filter(s => s.status === status);
    }

    if (search) {

      const q = search.toLowerCase();

      sectors = sectors.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q)
      );

    }

    res.json(sectors);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch sectors"
    });

  }
});
app.get("/api/admin/locations", async (req, res) => {
  try {

    const { status, search } = req.query;

    const snapshot = await db
      .collection("locations")
      .orderBy("createdAt", "desc")
      .get();

    let locations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (status) {
      locations = locations.filter(l => l.status === status);
    }

    if (search) {

      const q = search.toLowerCase();

      locations = locations.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.slug?.toLowerCase().includes(q)
      );

    }

    res.json(locations);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch locations"
    });

  }
});
app.get("/api/admin/location-services", async (req, res) => {
  try {

    const { status, search } = req.query;

    const snapshot = await db
      .collection("locationServicePages")
      .orderBy("createdAt", "desc")
      .get();

    let pages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (status) {
      pages = pages.filter(p => p.status === status);
    }

    if (search) {

      const q = search.toLowerCase();

      pages = pages.filter(p =>
        p.locationSlug?.toLowerCase().includes(q) ||
        p.serviceSlug?.toLowerCase().includes(q)
      );

    }

    res.json(pages);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch landing pages"
    });

  }
});
app.get("/api/admin/faqs", async (req, res) => {
  try {

    const snapshot = await db
      .collection("faqs")
      .orderBy("createdAt", "desc")
      .get();

    const faqs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(faqs);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch faqs"
    });

  }
});
app.post("/api/bookings/notify", async (req, res) => {
  try {
    const {
      reference,
      mode,
      sender,
      business,
      recipient,
      delivery,
      pricing,
      parcels,
      paymentIntentId,
    } = req.body || {};

    if (!reference || !mode || !recipient || !delivery || !pricing) {
      return res
        .status(400)
        .json({ message: "Missing required booking data." });
    }

    const clientEmail =
      mode === "business"
        ? business?.contactEmail || sender?.email
        : sender?.email;

    if (!clientEmail) {
      return res.status(400).json({
        message: "Client email is required to send booking confirmation.",
      });
    }

    const clientName =
      mode === "business"
        ? business?.companyName || "Valued Partner"
        : sender?.name || "Valued Customer";

    const parcelsSummary =
      Array.isArray(parcels) && parcels.length > 0
        ? parcels
          .map(
            (p, index) =>
              `Parcel ${index + 1}: ${p.length ?? 0}cm x ${p.width ?? 0
              }cm x ${p.height ?? 0}cm, ${p.weight ?? 0}kg`
          )
          .join("<br />")
        : "No parcel details provided.";

    // Compute/Substitute VAT/subtotal values for email display
    const finalPrice = Number(pricing?.finalPrice ?? 0);
    const vatPercent = Number(pricing?.vatPercent ?? 0);
    const vatRate = vatPercent / 100;
    let subtotal = pricing?.subtotal;
    let vatAmount = pricing?.vatAmount;

    if ((!subtotal || Number(subtotal) === 0) && vatRate) {
      subtotal = Math.round((finalPrice / (1 + vatRate)) * 100) / 100;
    }
    if ((!vatAmount || Number(vatAmount) === 0) && vatRate) {
      vatAmount =
        Math.round((finalPrice - (Number(subtotal) || 0)) * 100) / 100;
    }

    // Fallback to safe numbers
    subtotal = Number(subtotal || 0);
    vatAmount = Number(vatAmount || 0);

    // --- CLIENT HTML (Navy Header) ---
    const clientHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f2f5; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); overflow: hidden;">
              
              <tr>
                <td align="center" style="padding: 40px 40px 30px; background-color: #134467;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">Booking Confirmed</h1>
                  <p style="margin: 10px 0 0; color: #a3cbe8; font-size: 14px;">Thank you for choosing FourSix46</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                    <tr>
                      <td valign="top">
                        <p style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">Hi ${clientName},</p>
                        <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Your booking has been successfully scheduled.</p>
                      </td>
                      <td valign="top" align="right">
                        <p style="margin: 0; font-size: 14px; color: #888;">Reference</p>
                        <p style="margin: 0; font-size: 18px; color: #134467; font-weight: bold;">${reference}</p>
                        ${paymentIntentId ? `<p style="margin: 5px 0 0; font-size: 11px; color: #999;">Payment Ref: ${paymentIntentId}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Journey Details</h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px; width: 30%;"><strong>Service:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.service || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px;"><strong>Pickup:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.pickupAddress || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px;"><strong>Drop-off:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.dropoffAddress || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px;"><strong>Distance:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.distance ?? "N/A"
      } miles</td>
                      </tr>
                      <tr>
                        <td style="color: #555; font-size: 14px;"><strong>Recipient:</strong></td>
                        <td style="color: #111; font-size: 14px;">${recipient?.name || "N/A"
      } <span style="color:#888;">(${recipient?.phone || "No phone"
      })</span></td>
                      </tr>
                    </table>
                  </div>

                  <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Items</h3>
                    <div style="background-color: #fff; border: 1px dashed #ccc; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #555; line-height: 1.6;">
                      ${parcelsSummary}
                    </div>
                  </div>

                  ${delivery.specialInstructions
        ? `
                    <div style="margin-bottom: 30px;">
                      <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Instructions</h3>
                      <p style="margin: 0; background-color: #fff8e1; color: #856404; padding: 12px; border-radius: 6px; border: 1px solid #ffeeba; font-size: 14px;">
                        ${delivery.specialInstructions}
                      </p>
                    </div>
                    `
        : ""
      }

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; border-top: 2px solid #f0f0f0;">
                    <tr>
                      <td width="40%"></td> 
                      <td width="60%">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          
                          ${pricing.discountApplied
        ? `
                          <tr>
                            <td align="right" style="padding-top: 15px; padding-bottom: 5px; color: #28a745; font-size: 14px;">Discount Applied:</td>
                            <td align="right" style="padding-top: 15px; padding-bottom: 5px; color: #28a745; font-size: 14px; font-weight: bold;">${pricing.discountApplied}%</td>
                          </tr>
                          `
        : ""
      }
                          
                          <tr>
                            <td align="right" style="padding: 5px 0; color: #666; font-size: 14px;">Subtotal (excl. VAT):</td>
                            <td align="right" style="padding: 5px 0; color: #333; font-size: 14px;">£${subtotal.toFixed(
        2
      )}</td>
                          </tr>
                          
                          <tr>
                            <td align="right" style="padding: 5px 0 15px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">VAT (${vatPercent}%):</td>
                            <td align="right" style="padding: 5px 0 15px; color: #333; font-size: 14px; border-bottom: 1px solid #eee;">£${vatAmount.toFixed(
        2
      )}</td>
                          </tr>
                          
                          <tr>
                            <td align="right" style="padding-top: 15px; color: #134467; font-size: 16px; font-weight: bold;">Total:</td>
                            <td align="right" style="padding-top: 15px; color: #134467; font-size: 24px; font-weight: bold;">£${Number(
        pricing.finalPrice ?? 0
      ).toFixed(2)}</td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <tr>
                <td align="center" style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #eee;">
                  <p style="margin: 0; color: #999; font-size: 12px;">&copy; ${new Date().getFullYear()} FourSix46. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    `;

    // --- OWNER HTML (Red Header) ---
    const ownerHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0f2f5; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); overflow: hidden;">
              
              <tr>
                <td align="center" style="padding: 40px 40px 30px; background-color: #8B0000;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">New Job Received</h1>
                  <p style="margin: 10px 0 0; color: #ffcccc; font-size: 14px;">Action Required</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                    <tr>
                      <td valign="top">
                         <span style="background-color: #fff0f0; color: #8B0000; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">${delivery.service || "N/A"
      }</span>
                      </td>
                      <td valign="top" align="right">
                        <p style="margin: 0; font-size: 14px; color: #888;">Reference</p>
                        <p style="margin: 0; font-size: 18px; color: #111; font-weight: bold;">${reference}</p>
                        ${paymentIntentId ? `<p style="margin: 5px 0 0; font-size: 11px; color: #999;">Payment Ref: ${paymentIntentId}</p>` : ''}
                      </td>
                    </tr>
                  </table>

                  <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Client Details</h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 8px; color: #555; font-size: 14px; width: 30%;"><strong>Mode:</strong></td>
                        <td style="padding-bottom: 8px; color: #111; font-size: 14px; text-transform:capitalize;">${mode}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; color: #555; font-size: 14px;"><strong>Name:</strong></td>
                        <td style="padding-bottom: 8px; color: #111; font-size: 14px;">${mode === "business"
        ? business?.companyName || "N/A"
        : sender?.name || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 8px; color: #555; font-size: 14px;"><strong>Email:</strong></td>
                        <td style="padding-bottom: 8px; color: #111; font-size: 14px;">${mode === "business"
        ? business?.contactEmail || "N/A"
        : sender?.email || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="color: #555; font-size: 14px;"><strong>Phone:</strong></td>
                        <td style="color: #111; font-size: 14px;">${mode === "business"
        ? business?.contactPhone || "N/A"
        : sender?.phone || "N/A"
      }</td>
                      </tr>
                    </table>
                  </div>

                   <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Journey Details</h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px; width: 30%;"><strong>Pickup:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.pickupAddress || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px;"><strong>Drop-off:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.dropoffAddress || "N/A"
      }</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #555; font-size: 14px;"><strong>Distance:</strong></td>
                        <td style="padding-bottom: 10px; color: #111; font-size: 14px;">${delivery.distance ?? "N/A"
      } miles</td>
                      </tr>
                      <tr>
                        <td style="color: #555; font-size: 14px;"><strong>Recipient:</strong></td>
                        <td style="color: #111; font-size: 14px;">${recipient?.name || "N/A"
      } <span style="color:#888;">(${recipient?.phone || "No phone"
      })</span></td>
                      </tr>
                    </table>
                  </div>

                  <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Items</h3>
                    <div style="background-color: #fff; border: 1px dashed #ccc; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; color: #555; line-height: 1.6;">
                      ${parcelsSummary}
                    </div>
                  </div>

                   ${delivery.specialInstructions
        ? `
                    <div style="margin-bottom: 30px;">
                      <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px;">Special Instructions</h3>
                      <p style="margin: 0; background-color: #fff8e1; color: #856404; padding: 12px; border-radius: 6px; border: 1px solid #ffeeba; font-size: 14px; font-weight: bold;">
                        ${delivery.specialInstructions}
                      </p>
                    </div>
                    `
        : ""
      }

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; border-top: 2px solid #f0f0f0;">
                    <tr>
                      <td width="40%"></td> 
                      <td width="60%">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          
                          ${pricing.discountApplied
        ? `
                          <tr>
                            <td align="right" style="padding-top: 15px; padding-bottom: 5px; color: #28a745; font-size: 14px;">Discount Applied:</td>
                            <td align="right" style="padding-top: 15px; padding-bottom: 5px; color: #28a745; font-size: 14px; font-weight: bold;">${pricing.discountApplied}%</td>
                          </tr>
                          `
        : ""
      }
                          
                          <tr>
                            <td align="right" style="padding: 5px 0; color: #666; font-size: 14px;">Subtotal (excl. VAT):</td>
                            <td align="right" style="padding: 5px 0; color: #333; font-size: 14px;">£${subtotal.toFixed(
        2
      )}</td>
                          </tr>
                          
                          <tr>
                            <td align="right" style="padding: 5px 0 15px; color: #666; font-size: 14px; border-bottom: 1px solid #eee;">VAT (${vatPercent}%):</td>
                            <td align="right" style="padding: 5px 0 15px; color: #333; font-size: 14px; border-bottom: 1px solid #eee;">£${vatAmount.toFixed(
        2
      )}</td>
                          </tr>
                          
                          <tr>
                            <td align="right" style="padding-top: 15px; color: #111; font-size: 16px; font-weight: bold;">Total Value:</td>
                            <td align="right" style="padding-top: 15px; color: #111; font-size: 24px; font-weight: bold;">£${Number(
        pricing.finalPrice ?? 0
      ).toFixed(2)}</td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;



    // --- UPDATE CLIENT EMAIL WITH INVOICE BUTTON ---
    // Get the API URL from environment variable
    const apiUrl = process.env.VITE_API_URL || process.env.API_URL || "http://localhost:5000";
    const invoiceUrl = `${apiUrl}/api/invoices/${reference}`;

    // Create updated client email with invoice button
    const clientHtmlWithInvoice = clientHtml.replace(
      '<td align="center" style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #eee;">',
      `
              <tr>
                <td align="center" style="padding: 30px 40px;">
                  <a href="${invoiceUrl}" style="display: inline-block; background: linear-gradient(135deg, #134467 0%, #48AEDD 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(19, 68, 103, 0.3); transition: transform 0.2s;">
                    📄 Download Invoice
                  </a>
                  <p style="margin: 12px 0 0; font-size: 12px; color: #888;">Click the button above to download your booking invoice</p>
                </td>
              </tr>

              <tr>
                <td align="center" style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #eee;">`
    );

    // Determine sender type based on booking mode
    const senderType = mode === "business" ? "booking" : "customer";

    const clientEmailSent = await sendApplicationEmail(
      clientEmail,
      clientName,
      `Booking Confirmation - ${reference}`,
      clientHtmlWithInvoice,
      senderType
    );

    let ownerEmailSent = true;
    if (OWNER_EMAIL) {
      ownerEmailSent = await sendApplicationEmail(
        OWNER_EMAIL,
        "FourSix46 Team",
        `New Booking Received - ${reference}`,
        ownerHtml
      );
    }

    if (!clientEmailSent || !ownerEmailSent) {
      const failedRecipients = [];
      if (!clientEmailSent) failedRecipients.push(clientEmail);
      if (!ownerEmailSent && OWNER_EMAIL) failedRecipients.push(OWNER_EMAIL);
      return res.status(502).json({
        message: "Booking saved, but some notifications failed to send.",
        failedRecipients,
      });
    }

    return res.status(200).json({ message: "Booking notifications sent." });
  } catch (error) {
    console.error("Error sending booking notification:", error);
    return res
      .status(500)
      .json({ message: "Failed to send booking notification." });
  }
});

// =============================================
// GET /api/admin/quick-quotes
// Admin: list all quick quotes with optional filter
// =============================================
app.get("/api/admin/quick-quotes", async (req, res) => {
  try {
    const { status, search } = req.query;
    const snapshot = await db
      .collection("quickQuotes")
      .orderBy("createdAt", "desc")
      .get();

    let quotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (status) {
      quotes = quotes.filter(q => q.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      quotes = quotes.filter(item =>
        item.pickup?.name?.toLowerCase().includes(q) ||
        item.pickup?.postcode?.toLowerCase().includes(q) ||
        item.drop?.name?.toLowerCase().includes(q) ||
        item.drop?.postcode?.toLowerCase().includes(q) ||
        item.jobDescription?.toLowerCase().includes(q)
      );
    }

    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quick quotes" });
  }
});

// PUT /api/admin/quick-quotes/:id — Update status / admin fields
app.put("/api/admin/quick-quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminPriceQuote, adminNotes } = req.body;

    const allowed = ["new", "contacted", "quoted", "won", "lost"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (status !== undefined)          updates.status = status;
    if (adminPriceQuote !== undefined)  updates.adminPriceQuote = adminPriceQuote === "" ? null : Number(adminPriceQuote);
    if (adminNotes !== undefined)       updates.adminNotes = adminNotes;

    const docRef = db.collection("quickQuotes").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: "Quote not found." });

    await docRef.update(updates);
    res.json({ message: "Quick quote updated.", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update quick quote." });
  }
});

// DELETE /api/admin/quick-quotes/:id — Permanently delete
app.delete("/api/admin/quick-quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("quickQuotes").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: "Quote not found." });
    await docRef.delete();
    res.json({ message: `Quick quote ${id} deleted.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete quick quote." });
  }
});


// =============================================
// GET /api/admin/payments
// Admin: list all payments ordered by creation date
// =============================================
app.get("/api/admin/payments", async (req, res) => {
  try {
    const snapshot = await db
      .collection("payments")
      .orderBy("createdAt", "desc")
      .get();

    const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

// =============================================
// DELETE /api/drivers/:id
// Admin: permanently delete a driver record
// =============================================
app.delete("/api/drivers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Driver ID is required." });

    const docRef = db.collection("drivers").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: `Driver ${id} not found.` });
    }

    await docRef.delete();
    res.json({ message: `Driver ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Failed to delete driver." });
  }
});

// =============================================
// DELETE /api/businesses/:id
// Admin: permanently delete a business record
// =============================================
app.delete("/api/businesses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Business ID is required." });

    const docRef = db.collection("businesses").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: `Business ${id} not found.` });
    }

    await docRef.delete();
    res.json({ message: `Business ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting business:", error);
    res.status(500).json({ message: "Failed to delete business." });
  }
});

// =============================================
// DELETE /api/bookings/:id
// Admin: permanently delete a booking record
// =============================================
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Booking ID is required." });

    const docRef = db.collection("bookings").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: `Booking ${id} not found.` });
    }

    await docRef.delete();
    res.json({ message: `Booking ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking." });
  }
});

// =============================================
// PUT /api/faqs/:id
// Admin: update an existing FAQ
// =============================================
app.put("/api/faqs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("faqs").doc(id);

    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      return res.status(404).json({ message: "FAQ not found." });
    }

    const { question, answer, status } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required." });
    }

    await docRef.update({
      question,
      answer,
      ...(status && { status }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: "FAQ updated successfully." });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Failed to update FAQ." });
  }
});

// =============================================
// DELETE /api/faqs/:id
// Admin: permanently delete a FAQ
// =============================================
app.delete("/api/faqs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "FAQ ID is required." });

    const docRef = db.collection("faqs").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "FAQ not found." });
    }

    await docRef.delete();
    res.json({ message: "FAQ deleted successfully." });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Failed to delete FAQ." });
  }
});

app.get("/api/services", async (req, res) => {
  try {
    const snapshot = await db
      .collection("services")
      .where("status", "==", "published")
      .orderBy("sortOrder")
      .get();

    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(services);
  } catch (error) {
    console.error("SERVICES FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch services", error: error.message });
  }
});
// GET /api/admin/drivers — List all drivers with optional status/search filter
app.get("/api/admin/drivers", async (req, res) => {
  try {
    const { status, search } = req.query;

    const snapshot = await db
      .collection("drivers")
      .orderBy("submittedAt", "desc")
      .get();

    let drivers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter by status if provided (e.g. ?status=pending)
    if (status) {
      drivers = drivers.filter((d) => d.status === status);
    }

    // Filter by search term
    if (search) {
      const q = search.toLowerCase();
      drivers = drivers.filter(
        (d) =>
          d.firstName?.toLowerCase().includes(q) ||
          d.lastName?.toLowerCase().includes(q) ||
          d.email?.toLowerCase().includes(q) ||
          d.phone?.toLowerCase().includes(q) ||
          d.vehicleType?.toLowerCase().includes(q)
      );
    }

    res.json(drivers);
  } catch (err) {
    console.error("GET /api/admin/drivers error:", err);
    res.status(500).json({ message: "Failed to fetch drivers." });
  }
});

/* =========================================
   BLOG POSTS — PUBLIC
========================================= */

/**
 * @route   GET /api/blog
 * @desc    Get all published blog posts (public, sorted by publishedDate desc)
 */
app.get("/api/blog", async (req, res) => {
  try {
    const { category, featured } = req.query;

    let query = db.collection("blogPosts").where("status", "==", "published");

    if (category) {
      query = query.where("category", "==", category);
    }

    if (featured === "true") {
      query = query.where("isFeatured", "==", true);
    }

    const snapshot = await query.get();

    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by publishedDate descending (Firestore can't combine where + orderBy without index)
    posts.sort((a, b) => {
      const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
      const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
      return dateB - dateA;
    });

    res.json(posts);
  } catch (error) {
    console.error("GET /api/blog error:", error);
    res.status(500).json({ message: "Failed to fetch blog posts", error: error.message });
  }
});

/**
 * @route   GET /api/blog/:slug
 * @desc    Get a single published blog post by slug (public)
 */
app.get("/api/blog/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const snapshot = await db
      .collection("blogPosts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });

  } catch (error) {
    console.error("GET /api/blog/:slug error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================
   BLOG POSTS — ADMIN
========================================= */

/**
 * @route   GET /api/admin/blog
 * @desc    Admin: list all blog posts (all statuses, with optional filter/search)
 */
app.get("/api/admin/blog", async (req, res) => {
  try {
    const { status, search, category } = req.query;

    const snapshot = await db
      .collection("blogPosts")
      .orderBy("createdAt", "desc")
      .get();

    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (status) {
      posts = posts.filter(p => p.status === status);
    }

    if (category) {
      posts = posts.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.authorName?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
      );
    }

    res.json(posts);
  } catch (error) {
    console.error("GET /api/admin/blog error:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});

/**
 * @route   POST /api/blog
 * @desc    Admin: create a new blog post
 */
app.post("/api/blog", async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.slug) {
      return res.status(400).json({ message: "Title and slug are required" });
    }

    // Slug uniqueness check
    const existing = await db
      .collection("blogPosts")
      .where("slug", "==", data.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // Publish validation
    if (data.status === "published") {
      const missing = validateBlogPostForPublish(data);
      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish blog post. Missing required fields.",
          missingFields: missing,
        });
      }
    }

    const docRef = await db.collection("blogPosts").add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Blog post created", id: docRef.id });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    res.status(500).json({ message: "Failed to create blog post" });
  }
});

/**
 * @route   PUT /api/blog/:id
 * @desc    Admin: update a blog post
 */
app.put("/api/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("blogPosts").doc(id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const existingData = existingDoc.data();
    const updatedData = { ...existingData, ...req.body };

    // Slug uniqueness
    if (req.body.slug && req.body.slug !== existingData.slug) {
      const duplicate = await db
        .collection("blogPosts")
        .where("slug", "==", req.body.slug)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }

    // Publish validation
    if (updatedData.status === "published") {
      const missing = validateBlogPostForPublish(updatedData);
      if (missing.length > 0) {
        return res.status(400).json({
          message: "Cannot publish blog post. Missing required fields.",
          missingFields: missing,
        });
      }
    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: "Blog post updated successfully" });
  } catch (error) {
    console.error("PUT /api/blog/:id error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

/**
 * @route   DELETE /api/blog/:id
 * @desc    Admin: permanently delete a blog post
 */
app.delete("/api/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection("blogPosts").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    await docRef.delete();
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/blog/:id error:", error);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
});

/* =========================================
   BLOG CATEGORIES
========================================= */

/**
 * @route   GET /api/blog-categories
 * @desc    Get all blog categories (public)
 */
app.get("/api/blog-categories", async (req, res) => {
  try {
    const snapshot = await db.collection("blogCategories").orderBy("name").get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (error) {
    console.error("GET /api/blog-categories error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

/**
 * @route   GET /api/admin/blog-categories
 * @desc    Admin: list all blog categories
 */
app.get("/api/admin/blog-categories", async (req, res) => {
  try {
    const snapshot = await db
      .collection("blogCategories")
      .orderBy("createdAt", "desc")
      .get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (error) {
    console.error("GET /api/admin/blog-categories error:", error);
    res.status(500).json({ message: "Failed to fetch blog categories" });
  }
});

/**
 * @route   POST /api/blog-categories
 * @desc    Admin: create a blog category
 */
app.post("/api/blog-categories", async (req, res) => {
  try {
    const { name, slug, description, seoTitle, seoDescription } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name and slug are required" });
    }

    const existing = await db
      .collection("blogCategories")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const docRef = await db.collection("blogCategories").add({
      name,
      slug,
      description: description || "",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Blog category created", id: docRef.id });
  } catch (error) {
    console.error("POST /api/blog-categories error:", error);
    res.status(500).json({ message: "Failed to create blog category" });
  }
});

/**
 * @route   PUT /api/blog-categories/:id
 * @desc    Admin: update a blog category
 */
app.put("/api/blog-categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("blogCategories").doc(id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    const existingData = existingDoc.data();

    // Slug uniqueness
    if (req.body.slug && req.body.slug !== existingData.slug) {
      const duplicate = await db
        .collection("blogCategories")
        .where("slug", "==", req.body.slug)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        return res.status(400).json({ message: "Slug already exists" });
      }
    }

    await docRef.update({
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: "Blog category updated successfully" });
  } catch (error) {
    console.error("PUT /api/blog-categories/:id error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

/**
 * @route   DELETE /api/blog-categories/:id
 * @desc    Admin: delete a blog category
 */
app.delete("/api/blog-categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection("blogCategories").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Blog category not found" });
    }

    await docRef.delete();
    res.json({ message: "Blog category deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/blog-categories/:id error:", error);
    res.status(500).json({ message: "Failed to delete blog category" });
  }
});

/* =========================================
   BLOG INDEX PAGE SETTINGS
========================================= */

const BLOG_INDEX_DOC_ID = "main";

/**
 * @route   GET /api/blog-index
 * @desc    Get blog index page CMS settings (public + admin)
 */
app.get("/api/blog-index", async (req, res) => {
  try {
    const docRef = db.collection("blogIndexPage").doc(BLOG_INDEX_DOC_ID);
    const doc = await docRef.get();

    if (!doc.exists) {
      // Return default empty structure so frontend never breaks
      return res.json({
        heroEyebrow: "Courier Insights & Delivery Guides",
        heroTitle: "Route46 Logistics Blog",
        heroSubtitle:
          "Expert articles, delivery guides, and courier insights covering same-day logistics, urgent transport, and UK-wide delivery solutions.",
        featuredPostIds: [],
        ctaTitle: "",
        ctaText: "",
        ctaButtonText: "",
        ctaButtonLink: "",
        seoTitle: "",
        seoDescription: "",
      });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("GET /api/blog-index error:", error);
    res.status(500).json({ message: "Failed to fetch blog index settings" });
  }
});

/**
 * @route   PUT /api/blog-index
 * @desc    Admin: update blog index page settings
 */
app.put("/api/blog-index", async (req, res) => {
  try {
    const docRef = db.collection("blogIndexPage").doc(BLOG_INDEX_DOC_ID);
    await docRef.set(
      {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    res.json({ message: "Blog index page settings updated successfully" });
  } catch (error) {
    console.error("PUT /api/blog-index error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ── GET /api/settings/vat ── */
app.get("/api/settings/vat", async (req, res) => {
  try {
    const snap = await db.doc("settings/vat").get();
    if (!snap.exists) return res.json({ vatEnabled: true, vatRate: 20 });
    return res.json(snap.data());
  } catch (err) {
    console.error("[VAT GET]", err);
    return res.status(500).json({ message: "Failed to load VAT settings." });
  }
});

/* ── POST /api/settings/vat ── */
app.post("/api/settings/vat", async (req, res) => {
  try {
    const { vatEnabled, vatRate } = req.body;

    if (typeof vatEnabled !== "boolean")
      return res.status(400).json({ message: "vatEnabled must be a boolean." });

    if (typeof vatRate !== "number" || vatRate < 0 || vatRate > 100)
      return res.status(400).json({ message: "vatRate must be a number between 0 and 100." });

    await db.doc("settings/vat").set(
      { vatEnabled, vatRate, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );

    return res.json({ success: true, vatEnabled, vatRate });
  } catch (err) {
    console.error("[VAT POST]", err);
    return res.status(500).json({ message: "Failed to save VAT settings." });
  }
});



// === START SERVER (Local Development Only) ===
// Only start server if not running on Vercel (serverless)
// Vercel will handle the serverless function execution
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;