import React from 'react';
import {fetchUserPosts} from "@/lib/actions/user.action";
import {redirect} from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";
import {fetchCommunityPosts} from "@/lib/actions/community.actions";

type Props = {
    currentUserId: string
    accountId: string
    accountType: string
}
const ThreadsTab: React.FC<Props> = async ({accountType, accountId, currentUserId}) => {
    let result: any;

    if(accountType === 'Community') {
        result = await fetchCommunityPosts(accountId);
    } else {
        result = await fetchUserPosts(accountId);
    }

    if (!result) redirect('/')

    console.log(result);

    return (
        <section className={'mt-9 flex flex-col gap-10'}>
            {result.threads.map((thread: any) => (
                <ThreadCard key={thread._id} id={thread._id} currentUser={currentUserId} parentId={thread.parentId}
                            content={thread.text} author={accountType === 'User' ? {
                    name: result.name,
                    image: result.image,
                    id: result.id
                } : {name: thread.author.name, image: thread.author.image, id: thread.author.id}}
                            community={thread.community}
                            createdAt={thread.createdAt} comments={thread.comments}/>
            ))}
        </section>
    );
};

export default ThreadsTab;
