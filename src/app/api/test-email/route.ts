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

    const result = await sendWelcomeEmail(email, name);

    console.log("Email test result:", result);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Test email sent successfully to ${email}!`
        : "Failed to send test email",
      error: result.error || null,
    });
  } catch (error) {
    console.error("Test email error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to send test email", details: errorMessage },
      { status: 500 }
    );
  }
}

// ✅ GET route - Sends to your actual email to check template
export async function GET() {
  try {
    console.log("Sending test welcome email to brent.mcph@gmail.com");

    // ✅ Send to your actual email address
    const result = await sendWelcomeEmail("brent.mcph@gmail.com", "Brent Jude");

    console.log("Email test result:", result);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Test welcome email sent successfully to brent.mcph@gmail.com! Check your inbox."
        : "Failed to send test email",
      error: result.error || null,
      testInfo: {
        recipient: "brent.mcph@gmail.com",
        name: "Brent Jude",
        note: "Check your email inbox to see how the template looks!",
      },
    });
  } catch (error) {
    console.error("Quick test email error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to send quick test email", details: errorMessage },
      { status: 500 }
    );
  }
}