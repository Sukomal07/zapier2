import express from "express";
import cors from "cors";
import prisma from "@repo/db/client";

const app = express();

app.use(express.json())
app.use(cors())

app.post('/hooks/catch/:userId/:zapId', async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body

    if (!userId || !zapId) {
        return res.status(400).json({
            message: "userId and zapId is required"
        })
    }

    await prisma.$transaction(async tx => {
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        })
        await tx.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        })
    })

    res.status(200).json({
        message: "Webhook receive"
    })
})

app.listen(3001, () => {
    console.log("App is running on 3001")
})