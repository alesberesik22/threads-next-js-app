import React from 'react';
import ThreadCard from "@/components/cards/ThreadCard";
import {currentUser} from "@clerk/nextjs";
import {fetchUser} from "@/lib/actions/user.action";
import {redirect} from "next/navigation";
import {fetchThreadById} from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

const Page = async ({params}: { params: { id: string } }) => {
    if (!params) return null;
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id);
    console.log(thread);
    return (
        <section className={'relative'}>
            <div>
                <ThreadCard key={thread._id} id={thread._id} currentUser={user?.id} parentId={thread.parentId}
                            content={thread.text} author={thread.author} community={thread.community}
                            createdAt={thread.createdAt} comments={thread.comments}/>
            </div>
            <div className={'mt-7'}>
                <Comment threadId={thread.id} image={userInfo.image} currentUserId={JSON.stringify(userInfo._id)}/>
            </div>
            <div className={'mt-10'}>
                {thread.children.map((children:any) => (
                    <ThreadCard key={children._id} id={children._id} currentUser={user?.id} parentId={children.parentId}
                                content={children.text} author={children.author} community={children.community}
                                createdAt={children.createdAt} comments={children.children} isComment={true}/>
                ))}
            </div>
        </section>
    );
};

export default Page;
