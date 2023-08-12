import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {formatDateString} from "@/lib/utils";

type Props = {
    id:string;
    currentUser?:string;
    parentId:string | null;
    content:string;
    author:{name:string,image:string,id:string};
    community:{name:string,image:string,id:string} | null;
    createdAt:string;
    comments:{author:{image:string}}[];
    isComment?:boolean;
}
const ThreadCard:React.FC<Props> = (props) => {
    const {author,comments,isComment,content,createdAt,community,parentId,id,currentUser} = props;
    return (
        <article className={`${isComment ? 'px-0 xs:px-7 bg-dark-1 p-7' : 'flex w-full flex-col rounded-xl bg-dark-2 p-7'}`}>
            <div className={'flex justify-between items-start'}>
                <div className={'w-full flex flex-1 flex-grow gap-4'}>
                    <div className={'flex flex-col items-center'}>
                        <Link href={`/profile/${author.id}`} className={'relative h-11 w-11'}>
                            <Image src={author.image} alt={'Profile image'} className={'cursor-pointer rounded-full'} fill/>
                        </Link>
                        <div className={'thread-card_bar'}/>
                    </div>
                    <div className={'flex w-full flex-col'}>
                        <Link href={`/profile/${author.id}`} className={'w-fit'}>
                            <h4 className={'cursor-pointer text-base-semibold text-light-1'}>{author.name}</h4>
                        </Link>
                        <p className={'empty:2 text-small-regular text-light-2'}>{content}</p>
                        <div className={'mt-5 flex flex-col gap-3'}>
                            <div className={'flex gap-3.5'}>
                                <Image src={'/heart-gray.svg'} alt={'hearth'} width={24} height={24} className={'cursor-pointer object-contain'}/>
                                <Link href={`/thread/${id}`}>
                                    <Image src={'/reply.svg'} alt={'reply'} width={24} height={24} className={'cursor-pointer object-contain'}/>
                                </Link>
                                <Image src={'/repost.svg'} alt={'repost'} width={24} height={24} className={'cursor-pointer object-contain'}/>
                                <Image src={'/share.svg'} alt={'share'} width={24} height={24} className={'cursor-pointer object-contain'}/>
                            </div>
                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className={'mt-1 text-subtle-medium text-gray-1'}>{comments.length} replies</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {!isComment && community && (
                <Link href={`/communities/${community.id}`} className={'mt-5 flex items-center'}>
                    <p className={'text-subtle-medium text-gray-1'}>
                        {formatDateString(createdAt)}
                        - {community.name} Community
                    </p>
                    <Image src={community.image} alt={'community'} width={14} height={14} className={'ml-1 rounded-full object-cover'}/>
                </Link>
            )}
        </article>
    );
};

export default ThreadCard;
