import React, {FunctionComponent, useState} from "react";
import type { ReactNode } from 'react';
import Head from 'next/head'
import styles from '../styles/All.module.css';
import Menus from "./Menus";



const Layout: FunctionComponent<ReactNode> = ({children}) => {
    console.log("typeof ", typeof children)

    return (
        <div className={styles.layoutDiv}>
            <Head>
                <title>PUCKFACE</title>
                <meta name="description" content="digital hockey cards" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.menus}>
                <Menus/>
            </div>
            <div className={styles.mainDiv}>
                {children}
              
            </div>

        </div>
    )
}
export default Layout;