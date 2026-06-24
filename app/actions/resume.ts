"use server";

export async function requestResume(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const reason = formData.get("reason") as string;
  const message = formData.get("message") as string;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: "itsmedexexplorer@gmail.com",
        subject: "New Resume Request",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Resume Request</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Company:</strong> ${company || "Not provided"}</p>
              <p><strong>Reason:</strong> ${reason || "Not specified"}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f4f4f4; padding: 12px; border-radius: 6px;">${message || "No message"}</p>
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #eaeaea;" />
              <p style="color: #666;"><small>Received at ${new Date().toISOString()}</small></p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Resend error:", error);
    return { error: error.message || "Failed to send request" };
  }
}
