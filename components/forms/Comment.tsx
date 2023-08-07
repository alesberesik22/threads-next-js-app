"use client"

import React from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {CommentValidation} from "@/lib/validations/thread";
import {Input} from "@/components/ui/input";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import {functionAddCommentToThread} from "@/lib/actions/thread.actions";

type Props = {
    threadId: string;
    image: string;
    currentUserId: string;
}
const Comment: React.FC<Props> = ({currentUserId, threadId, image}) => {
    const router = useRouter();
    const pathName = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await functionAddCommentToThread(threadId, values.comment, JSON.parse(currentUserId), pathName);

        form.reset();
    }

    return (
        <Form {...form}>
            <form
                className='flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='comment'
                    render={({field}) => (
                        <FormItem className='flex items-center w-full'>
                            <FormLabel className={''}>
                                <Image src={image} alt={'userImage'} width={48} height={48}
                                       className={'rounded-full object-contain'}/>
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input placeholder={'Comment...'} type={'text'}
                                       className={'no-focus text-light-1 outline-none mt-0'} {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                <button type="submit" className={'comment-form_btn'}>Reply</button>
            </form>
        </Form>
    );
};

export default Comment;
