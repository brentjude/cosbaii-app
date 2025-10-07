// Update: src/app/api/test-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    console.log("Testing welcome email for:", email, name);

    // ✅ Use test@resend.dev for testing (this is Resend's official test email)
    const testEmail = "test@resend.dev";

    console.log(
      `Sending test email to: ${testEmail} (originally requested for: ${email})`
    );

    const result = await sendWelcomeEmail(testEmail, name);

    console.log("Email test result:", result);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Test email sent successfully to ${testEmail}! (Original recipient: ${email})`
        : "Failed to send test email",
      error: result.error || null,
      testInfo: {
        originalEmail: email,
        testEmailUsed: testEmail,
        note: "Using Resend's official test email address for sandbox testing",
      },
    });
  } catch (error) {
    console.error("Test email error:", error);
    // ✅ Fix: Properly handle error type
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to send test email", details: errorMessage },
      { status: 500 }
    );
  }
}

// ✅ Add a GET route for quick testing without body
export async function GET() {
  try {
    console.log("Quick test email - using default values");

    const result = await sendWelcomeEmail("test@resend.dev", "Test User");

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Quick test email sent successfully to test@resend.dev!"
        : "Failed to send quick test email",
      error: result.error || null,
      testInfo: {
        recipient: "test@resend.dev",
        name: "Test User",
        note: "This is a quick test using Resend's official test email",
      },
    });
  } catch (error) {
    console.error("Quick test email error:", error);
    // ✅ Fix: Properly handle error type
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to send quick test email", details: errorMessage },
      { status: 500 }
    );
  }
}
