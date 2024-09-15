import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@repo/email/email";
import { verifyOtp, getOtp } from "../../../lib/otpStore";
import prisma from "@repo/db/client";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 })
        }

        const otp = getOtp(email);

        if (!otp) {
            return NextResponse.json({ message: "Please generate otp first" }, { status: 400 })
        }
        const isVerified = verifyOtp(email, otp);

        const mailOption = {
            toMail: email,
            subject: "verification successfull",
            message: `Your email ${email} is verified successfully. You can log in now. If you not generate verification otp please ignore.`
        }

        try {
            if (isVerified) {
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                })

                if (!user) {
                    return NextResponse.json({ message: "User not found" }, { status: 404 })
                }
                await sendMail(mailOption)

                user.verified = true;
                return NextResponse.json({ message: "Email verify successfully" }, { status: 200 })
            }

        } catch (error) {
            return NextResponse.json({ message: "Failed to verify OTP" }, { status: 500 })
        }

    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}