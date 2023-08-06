import {fetchThreads} from "@/lib/actions/thread.actions";
import {currentUser} from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";

export default async function Page() {
    const result = await fetchThreads({pageNumber:1,pageSize:30});
    const user = await currentUser();
    console.log(result);
    return (
        <div>
            <h1 className={'head-text text-left'}>Home</h1>
            <section className={'mt-9 flex flex-col gap-10'}>
                {result.threads.length === 0 ? (
                    <p className={'no-result'}>No threads</p>
                ): (
                    result.threads.map(thread =>
                        <ThreadCard key={thread._id} id={thread._id} currentUser={user?.id} parentId={thread.parentId}
                                    content={thread.text} author={thread.author} community={thread.community}
                                    createdAt={thread.createdAt} comments={thread.comments}/>)
                )}
            </section>
        </div>
    )
}