import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (session) {
            return NextResponse.json({ authenticated: true, user: session.user }, { status: 200 })
        } else {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}