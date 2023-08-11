import React from 'react';
import {fetchUserPosts} from "@/lib/actions/user.action";
import {redirect} from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";

type Props = {
    currentUserId: string
    accountId: string
    accountType: string
}
const ThreadsTab: React.FC<Props> = async ({accountType, accountId, currentUserId}) => {
    const threads = await fetchUserPosts(accountId);
    console.log(threads);

    if (!threads) redirect('/')
    return (
        <section className={'mt-9 flex flex-col gap-10'}>
            {threads.threads.map((thread: any) => (
                <ThreadCard key={thread._id} id={thread._id} currentUser={currentUserId} parentId={thread.parentId}
                            content={thread.text} author={accountType === 'User' ? {
                    name: threads.name,
                    image: threads.image,
                    id: threads.id
                } : {name: thread.author.name, image: thread.author.image, id: thread.autorh.id}}
                            community={thread.community}
                            createdAt={thread.createdAt} comments={thread.comments}/>
            ))}
        </section>
    );
};

export default ThreadsTab;
