import React, {FunctionComponent, useState} from "react";
import type { ReactNode } from 'react';
import Head from 'next/head'
import styles from '../styles/All.module.css';
import Menus from "./Menus";
import { useDashboard } from "../context/DashboardContext";
import Notification from './Notification';



const Layout: FunctionComponent<ReactNode> = ({children}) => {
    const {notification} = useDashboard();

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
            {notification !== null && <Notification notObj={notification}/>}
        </div>
    )
}
export default Layout;