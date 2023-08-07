"use server"

import {connectToDB} from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";

interface Params {
    text:string;
    author:string;
    communityId:string | null;
    path:string
}

export async function createThread({ text, author, communityId, path }: Params
) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null, // Assign communityId if provided, or leave it null for personal account
        });

        // Update User model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id },
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

interface FetchParams {
    pageNumber:number;
    pageSize:number
}
export async function fetchThreads({pageNumber=1,pageSize=20}:FetchParams) {
    try {
        connectToDB();

        //calculate number of posts to skip
        const skipAmount = (pageNumber - 1) * pageSize;

        const threadsQuery = Thread.find({parentId: {$in:[null,undefined]}})
            .sort({createdAt:'desc'}).skip(skipAmount).limit(pageSize).populate({path:'author',model:'User'})
            .populate({path:'children',populate:{path:'author',model:'User',select:'_id name parentId image'}})

        const totalPostCount = await Thread.countDocuments({parentId: {$in:[null,undefined]}});

        const threads = await threadsQuery.exec();

        const isNext = totalPostCount > skipAmount + threads.length;
        return {threads, isNext}

    } catch (error) {
        throw new Error(`Error while fetching the threads ${error}`)
    }
}

export async function fetchThreadById(threadId: string) {
    connectToDB();

    try {
        const thread = await Thread.findById(threadId)
            .populate({
                path: "author",
                model: User,
                select: "_id id name image",
            }) // Populate the author field with _id and username
            .populate({
                path: "children", // Populate the children field
                populate: [
                    {
                        path: "author", // Populate the author field within children
                        model: User,
                        select: "_id id name parentId image", // Select only _id and username fields of the author
                    },
                    {
                        path: "children", // Populate the children field within children
                        model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                        populate: {
                            path: "author", // Populate the author field within nested children
                            model: User,
                            select: "_id id name parentId image", // Select only _id and username fields of the author
                        },
                    },
                ],
            })
            .exec();

        return thread;
    } catch (err) {
        console.error("Error while fetching thread:", err);
        throw new Error("Unable to fetch thread");
    }
}

export async function functionAddCommentToThread(threadId:string, text:string, userId:string, path:string){
    connectToDB();

    try {
        const originalThread = await Thread.findById(threadId)
        if (!originalThread){
            throw new Error('No thread created')
        }
        const commentThread = new Thread({
            text:text,
            author:userId,
            parentId:threadId
        });

        const saveNewThread = await commentThread.save();
        originalThread.children.push(saveNewThread._id);
        await originalThread.save();
        revalidatePath(path);

    } catch(error) {
        throw new Error(`Error adding a comment ${error}`)
    }
}