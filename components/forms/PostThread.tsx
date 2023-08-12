"use client"

import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import {Textarea} from "@/components/ui/textarea";
import {useUploadThing} from "@/lib/uploadThing";
import {usePathname, useRouter} from "next/navigation";
import {ThreadValidation} from "@/lib/validations/thread";
import {createThread} from "@/lib/actions/thread.actions";
import {useOrganization} from "@clerk/nextjs";

const PostThread = ({userId}: { userId: string }) => {
    const [files, setFiles] = useState<File[]>([]);
    const {startUpload} = useUploadThing("media");
    const organization = useOrganization();
    const router = useRouter();
    const pathName = usePathname();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        },
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: organization.organization ? organization.organization.id : null,
            path: pathName,
        });

        router.push("/");
    };

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({field}) => (
                        <FormItem className='flex flex-col w-full mt-10'>
                            <FormLabel className={'py-0.5 text-light-1'}>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 text-light-1'>
                                <Textarea
                                    rows={15}
                                    className={'resize-none'}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className={'bg-primary-500'}>Post thread</Button>
            </form>
        </Form>
    );
};

export default PostThread;
