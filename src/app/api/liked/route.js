
import { NextResponse } from 'next/server.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


export async function POST(req, res) {
    const data = await req.json();
    const sondid = data.id
    // Validation
    if (!sondid) {
        return NextResponse.json({ message: 'Please provide all required fields' });
    }
    const createUser = await prisma.liked.create({
        data: {
            songid: sondid,
        },
    });
    const newUser = await prisma.liked.findMany()
    return NextResponse.json({ newUser, message: "Created Successfully" });

}

export async function GET(req, res) {

    const newUser = await prisma.liked.findMany()
    return NextResponse.json(newUser);

}


export async function DELETE(req, res) {
    const data = await req.json();
    const sondid = data.del
    const deletedSong = await prisma.liked.delete({
        where: { songid: sondid },
    });

    const newUser = await prisma.liked.findMany()
    return NextResponse.json(newUser);

}