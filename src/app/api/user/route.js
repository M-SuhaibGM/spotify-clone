
import { NextResponse } from 'next/server.js';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
const prisma = new PrismaClient()

export async function POST(req, res) {



    try {
        const data = await req.formData();
        const pic = data.get("pic");
        const song = data.get("song");
        const title = data.get("title");
        const desc = data.get("desc");
        console.log(data)
        if (!pic || !song || !title || !desc) {
            return NextResponse.json({ message: 'Please provide all required fields' });
        }
        const PicName = `${Date.now()}-${pic.name}`;
        const songName = `${Date.now()}-${song.name}`;
        const coverPicBuffer = await pic.arrayBuffer();
        const coverBuffer = Buffer.from(coverPicBuffer);
        const coverPath = `./public/pic/${PicName}`;
        await writeFile(coverPath, coverBuffer);

        const songBuffer = await song.arrayBuffer();
        const songFileBuffer = Buffer.from(songBuffer);
        const songPath = `./public/songs/${songName}`;
        await writeFile(songPath, songFileBuffer);

        // Create user
        const createUser = await prisma.new_table.create({
            data: {
                pic: PicName,
                song: songName,
                title: title,
                desc: desc,
            },
        });

        return NextResponse.json({ createUser, message: "Created Successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const newUser = await prisma.new_table.findMany()
        return NextResponse.json(newUser);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error GETTING posts' });
    }
}

export async function PUT(req, res) {
    try {

        const likedSongs = await req.json()
        const liked = likedSongs.liked
        const songIds = liked.map((song) => song.songid)
        const newData = await prisma.new_table.findMany({
            where: {
                id: {
                    in: songIds,
                },
            },
        });
        return NextResponse.json(newData);
    } catch (error) {
        console.error(error);
        return NextResponse.json('Internal Server Error');
    }
}

