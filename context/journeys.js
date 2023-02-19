import { createContext, useContext } from 'react';
import { useRouter, withRouter } from 'next/router';
import useSWR from 'swr';
import React, { useState, useRef, useEffect } from 'react';
import { fetcher } from "../hooks/useFetch"
const AppContext = createContext();

export function AppWrapper({ children }) {
    const router = useRouter();
    const _id = router.query.id;
    const { data: journeys, errorJourneys } = useSWR(['/api/journeys/journeysdata', 'all'], fetcher);
    useEffect(() => {
    }, []);
    let sharedState = journeys

    if (errorJourneys) return <div>Journeys not found</div>;
    if (!journeys) return <div>loadings...</div>;

    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}