import { NextFunction, Request, Response } from "express";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await fetch(`${process.env.FRONTEND_URL}/api/validate-session`, {
            method: 'GET'
        })

        const data = await response.json();

        if (data.authenticated) {
            req.user = data.user
            return next();
        }

        res.status(401).json({ message: "Unauthorized. Please log in." });
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}