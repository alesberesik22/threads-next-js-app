"use client"

import React from 'react';
import {sidebarLinks} from "@/constants";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";

const Bottombar = () => {
    const pathName = usePathname();

    return (
        <section className={'bottombar'}>
            <div className={'bottombar_container'}>
                {sidebarLinks.map(link => {
                    const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route
                    return (
                        <Link href={link.route} key={link.label} className={`${isActive && 'bg-primary-500'} bottombar_link`}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
                            <p className={'text-subtle-medium max-sm:hidden text-white'}>{link.label.split(' ')[0]}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
};

export default Bottombar;
