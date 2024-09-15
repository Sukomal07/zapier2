import prisma from "@repo/db/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-events"

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const producer = kafka.producer()
    await producer.connect()
    while (1) {
        const pandingRows = await prisma.zapRunOutbox.findMany({
            take: 10
        })
        producer.send({
            topic: TOPIC_NAME,
            messages: pandingRows.map(r => ({
                value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
            }))
        })

        await prisma.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pandingRows.map(r => r.id)
                }
            }
        })
        await new Promise(r => setTimeout(r, 3000))
    }
}

main()